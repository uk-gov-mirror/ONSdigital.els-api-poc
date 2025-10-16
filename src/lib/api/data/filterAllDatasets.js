import filterDataset from "./filterDataset.js";

export default function filterAllDatasets(datasets, params, format) {
  const filtered = [];
  for (const cube of datasets) {
    const data = filterDataset(cube, params, format)
    if (data) filtered.push(data);
  }
  if (format === "csv") return filtered;
  if (format === "cols") return Object.fromEntries(filtered);
  return {
    version: "2.0",
    class: "collection",
    label: "ONS Explore Local Statistics API response",
    // updated: cube.updated,
    link: {item: filtered}
  };
}