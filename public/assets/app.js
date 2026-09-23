import { ATLAS_DATA } from "/assets/data.js?v=34";

(() => {
  "use strict";

  const { stations, sources, tagLabels, tagCriteria, filterGroups, themePresets, routeGroups, routeLabels, routeGeometry } = ATLAS_DATA;
  const stationBySlug = new Map(stations.map((station) => [station.slug, station]));
  const themeById = new Map(themePresets.map((theme) => [theme.id, theme]));
  const routeById = new Map(routeGroups.flatMap((group) => group.routes.map((route) => [route.id, route])));
  const compareKey = "ekimachi-compare-v1";
  const leaflet = window.L || null;

  const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  })[character]);

  const stationUrl = (station) => `/station/${encodeURIComponent(station.slug)}/`;
  const themeUrl = (theme) => `/themes/${encodeURIComponent(theme.id)}/`;
  const imageUrl = (photo) => `/${String(photo.file).replace(/^\/+/, "")}`;

  function readCompare() {
    try {
      const value = JSON.parse(localStorage.getItem(compareKey) || "[]");
      return Array.isArray(value) ? value.filter((slug) => stationBySlug.has(slug)).slice(0, 3) : [];
    } catch (_error) {
      return [];
    }
  }

  function writeCompare(slugs) {
    const clean = [...new Set(slugs)].filter((slug) => stationBySlug.has(slug)).slice(0, 3);
    try { localStorage.setItem(compareKey, JSON.stringify(clean)); } catch (_error) { /* Storage can be disabled. */ }
    updateCompareCounts(clean.length);
    return clean;
  }

  function updateCompareCounts(count = readCompare().length) {
    document.querySelectorAll("[data-compare-count]").forEach((node) => { node.textContent = String(count); });
  }

  function setupNavigation() {
    const button = document.querySelector(".nav-toggle");
    const nav = document.querySelector("#site-nav");
    if (!button || !nav) return;
    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });
  }

  function makeMarker(station) {
    const marker = document.createElement("span");
    marker.className = "station-map-label";
    marker.style.cssText = "display:inline-flex;align-items:center;justify-content:center;width:max-content;min-width:58px;height:30px;padding:0 9px;border:2px solid #fff8e7;border-radius:3px;background:#1f4b43;color:#fff;box-shadow:0 2px 7px rgb(16 48 42 / 32%);font:700 13px/1.1 system-ui,sans-serif;white-space:nowrap;";
    marker.setAttribute("aria-label", `${station.name}駅の概要を表示`);
    marker.dataset.slug = station.slug;
    marker.textContent = station.name;
    return marker;
  }

  function addStationMarker(map, station, { feature = false, strong = false, popup = true } = {}) {
    const element = makeMarker(station);
    if (feature || strong) element.style.background = "#b34a35";
    const labelWidth = Math.max(58, [...station.name].length * 15 + 20);
    const icon = leaflet.divIcon({
      className: "atlas-label-icon",
      html: element.outerHTML,
      iconSize: [labelWidth, 32],
      iconAnchor: [labelWidth / 2, 16]
    });
    const marker = leaflet.marker([station.lat, station.lng], {
      icon,
      keyboard: true,
      title: `${station.name}駅`
    });
    if (popup) marker.bindPopup(popupHtml(station), { offset: [0, -10], closeButton: false });
    return marker;
  }

  function popupHtml(station) {
    return `<div class="map-popup">
      <small>${escapeHtml(station.area)}の駅ガイド</small>
      <h3>${escapeHtml(station.name)}</h3>
      <p>${escapeHtml(station.descriptor)}</p>
      <a href="${stationUrl(station)}">駅の図譜を読む →</a>
    </div>`;
  }

  async function createMap(containerId, options = {}) {
    const fallback = document.querySelector(options.fallbackSelector || "#map-fallback");
    if (!leaflet) {
      if (fallback) fallback.classList.add("is-visible");
      return null;
    }
    try {
      const [lng, lat] = options.center || [139.7, 35.575];
      const map = leaflet.map(containerId, {
        zoomControl: false,
        attributionControl: false,
        minZoom: 3,
        maxZoom: 19,
        scrollWheelZoom: true
      }).setView([lat, lng], options.zoom || 10.7);
      leaflet.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap contributors"
      }).addTo(map);
      // 背景タイルだけを淡くし、路線・駅ラベルの色と鮮明さは保つ。
      // 暖色の道路表現だけが前に出すぎないよう彩度を抑えつつ、
      // 前回失われた輪郭はコントラストで戻す。路線レイヤーには影響しない。
      map.getPane("tilePane").style.filter = "saturate(0.72) brightness(1.01) contrast(1.08)";
      map.getPane("tilePane").style.opacity = "0.96";
      leaflet.control.zoom({ position: "topright" }).addTo(map);
      map.atlasAttributionControl = leaflet.control.attribution({ position: "bottomleft", prefix: false }).addTo(map);
      map.whenReady(() => {
        if (fallback) fallback.classList.remove("is-visible");
        window.setTimeout(() => map.invalidateSize(), 0);
      });
      return map;
    } catch (_error) {
      if (fallback) fallback.classList.add("is-visible");
      return null;
    }
  }

  async function renderHome() {
    const filterList = document.querySelector("#filter-list");
    const searchInput = document.querySelector("#station-search");
    const stationList = document.querySelector("#station-list");
    const atlasPanel = document.querySelector(".atlas-panel");
    const resultCount = document.querySelector("#result-count");
    const featuredGrid = document.querySelector("#featured-grid");
    const matchMode = document.querySelector("#match-mode");
    const matchModeButtons = document.querySelectorAll("[data-match-mode]");
    const clearFilters = document.querySelector("#clear-filters");
    const themeContext = document.querySelector("#theme-context");
    const featuredTitle = document.querySelector("#featured-title");
    const perspectiveList = document.querySelector("#perspective-list");
    const activeFilterCount = document.querySelector("#active-filter-count");
    const rentMax = document.querySelector("#rent-max");
    const criteriaList = document.querySelector("#criteria-list");
    const routeList = document.querySelector("#route-list");
    const routeMatchMode = document.querySelector("#route-match-mode");
    const clearRoutes = document.querySelector("#clear-routes");
    const activeRouteCount = document.querySelector("#active-route-count");
    const themePathMatch = location.pathname.match(/\/themes\/([^/]+)/);
    const themeId = document.body.dataset.themeId || (themePathMatch && decodeURIComponent(themePathMatch[1])) || new URLSearchParams(location.search).get("theme");
    const activeTheme = themeById.get(themeId) || null;
    if (!filterList || !searchInput || !stationList || !atlasPanel || !resultCount || !featuredGrid || !matchMode || !clearFilters || !themeContext || !perspectiveList || !rentMax || !routeList || !routeMatchMode || !clearRoutes) return;

    const activeTags = new Set();
    const activeRoutes = new Set();
    const markerEntries = [];
    const routeLineLayers = new Map();
    const chipByTag = new Map();
    const chipByRoute = new Map();
    const selectedThemes = new Set(activeTheme ? [activeTheme.id] : []);
    let themeDirty = false;

    function themeScore(station, tags = activeTheme?.tags || []) {
      return tags.reduce((score, tag) => score + Number(station.tags.includes(tag)), 0);
    }

    function updateThemeContext() {
      if (!selectedThemes.size) {
        themeContext.hidden = false;
        themeContext.innerHTML = "<span>選択中：なし</span>";
        return;
      }
      themeContext.hidden = false;
      const labels = [...selectedThemes].map((id) => themeById.get(id)?.navLabel).filter(Boolean);
      themeContext.innerHTML = `<span>選択中：${labels.map(escapeHtml).join("、")}${themeDirty ? "（条件を調整済み）" : ""}</span>`;
    }

    perspectiveList.innerHTML = themePresets.map((theme) => `<button type="button" class="perspective-chip" data-perspective="${escapeHtml(theme.id)}" aria-pressed="${selectedThemes.has(theme.id)}">${escapeHtml(theme.navLabel)}</button>`).join("");

    filterGroups.forEach((group) => {
      const section = document.createElement("section");
      section.className = "filter-group";
      section.innerHTML = `<div class="filter-group-head"><h4>${escapeHtml(group.label)}</h4><p>${escapeHtml(group.note)}</p></div><div class="filter-group-options"></div>`;
      const options = section.querySelector(".filter-group-options");
      group.tags.forEach((key) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "filter-chip";
        button.textContent = tagLabels[key];
        button.title = tagCriteria[key] || "";
        button.dataset.tag = key;
        button.setAttribute("aria-pressed", "false");
        options.append(button);
        chipByTag.set(key, button);
        button.addEventListener("click", () => {
          if (activeTags.has(key)) activeTags.delete(key); else activeTags.add(key);
          button.setAttribute("aria-pressed", String(activeTags.has(key)));
          themeDirty = Boolean(activeTheme);
          updateThemeContext();
          applyFilters();
        });
      });
      filterList.append(section);
    });

    if (criteriaList) criteriaList.innerHTML = filterGroups.flatMap((group) => group.tags).map((key) => `<div><dt>${escapeHtml(tagLabels[key])}</dt><dd>${escapeHtml(tagCriteria[key])}</dd></div>`).join("");

    routeGroups.forEach((group) => {
      const section = document.createElement("section");
      section.className = "route-group";
      section.innerHTML = `<h4>${escapeHtml(group.label)}</h4><div class="route-group-options"></div>`;
      const options = section.querySelector(".route-group-options");
      group.routes.forEach((route) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "route-chip";
        button.textContent = route.label;
        button.dataset.route = route.id;
        button.style.setProperty("--route-color", route.color);
        button.setAttribute("aria-pressed", "false");
        if (route.available === false) {
          button.disabled = true;
          button.title = "掲載駅の追加後に選べます";
        }
        button.addEventListener("click", () => {
          if (activeRoutes.has(route.id)) activeRoutes.delete(route.id); else activeRoutes.add(route.id);
          button.setAttribute("aria-pressed", String(activeRoutes.has(route.id)));
          applyFilters();
        });
        options.append(button);
        chipByRoute.set(route.id, button);
      });
      routeList.append(section);
    });

    matchMode.value = "all";
    routeMatchMode.value = "any";
    updateThemeContext();

    function syncPerspectives() {
      perspectiveList.querySelectorAll("[data-perspective]").forEach((button) => button.setAttribute("aria-pressed", String(selectedThemes.has(button.dataset.perspective))));
      updateThemeContext();
      applyFilters();
    }

    perspectiveList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-perspective]");
      if (!button) return;
      const id = button.dataset.perspective;
      if (selectedThemes.has(id)) selectedThemes.delete(id); else selectedThemes.add(id);
      themeDirty = false;
      syncPerspectives();
    });

    const fallback = document.querySelector("#map-fallback");
    if (fallback) {
      const lngs = stations.map((station) => station.lng), lats = stations.map((station) => station.lat);
      const minLng = Math.min(...lngs), maxLng = Math.max(...lngs), minLat = Math.min(...lats), maxLat = Math.max(...lats);
      fallback.innerHTML = `<p>地図を読み込めないため、駅の位置関係を表示しています。</p><div class="fallback-stations">${stations.map((station) => {
        const left = 8 + ((station.lng - minLng) / (maxLng - minLng || 1)) * 84;
        const top = 8 + (1 - (station.lat - minLat) / (maxLat - minLat || 1)) * 80;
        return `<a href="${stationUrl(station)}" data-fallback-slug="${escapeHtml(station.slug)}" style="left:${left.toFixed(1)}%;top:${top.toFixed(1)}%">${escapeHtml(station.name)}</a>`;
      }).join("")}</div>`;
    }
    const map = await createMap("map");
    if (map) {
      map.atlasAttributionControl?.addAttribution('<a href="https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N02-2025.html" target="_blank" rel="noopener">国土数値情報 鉄道データ（2025年度）</a>を加工');
      stations.forEach((station) => {
        const marker = addStationMarker(map, station, {
          strong: Boolean(activeTheme && themeScore(station) >= 2)
        }).addTo(map);
        markerEntries.push({ station, marker });
      });
    }

    const coordinateKey = ([lng, lat]) => `${lng},${lat}`;
    const routeDisplayOffsets = new Map([
      ["jr-keihin-tohoku", -6],
      ["jr-tokaido", 0],
      ["jr-shonan-shinjuku", 6],
      ["jr-yokosuka", 12],
      ["jr-yamanote", -4],
      ["jr-saikyo", 4]
    ]);

    function mergeConnectedLines(lines) {
      const remaining = lines.map((line) => [...line]);
      const merged = [];
      while (remaining.length) {
        const line = remaining.shift();
        let extended = true;
        while (extended) {
          extended = false;
          for (let index = 0; index < remaining.length; index += 1) {
            const candidate = remaining[index];
            const lineStart = coordinateKey(line[0]);
            const lineEnd = coordinateKey(line.at(-1));
            const candidateStart = coordinateKey(candidate[0]);
            const candidateEnd = coordinateKey(candidate.at(-1));
            if (lineEnd === candidateStart) line.push(...candidate.slice(1));
            else if (lineEnd === candidateEnd) line.push(...[...candidate].reverse().slice(1));
            else if (lineStart === candidateEnd) line.unshift(...candidate.slice(0, -1));
            else if (lineStart === candidateStart) line.unshift(...[...candidate].reverse().slice(0, -1));
            else continue;
            remaining.splice(index, 1);
            extended = true;
            break;
          }
        }
        merged.push(line);
      }
      return merged;
    }

    function routeCoordinates(routeId) {
      const geometry = routeGeometry[routeId];
      if (!geometry?.features?.length) return [];
      const lines = geometry.features.flatMap((feature) => {
        if (feature.geometry.type === "LineString") return [feature.geometry.coordinates];
        if (feature.geometry.type === "MultiLineString") return feature.geometry.coordinates;
        return [];
      });
      return mergeConnectedLines(lines);
    }

    function offsetRouteCoordinates(routeId, coordinates) {
      if (coordinates.length < 2) return coordinates.map(([lng, lat]) => [lat, lng]);
      const rawPoints = coordinates.map(([lng, lat]) => map.latLngToLayerPoint([lat, lng]));
      // 引きの縮尺では短い測量点を間引いてからレーンをずらす。
      // これにより、細かな折れが太いギザギザとして見えるのを防ぐ。
      const simplifyTolerance = map.getZoom() <= 11 ? 2.5 : 0.8;
      const points = leaflet.LineUtil?.simplify
        ? leaflet.LineUtil.simplify(rawPoints, simplifyTolerance)
        : rawPoints;
      const offset = routeDisplayOffsets.get(routeId) || 0;
      if (!offset) return points.map((point) => map.layerPointToLatLng(point));
      const segmentVectors = [];

      // points は上で間引かれているため、元データではなく points の点数を使う。
      // 元データの点数で回すと、補正のある路線だけ未定義点を参照して描画が止まる。
      for (let index = 1; index < points.length; index += 1) {
        const startPoint = points[index - 1];
        const endPoint = points[index];
        const dx = endPoint.x - startPoint.x;
        const dy = endPoint.y - startPoint.y;
        const length = Math.hypot(dx, dy) || 1;
        segmentVectors.push({ x: (-dy / length) * offset, y: (dx / length) * offset });
      }

      return points.map((point, index) => {
        const previous = segmentVectors[index - 1];
        const next = segmentVectors[index];
        const count = Number(Boolean(previous)) + Number(Boolean(next));
        const x = point.x + ((previous?.x || 0) + (next?.x || 0)) / count;
        const y = point.y + ((previous?.y || 0) + (next?.y || 0)) / count;
        return map.layerPointToLatLng([x, y]);
      });
    }

    function syncRouteLines() {
      if (!map || !leaflet?.polyline) return;
      routeLineLayers.forEach((layer) => layer.remove());
      routeLineLayers.clear();
      const routeIds = [...activeRoutes];
      routeIds.forEach((routeId) => {
        const route = routeById.get(routeId);
        if (!route) return;
        const lines = routeCoordinates(routeId).flatMap((coordinates) => {
          let displayCoordinates;
          try {
            displayCoordinates = offsetRouteCoordinates(routeId, coordinates);
          } catch (error) {
            // 路線表示の補助処理が失敗しても、絞り込み操作そのものは止めない。
            console.warn(`Route display fallback: ${routeId}`, error);
            displayCoordinates = coordinates.map(([lng, lat]) => [lat, lng]);
          }
          if (displayCoordinates.length < 2) return [];
          return [leaflet.polyline(
            displayCoordinates,
            { color: route.color, weight: 5, opacity: 0.96, lineCap: "round", lineJoin: "round", smoothFactor: 1.2, interactive: false }
          )];
        });
        if (!lines.length) return;
        const layer = leaflet.layerGroup(lines).addTo(map);
        routeLineLayers.set(routeId, layer);
      });
    }

    if (map) map.on("zoomend", syncRouteLines);

    function rowHtml(station, index) {
      const nearbySelected = [...activeRoutes].filter((route) => station.nearbyRoutes.includes(route));
      const nearbyNote = nearbySelected.length
        ? `<small class="nearby-route-note">近隣駅：${nearbySelected.map((route) => escapeHtml(routeLabels[route])).join("・")}</small>`
        : "";
      return `<a class="station-row" href="${stationUrl(station)}" data-slug="${station.slug}">
        <span class="row-code">${String(index + 1).padStart(2, "0")}</span>
        <span><h3>${escapeHtml(station.name)}</h3><p>${escapeHtml(station.area)} · ${escapeHtml(station.lines.join(" / "))}</p>${nearbyNote}</span>
        <span class="row-status" aria-hidden="true">→</span>
      </a>`;
    }

    function currentMatches() {
      const query = searchInput.value.trim().toLocaleLowerCase("ja");
      const selectedTags = [...activeTags];
      const selectedRoutes = [...activeRoutes];
      const maximumRent = Number(rentMax.value) || null;
      const selectedThemeObjects = [...selectedThemes].map((id) => themeById.get(id)).filter(Boolean);
      const matches = stations.filter((station) => {
        const text = [station.name, station.kana, station.area, ...station.lines, ...station.routes.map((route) => routeLabels[route])].join(" ").toLocaleLowerCase("ja");
        const textMatches = !query || text.includes(query);
        const tagsMatch = selectedTags.length === 0 || (matchMode.value === "any"
          ? selectedTags.some((tag) => station.tags.includes(tag))
          : selectedTags.every((tag) => station.tags.includes(tag)));
        const rentMatches = maximumRent === null || station.rent1k <= maximumRent;
        const routesMatch = selectedRoutes.length === 0 || (routeMatchMode.value === "all"
          ? selectedRoutes.every((route) => station.routes.includes(route))
          : selectedRoutes.some((route) => station.routes.includes(route)));
        const themesMatch = selectedThemeObjects.every((theme) => (theme.matchMode === "all"
          ? theme.tags.every((tag) => station.tags.includes(tag))
          : theme.tags.some((tag) => station.tags.includes(tag))));
        return textMatches && tagsMatch && themesMatch && rentMatches && routesMatch;
      });
      if (selectedTags.length && matchMode.value === "any") {
        matches.sort((a, b) => themeScore(b, selectedTags) - themeScore(a, selectedTags));
      }
      return matches;
    }

    function applyFilters() {
      const previousPanelScroll = atlasPanel.scrollTop;
      const previousPageScroll = window.scrollY;
      const matches = currentMatches();
      const visible = new Set(matches.map((station) => station.slug));
      syncRouteLines();
      resultCount.textContent = `${matches.length}駅`;
      if (activeFilterCount) activeFilterCount.textContent = `${activeTags.size + selectedThemes.size + Number(Boolean(rentMax.value))}件選択`;
      if (activeRouteCount) activeRouteCount.textContent = activeRoutes.size ? `${activeRoutes.size}路線を選択` : "選択なし";
      stationList.innerHTML = matches.length
        ? matches.map(rowHtml).join("")
        : '<p class="station-list-empty">該当する駅がありません。条件を一つ外してみてください。</p>';
      if (window.matchMedia("(min-width: 721px)").matches) {
        if (!stationList.dataset.stableHeight) {
          const firstRow = stationList.querySelector(".station-row");
          if (firstRow) stationList.dataset.stableHeight = String(Math.ceil(firstRow.getBoundingClientRect().height * stations.length));
        }
        if (stationList.dataset.stableHeight) stationList.style.minHeight = `${stationList.dataset.stableHeight}px`;
      } else {
        stationList.style.minHeight = "";
      }
      markerEntries.forEach(({ station, marker }) => {
        if (visible.has(station.slug)) marker.addTo(map);
        else marker.remove();
      });
      document.querySelectorAll("[data-fallback-slug]").forEach((node) => { node.hidden = !visible.has(node.dataset.fallbackSlug); });
      atlasPanel.scrollTop = previousPanelScroll;
      window.requestAnimationFrame(() => {
        atlasPanel.scrollTop = previousPanelScroll;
        if (window.scrollY !== previousPageScroll) window.scrollTo({ top: previousPageScroll, behavior: "auto" });
      });
    }

    searchInput.addEventListener("input", applyFilters);
    rentMax.addEventListener("change", applyFilters);
    routeMatchMode.addEventListener("change", applyFilters);
    matchModeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        matchMode.value = button.dataset.matchMode;
        matchModeButtons.forEach((candidate) => candidate.setAttribute("aria-pressed", String(candidate === button)));
        themeDirty = Boolean(activeTheme);
        updateThemeContext();
        applyFilters();
      });
    });
    clearFilters.addEventListener("click", () => {
      activeTags.clear();
      selectedThemes.clear();
      rentMax.value = "";
      chipByTag.forEach((button) => button.setAttribute("aria-pressed", "false"));
      themeDirty = Boolean(activeTheme);
      updateThemeContext();
      applyFilters();
    });
    clearRoutes.addEventListener("click", () => {
      activeRoutes.clear();
      chipByRoute.forEach((button) => button.setAttribute("aria-pressed", "false"));
      applyFilters();
    });
    applyFilters();

    const featuredStations = activeTheme
      ? [...stations].sort((a, b) => themeScore(b) - themeScore(a)).slice(0, 6)
      : stations.slice(0, 6);
    if (activeTheme && featuredTitle) featuredTitle.textContent = `${activeTheme.navLabel}の視点で開く駅。`;
    featuredGrid.innerHTML = featuredStations.map((station) => {
      const photo = sources[station.images[0]];
      return `<a class="feature-link" href="${stationUrl(station)}">
        <div class="feature-image"><img src="${escapeHtml(imageUrl(photo))}" alt="${escapeHtml(photo.alt)}" loading="lazy" width="1200" height="900"></div>
        <div class="feature-copy"><small>${escapeHtml(station.area)}</small><h3>${escapeHtml(station.name)}</h3><p>${escapeHtml(station.descriptor)}</p></div>
      </a>`;
    }).join("");
  }

  function defaultsFor(station) {
    return {
      strengths: station.strengths || [
        `${station.lines.length}路線を軸に移動を組み立てられる`,
        tagLabels[station.tags[0]] ? `${tagLabels[station.tags[0]]}という見方ができる` : "駅前と住宅側の違いを比べられる"
      ],
      cautions: station.cautions || [
        "基礎版のため、住む方向と時間帯は現地で確認したい",
        "店舗・工事・運行情報は公式情報で再確認が必要"
      ],
      walk: station.walk || [
        ["0–3分", "駅前", "改札から出口ごとの店・道路・人の流れを確認する。"],
        ["3–7分", "生活の通り", "日常の買い物と、幹線道路・線路を越える経路を見る。"],
        ["7–12分", "住宅地", "道幅、坂、夜の明るさ、駅までの戻りやすさを確かめる。"]
      ],
      notes: station.notes || {
        transport: `${station.lines.join("、")}を利用できる。路線名だけでなく、改札・ホームまでの移動も現地で確認したい。`,
        daily: `「${station.descriptor}」という街の骨格を、普段使う店と帰宅経路から確かめる。`,
        atmosphere: station.summary,
        weekend: "平日夜と休日昼に歩き、店の開き方や人通りの違いを見ると生活を想像しやすい。"
      }
    };
  }

  function distance(a, b) {
    const x = (a.lng - b.lng) * Math.cos(((a.lat + b.lat) / 2) * Math.PI / 180);
    const y = a.lat - b.lat;
    return Math.sqrt(x * x + y * y);
  }

  function relatedStations(station) {
    return stations.filter((candidate) => candidate.slug !== station.slug)
      .map((candidate) => ({ candidate, tagScore: candidate.tags.filter((tag) => station.tags.includes(tag)).length, distance: distance(station, candidate) }))
      .sort((a, b) => (b.tagScore - a.tagScore) || (a.distance - b.distance))
      .slice(0, 3)
      .map(({ candidate }) => candidate);
  }

  function renderPhoto(sourceKey, index) {
    const photo = sources[sourceKey];
    if (!photo) return "";
    return `<figure class="photo-item">
      <div class="photo-frame"><img src="${escapeHtml(imageUrl(photo))}" alt="${escapeHtml(photo.alt)}" loading="lazy" width="1200" height="900"></div>
      <figcaption><p><b>${String(index + 1).padStart(2, "0")}.</b> ${escapeHtml(photo.caption)}</p>
      <div class="photo-credit">${escapeHtml(photo.date)}撮影 · <a href="${escapeHtml(photo.sourceUrl)}" rel="external noopener">${escapeHtml(photo.author)}</a> · <a href="${escapeHtml(photo.licenseUrl)}" rel="license external noopener">${escapeHtml(photo.license)}</a> · ${escapeHtml(photo.changes)}</div></figcaption>
    </figure>`;
  }

  async function renderStation() {
    const root = document.querySelector("#station-page");
    if (!root) return;
    const params = new URLSearchParams(location.search);
    const pathMatch = location.pathname.match(/\/station\/([^/]+)/);
    const slug = document.body.dataset.stationSlug || params.get("slug") || (pathMatch && decodeURIComponent(pathMatch[1])) || "oimachi";
    const station = stationBySlug.get(slug);

    if (!station) {
      document.title = "駅が見つかりません｜駅まち図譜";
      root.innerHTML = `<div class="not-found"><p class="kicker">Not found</p><h1>駅が見つかりません。</h1><p><a class="button" href="/#atlas">地図から探す</a></p></div>`;
      return;
    }

    const editorial = defaultsFor(station);
    const related = relatedStations(station);
    const photos = station.images || [];
    const leadPhoto = sources[photos[0]];
    const practical = station.practical || {};
    const rentCopy = `1K平均 ${station.rent1k.toFixed(2)}万円（駅徒歩10分以内・管理費等を除く、2026年9月22日確認）。${practical.cost}`;
    const stationThemes = themePresets
      .map((theme) => ({ theme, score: theme.tags.filter((tag) => station.tags.includes(tag)).length }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(({ theme }) => theme);
    document.title = `${station.name}｜駅まち図譜`;
    const description = document.querySelector('meta[name="description"]') || document.head.appendChild(document.createElement("meta"));
    description.name = "description";
    description.content = `${station.name}駅の交通、買い物、街の特徴を、地図と写真を交えて紹介します。`;

    root.innerHTML = `
      <nav class="breadcrumb" aria-label="パンくず"><a href="/">南東京</a> / <span>${escapeHtml(station.area)}</span> / <strong>${escapeHtml(station.name)}</strong></nav>
      <section class="station-hero">
        <div class="station-hero-copy">
          <div class="station-meta">${station.lines.map((line) => `<span class="line-label">${escapeHtml(line)}</span>`).join("")}</div>
          <h1>${escapeHtml(station.name)}</h1><p class="station-kana">${escapeHtml(station.kana)} · ${escapeHtml(station.area)}</p>
          <p class="station-descriptor">${escapeHtml(station.descriptor)}</p><p class="station-summary">${escapeHtml(station.summary)}</p>
          <div class="hero-actions"><button class="button" type="button" data-compare-toggle="${station.slug}">比較に追加</button><a class="button secondary" href="/compare/">比較表を見る</a></div>
        </div>
        <figure class="station-lead-photo">
          <img src="${escapeHtml(imageUrl(leadPhoto))}" alt="${escapeHtml(leadPhoto.alt)}" width="1200" height="900">
          <figcaption><span>街の入口</span><p>${escapeHtml(leadPhoto.caption)}</p><small>${escapeHtml(leadPhoto.date)} · ${escapeHtml(leadPhoto.author)} · ${escapeHtml(leadPhoto.license)}</small></figcaption>
        </figure>
      </section>
      <section class="station-facts" aria-label="暮らしの要点">
        <div><small>1K家賃目安</small><p>${escapeHtml(rentCopy)}</p></div>
        <div><small>車と道路</small><p>${escapeHtml(practical.car)}</p></div>
        <div><small>散歩・自転車</small><p>${escapeHtml(practical.outdoors)}</p></div>
      </section>
      <nav class="station-lenses" aria-label="別の暮らしの視点で探す"><span>この駅を入口に、別の視点へ</span>${stationThemes.map((theme) => `<a href="${themeUrl(theme)}#atlas">${escapeHtml(theme.navLabel)}</a>`).join("")}<a href="/#atlas">すべての視点</a></nav>
      <div class="station-body">
        <aside class="station-index"><h2>目次</h2><ol><li><a href="#viewpoint">特徴と確認点</a></li><li><a href="#station-map-section">地図で確認</a></li><li><a href="#photos">街の写真</a></li><li><a href="#life">暮らしのポイント</a></li><li><a href="#related">近い候補</a></li></ol></aside>
        <article class="station-content">
          <section class="content-section" id="viewpoint"><p class="section-kicker">Station notes</p><h2>この駅の特徴と確認点。</h2>
            <div class="split-notes"><div class="split-note"><h3>この駅の強み</h3><ul>${editorial.strengths.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div><div class="split-note"><h3>住む前の確認点</h3><ul>${editorial.cautions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div></div>
          </section>
          <section class="content-section" id="station-map-section"><p class="section-kicker">Map</p><h2>駅周辺を地図で確認。</h2><div class="content-map"><div class="mini-map" id="station-map" aria-label="${escapeHtml(station.name)}駅周辺の地図"></div><div class="map-fallback" id="station-map-fallback">地図を読み込めませんでした。写真と本文はそのまま利用できます。</div><span class="station-map-note">中心は駅。住む場所を選ぶ時は、出口・線路・幹線道路まで確認を。</span></div></section>
          <section class="content-section" id="photos"><p class="section-kicker">Photos</p><h2>写真で見る街の様子。</h2>${photos.length ? `<div class="photo-walk">${photos.map(renderPhoto).join("")}</div>` : '<div class="photo-empty"><strong>写真は準備中です。</strong><br>権利条件と撮影地点を確認できた写真だけを追加します。写真がなくても、地図と本文でページは利用できます。</div>'}</section>
          <section class="content-section" id="life"><p class="section-kicker">Daily life</p><h2>暮らしのポイント。</h2><div class="life-grid">
            ${[["01", "交通", editorial.notes.transport], ["02", "日常の用事", editorial.notes.daily], ["03", "街の表情", editorial.notes.atmosphere], ["04", "休日と時間帯", editorial.notes.weekend], ["05", "1K家賃目安", rentCopy], ["06", "車と道路", practical.car], ["07", "夜の帰宅", practical.evening]].map(([number, title, copy]) => `<div class="life-note"><small>${number}</small><h3>${title}</h3><p>${escapeHtml(copy)}</p></div>`).join("")}
          </div></section>
          <section class="content-section" id="related"><p class="section-kicker">Keep alternatives</p><h2>一緒に見ておきたい駅。</h2><div class="related-list">${related.map((item) => `<a class="related-item" href="${stationUrl(item)}"><small>${escapeHtml(item.area)}</small><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.descriptor)}</p></a>`).join("")}</div></section>
        </article>
      </div>`;

    const map = await createMap("station-map", { center: [station.lng, station.lat], zoom: 13.2, fallbackSelector: "#station-map-fallback" });
    if (map) {
      addStationMarker(map, station, { feature: true, popup: false }).addTo(map);
    }

    const toggle = root.querySelector("[data-compare-toggle]");
    const refreshToggle = () => {
      const selected = readCompare().includes(station.slug);
      toggle.setAttribute("aria-pressed", String(selected));
      toggle.textContent = selected ? "比較から外す" : "比較に追加";
    };
    toggle.addEventListener("click", () => {
      const current = readCompare();
      writeCompare(current.includes(station.slug)
        ? current.filter((item) => item !== station.slug)
        : [...current.slice(-2), station.slug]);
      refreshToggle();
    });
    refreshToggle();
  }

  function renderCompare() {
    const form = document.querySelector("#compare-form");
    const output = document.querySelector("#compare-output");
    if (!form || !output) return;
    const selects = [document.querySelector("#compare-1"), document.querySelector("#compare-2"), document.querySelector("#compare-3")];
    const options = stations.map((station) => `<option value="${station.slug}">${escapeHtml(station.name)}（${escapeHtml(station.area)}）</option>`).join("");
    selects[0].innerHTML = options;
    selects[1].innerHTML = options;
    selects[2].innerHTML = `<option value="">選択しない</option>${options}`;

    const params = new URLSearchParams(location.search);
    const fromUrl = (params.get("stations") || "").split(",").filter((slug) => stationBySlug.has(slug));
    const initial = [...new Set(fromUrl.length >= 2 ? fromUrl : (readCompare().length >= 2 ? readCompare() : ["oimachi", "omori", "kamata"]))].slice(0, 3);
    selects[0].value = initial[0] || "oimachi";
    selects[1].value = initial[1] || "omori";
    selects[2].value = initial[2] || "";

    function render() {
      const slugs = [...new Set(selects.map((select) => select.value).filter(Boolean))];
      if (slugs.length < 2) {
        output.innerHTML = '<p class="compare-warning">異なる駅を二つ以上選んでください。</p>';
        return;
      }
      const selected = slugs.map((slug) => stationBySlug.get(slug));
      writeCompare(slugs);
      const rows = [
        ["交通", (station) => `<p>${station.lines.length}路線：${escapeHtml(station.lines.join(" / "))}</p>`],
        ["街の概要", (station) => `<p>${escapeHtml(station.descriptor)}</p>`],
        ["向いている暮らし", (station) => `<ul>${defaultsFor(station).strengths.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`],
        ["住む前に確認", (station) => `<ul>${defaultsFor(station).cautions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`],
        ["1K家賃目安", (station) => `<p><strong>${station.rent1k.toFixed(2)}万円</strong></p><small>${escapeHtml(station.rentSource)}</small>`],
        ["車・高速道路", (station) => `<p>${escapeHtml(station.practical.car)}</p>`],
        ["散歩・自転車", (station) => `<p>${escapeHtml(station.practical.outdoors)}</p>`],
        ["夜の帰宅", (station) => `<p>${escapeHtml(station.practical.evening)}</p>`],
        ["生活条件", (station) => `<p>${station.tags.map((tag) => escapeHtml(tagLabels[tag] || tag)).join("・")}</p>`]
      ];
      output.innerHTML = `<table class="compare-table"><colgroup><col class="compare-axis">${selected.map(() => '<col class="compare-station">').join("")}</colgroup><thead><tr><th>比較軸</th>${selected.map((station) => `<th><a class="compare-name" href="${stationUrl(station)}">${escapeHtml(station.name)}</a><span class="compare-descriptor">${escapeHtml(station.descriptor)}</span></th>`).join("")}</tr></thead><tbody>${rows.map(([label, renderCell]) => `<tr><th>${label}</th>${selected.map((station) => `<td>${renderCell(station)}</td>`).join("")}</tr>`).join("")}</tbody></table><div class="compare-actions">${selected.map((station) => `<a class="button secondary" href="${stationUrl(station)}">${escapeHtml(station.name)}の詳細</a>`).join("")}</div>`;
      history.replaceState(null, "", `?stations=${slugs.map(encodeURIComponent).join(",")}`);
    }

    form.addEventListener("submit", (event) => { event.preventDefault(); render(); });
    render();
  }

  function renderCredits() {
    const root = document.querySelector("#credit-list");
    if (!root) return;
    root.innerHTML = `<table class="credit-table"><thead><tr><th>写真</th><th>撮影・公開者</th><th>撮影時期</th><th>利用条件</th><th>変更</th></tr></thead><tbody>${Object.values(sources).map((photo) => `<tr><td><a href="${escapeHtml(photo.sourceUrl)}" rel="external noopener">${escapeHtml(photo.alt)}</a></td><td>${escapeHtml(photo.author)}</td><td>${escapeHtml(photo.date)}</td><td><a href="${escapeHtml(photo.licenseUrl)}" rel="license external noopener">${escapeHtml(photo.license)}</a></td><td>${escapeHtml(photo.changes)}</td></tr>`).join("")}</tbody></table>`;
  }

  setupNavigation();
  updateCompareCounts();
  const page = document.body.dataset.page;
  if (page === "home") renderHome();
  if (page === "station") renderStation();
  if (page === "compare") renderCompare();
  if (page === "credits") renderCredits();
})();
