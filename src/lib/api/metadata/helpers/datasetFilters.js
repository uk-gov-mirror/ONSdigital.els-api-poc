// Functions to filter JSON-Stat at a dataset level
import { geoLevels } from "$lib/config/geo-levels.js";

export function makeTopicFilter(topic) {
  return (ds) =>
    ds.extension.topic === topic || ds.extension.subtopic === topic;
}

export function makeYearFilter(year) {
  const timeString = String(year);
  if (!timeString.match(/^\d{4}$/))
    return {error: "Invalid 'hasYear' parameter. Must be YYYY or 'all'."};
  return (ds) =>
    Object.keys(ds.dimension.period.category.index)
      .map((d) => d.slice(0, 4))
      .includes(timeString);
}

export function hasGeo(ds, geo) {
  return (geo in ds.dimension.areacd.category.index);
}

export function makeGeoFilter(geo) {
  if (geo.match(/[EKNSW]\d{8}/))
    return (ds) => hasGeo(ds, geo);
  if (geo in geoLevels)
    return (ds) => ds.extension.geography.levels.includes(geo);
  return {error: "Invalid 'hasGeo' parameter. Must be a valid GSS code or geography level."};
}

export function makeDatasetFilter(topic, geo, year) {
  if (topic === "all" && geo === "all" && year === "all") return () => true;
  const topicFilter = topic === "all" ? () => true : makeTopicFilter(topic);
  const yearFilter = year === "all" ? () => true : makeYearFilter(year);
  if (yearFilter.error) return yearFilter;
  const geoFilter = geo === "all" ? () => true : makeGeoFilter(geo);
  if (geoFilter.error) return geoFilter;
  return (ds) => topicFilter(ds) && yearFilter(ds) && geoFilter(ds);
}
