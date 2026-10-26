// Browser and build-time entry pages use exactly the same matching rules.
export function matchesTheme(station, theme) {
  return theme.matchMode === "all"
    ? theme.tags.every((tag) => station.tags.includes(tag))
    : theme.tags.some((tag) => station.tags.includes(tag));
}

export function filterStations(stations, routeLabels, themePresets, state = {}) {
  const query = (state.query || "").trim().toLocaleLowerCase("ja");
  const tags = state.tags || [];
  const routes = state.routes || [];
  const themes = themePresets.filter((theme) => (state.themes || []).includes(theme.id));
  const preferred = state.preferred || [];
  return stations.filter((station) => {
    const text = [station.name, station.kana, station.area, ...station.lines,
      ...station.routes.map((route) => routeLabels[route])].join(" ").toLocaleLowerCase("ja");
    return (!query || text.includes(query))
      && (!tags.length || (state.matchMode === "any"
        ? tags.some((tag) => station.tags.includes(tag))
        : tags.every((tag) => station.tags.includes(tag))))
      && (!routes.length || (state.routeMode === "all"
        ? routes.every((route) => station.routes.includes(route))
        : routes.some((route) => station.routes.includes(route))))
      && themes.every((theme) => matchesTheme(station, theme))
      && (state.rentMax == null || (Number.isFinite(station.rent1k) && station.rent1k <= state.rentMax));
  }).sort((a,b) => preferred.filter(t=>b.tags.includes(t)).length - preferred.filter(t=>a.tags.includes(t)).length);
}

export function readSearchState(params, data, defaults = {}) {
  const knownTags = new Set(Object.keys(data.tagLabels));
  const knownRoutes = new Set(data.routeGroups.flatMap((group) => group.routes.filter((route) => route.available !== false).map((route) => route.id)));
  const knownThemes = new Set(data.themePresets.map((theme) => theme.id));
  const list = (key, known, fallback) => params.has(key)
    ? [...new Set((params.get(key) || "").split(","))].filter((id) => known.has(id))
    : fallback || [];
  const rent = Number(params.get("rent"));
  return {
    query: (params.get("q") || "").slice(0, 100),
    tags: list("tags", knownTags), preferred: list("wish", knownTags).filter(t => !list("tags", knownTags).includes(t)), routes: list("routes", knownRoutes, defaults.routes),
    themes: list("themes", knownThemes, defaults.themes),
    matchMode: params.get("match") === "any" ? "any" : "all",
    routeMode: params.get("routeMode") === "all" ? "all" : "any",
    rentMax: [10.5, 11.5, 12.5].includes(rent) ? rent : null
  };
}

export function searchParamsFor(state) {
  const params = new URLSearchParams();
  if (state.hobbies?.length) params.set("hobbies",state.hobbies.join(","));
  if (state.autoRequired?.length) params.set("autoRequired",state.autoRequired.join(","));
  if (state.preferred?.length) params.set("wish", state.preferred.join(","));
  if (state.query) params.set("q", state.query);
  if (state.tags.length) params.set("tags", state.tags.join(","));
  params.set("routes", state.routes.join(","));
  // Keep an explicit empty value so clearing a theme survives reloading its URL.
  params.set("themes", state.themes.join(","));
  if (state.matchMode === "any") params.set("match", "any");
  if (state.routeMode === "all") params.set("routeMode", "all");
  if (state.rentMax != null) params.set("rent", String(state.rentMax));
  return params;
}
