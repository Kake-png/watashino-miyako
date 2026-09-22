import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ATLAS_DATA } from "../public/assets/data.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "public", "assets", "route-geometry.json");
const outputPath = path.join(root, "public", "assets", "route-display-geometry.json");
const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));

const pointKey = ([lng, lat]) => `${lng},${lat}`;
const distance = ([aLng, aLat], [bLng, bLat]) => {
  const x = (aLng - bLng) * Math.cos(((aLat + bLat) / 2) * Math.PI / 180);
  const y = aLat - bLat;
  return Math.hypot(x, y);
};

function lineLength(coordinates) {
  let total = 0;
  for (let index = 1; index < coordinates.length; index += 1) total += distance(coordinates[index - 1], coordinates[index]);
  return total;
}

function distanceToSegment(point, start, end) {
  const latitudeScale = Math.cos(point[1] * Math.PI / 180);
  const px = point[0] * latitudeScale;
  const py = point[1];
  const ax = start[0] * latitudeScale;
  const ay = start[1];
  const bx = end[0] * latitudeScale;
  const by = end[1];
  const dx = bx - ax;
  const dy = by - ay;
  const divisor = dx * dx + dy * dy;
  const amount = divisor ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / divisor)) : 0;
  return Math.hypot(px - (ax + amount * dx), py - (ay + amount * dy));
}

function distanceToLine(point, coordinates) {
  let closest = Infinity;
  for (let index = 1; index < coordinates.length; index += 1) {
    closest = Math.min(closest, distanceToSegment(point, coordinates[index - 1], coordinates[index]));
  }
  return closest;
}

function geometryLines(collection) {
  return collection.features.flatMap((feature) => {
    if (feature.geometry.type === "LineString") return [feature.geometry.coordinates];
    if (feature.geometry.type === "MultiLineString") return feature.geometry.coordinates;
    return [];
  }).filter((coordinates) => coordinates.length > 1);
}

function representativeLines(collection, anchors) {
  const nodes = [];
  const nodeByKey = new Map();
  const edges = [];
  const adjacency = [];

  const nodeIndex = (coordinate) => {
    const key = pointKey(coordinate);
    if (nodeByKey.has(key)) return nodeByKey.get(key);
    const index = nodes.length;
    nodes.push(coordinate);
    nodeByKey.set(key, index);
    adjacency.push([]);
    return index;
  };

  geometryLines(collection).forEach((coordinates) => {
    for (let index = 1; index < coordinates.length; index += 1) {
      const segment = [coordinates[index - 1], coordinates[index]];
      const a = nodeIndex(segment[0]);
      const b = nodeIndex(segment[1]);
      if (a === b) continue;
      const edge = { a, b, coordinates: segment, length: lineLength(segment) };
      const edgeIndex = edges.push(edge) - 1;
      adjacency[a].push(edgeIndex);
      adjacency[b].push(edgeIndex);
    }
  });

  function shortestPath(start, finish) {
    const costs = Array(nodes.length).fill(Infinity);
    const previousNode = Array(nodes.length).fill(-1);
    const previousEdge = Array(nodes.length).fill(-1);
    const visited = new Set();
    costs[start] = 0;

    while (visited.size < nodes.length) {
      let current = -1;
      let currentCost = Infinity;
      for (let index = 0; index < costs.length; index += 1) {
        if (!visited.has(index) && costs[index] < currentCost) {
          current = index;
          currentCost = costs[index];
        }
      }
      if (current < 0 || current === finish) break;
      visited.add(current);
      adjacency[current].forEach((edgeIndex) => {
        const edge = edges[edgeIndex];
        const next = edge.a === current ? edge.b : edge.a;
        const cost = currentCost + edge.length;
        if (cost < costs[next]) {
          costs[next] = cost;
          previousNode[next] = current;
          previousEdge[next] = edgeIndex;
        }
      });
    }
    if (!Number.isFinite(costs[finish])) return null;

    const pathEdges = [];
    let current = finish;
    while (current !== start) {
      const edgeIndex = previousEdge[current];
      if (edgeIndex < 0) return null;
      pathEdges.push([edgeIndex, previousNode[current], current]);
      current = previousNode[current];
    }
    pathEdges.reverse();

    const coordinates = [];
    pathEdges.forEach(([edgeIndex, from, to], pathIndex) => {
      const edge = edges[edgeIndex];
      const segment = edge.a === from && edge.b === to ? edge.coordinates : [...edge.coordinates].reverse();
      coordinates.push(...(pathIndex ? segment.slice(1) : segment));
    });
    return { coordinates, length: costs[finish] };
  }

  const componentByNode = Array(nodes.length).fill(-1);
  const components = [];
  nodes.forEach((_, start) => {
    if (componentByNode[start] >= 0) return;
    const componentIndex = components.length;
    const componentNodes = [];
    const pending = [start];
    while (pending.length) {
      const current = pending.pop();
      if (componentByNode[current] >= 0) continue;
      componentByNode[current] = componentIndex;
      componentNodes.push(current);
      adjacency[current].forEach((edgeIndex) => {
        const edge = edges[edgeIndex];
        pending.push(edge.a === current ? edge.b : edge.a);
      });
    }
    components.push(componentNodes);
  });

  const anchorComponents = anchors.map((anchor) => {
    let closestNode = 0;
    let closestDistance = Infinity;
    nodes.forEach((coordinate, index) => {
      const currentDistance = distance(anchor, coordinate);
      if (currentDistance < closestDistance) {
        closestDistance = currentDistance;
        closestNode = index;
      }
    });
    return { anchor, node: closestNode, component: componentByNode[closestNode] };
  });
  const selectedComponents = anchors.length
    ? new Set(anchorComponents.map(({ component }) => component))
    : new Set(components.map((_, index) => index));

  return components.flatMap((componentNodes, componentIndex) => {
    if (!selectedComponents.has(componentIndex) || componentNodes.length < 2) return [];
    const componentAnchors = anchorComponents.filter((item) => item.component === componentIndex).map((item) => item.anchor);
    let terminals = componentNodes.filter((index) => adjacency[index].length === 1);
    if (terminals.length < 2) {
      let farthestPair = [componentNodes[0], componentNodes[1]];
      let farthestDistance = -1;
      for (let first = 0; first < componentNodes.length; first += 1) {
        for (let second = first + 1; second < componentNodes.length; second += 1) {
          const currentDistance = distance(nodes[componentNodes[first]], nodes[componentNodes[second]]);
          if (currentDistance > farthestDistance) {
            farthestDistance = currentDistance;
            farthestPair = [componentNodes[first], componentNodes[second]];
          }
        }
      }
      terminals = farthestPair;
    }

    const candidates = [];
    for (let first = 0; first < terminals.length; first += 1) {
      for (let second = first + 1; second < terminals.length; second += 1) {
        const pathResult = shortestPath(terminals[first], terminals[second]);
        if (!pathResult?.coordinates.length) continue;
        const anchorDistances = componentAnchors.map((anchor) => distanceToLine(anchor, pathResult.coordinates));
        candidates.push({
          ...pathResult,
          maxAnchorDistance: anchorDistances.length ? Math.max(...anchorDistances) : 0,
          totalAnchorDistance: anchorDistances.reduce((sum, value) => sum + value, 0)
        });
      }
    }
    candidates.sort((left, right) => {
      const maxBucket = Math.round(left.maxAnchorDistance / 0.00075) - Math.round(right.maxAnchorDistance / 0.00075);
      if (maxBucket) return maxBucket;
      const totalBucket = Math.round(left.totalAnchorDistance / 0.00075) - Math.round(right.totalAnchorDistance / 0.00075);
      if (totalBucket) return totalBucket;
      return right.length - left.length;
    });
    const best = candidates[0];
    if (!best?.coordinates?.length) return [];
    if (best.maxAnchorDistance <= 0.0025 || componentAnchors.length < 2) return [best.coordinates];

    const anchorNodes = [...new Set(anchorComponents
      .filter((item) => item.component === componentIndex)
      .map((item) => item.node))];
    const connected = new Set([anchorNodes[0]]);
    const remaining = new Set(anchorNodes.slice(1));
    const connectingPaths = [];
    while (remaining.size) {
      let closest = null;
      connected.forEach((from) => remaining.forEach((to) => {
        const pathResult = shortestPath(from, to);
        if (pathResult && (!closest || pathResult.length < closest.length)) closest = { ...pathResult, to };
      }));
      if (!closest) break;
      connectingPaths.push(closest.coordinates);
      connected.add(closest.to);
      remaining.delete(closest.to);
    }
    return connectingPaths.length ? connectingPaths : [best.coordinates];
  });
}

const output = {};
for (const [routeId, collection] of Object.entries(source)) {
  const anchors = ATLAS_DATA.stations
    .filter((station) => station.directRoutes.includes(routeId))
    .map((station) => [station.lng, station.lat]);
  const centerlines = representativeLines(collection, anchors);
  output[routeId] = {
    type: "FeatureCollection",
    features: centerlines.map((coordinates) => ({ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates } }))
  };
  console.log(`${routeId}: ${geometryLines(collection).length} sections -> ${centerlines.length} centerline(s), ${centerlines.reduce((sum, line) => sum + line.length, 0)} points`);
}

fs.writeFileSync(outputPath, JSON.stringify(output));
console.log(`Wrote ${Object.keys(output).length} display geometries to ${outputPath}`);
