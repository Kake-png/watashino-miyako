// Fixed screen-space lanes keep positions independent of selection order.
export const ROUTE_LANES = {
  'jr-keihin-tohoku': -12,
  'jr-yamanote': 0,
  'jr-saikyo': -24,
  'jr-shonan-shinjuku': 12,
  'jr-tokaido': -36,
  'jr-yokosuka': 24,
  'jr-nambu': 0,
  'keikyu-main': 0,
  'tokyu-meguro': -6,
  'tokyu-toyoko': 6
};

export function offsetRoutePoints(points, offset = 0) {
  if (!offset || points.length < 2) return points.map(({x, y}) => ({x, y}));
  return points.map((point, index) => {
    let before = index - 1;
    let after = index + 1;
    // Skip repeated coordinates before calculating the local corridor direction.
    while (before >= 0 && Math.hypot(point.x - points[before].x, point.y - points[before].y) < 0.01) before--;
    while (after < points.length && Math.hypot(point.x - points[after].x, point.y - points[after].y) < 0.01) after++;
    const a = points[Math.max(before, 0)];
    const b = points[Math.min(after, points.length - 1)];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const length = Math.hypot(dx, dy);
    if (length < 0.01) return {x: point.x, y: point.y};
    let nx = -dy / length;
    let ny = dx / length;
    // Canonical screen-side normal: reversing source coordinates must not swap lanes.
    if (nx < -0.00001 || (Math.abs(nx) <= 0.00001 && ny > 0)) {
      nx = -nx;
      ny = -ny;
    }
    return {x: point.x + nx * offset, y: point.y + ny * offset};
  });
}
