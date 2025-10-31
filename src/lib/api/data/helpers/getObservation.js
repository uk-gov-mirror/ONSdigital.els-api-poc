import { dimsToItems, itemsToRowsLong } from "./dataFormatters.js";

// Retrieves a single observation for a set of valid dimensions
// Returns NULL if there is no valid observation, or if there are multiple observations and "multiple" is set to "none"
// The "multiple" parameter can be set to "all", "any" or "none" for cases where there are multiple valid observations
export default function getObservation(ds, dimVals, multiple = "none") {
  const dims = [];
  for (let i = 0; i < ds.id.length; i++) {
    const key = ds.id[i];
    if (dimVals[key]) {
      if (dimVals[key] in ds.dimension[key].category.index)
        dims.push({
          key,
          count: ds.size[i],
          values: [[dimVals[key], ds.dimension[key].category.index[dimVals[key]]]]
        });
      else return null;
    } else {
      const cats = Object.entries(ds.dimension[key].category.index);
      if (cats.length === 1 || multiple === "any")
        dims.push({ key, count: ds.size[i], values: [cats[0]] });
      else if (multiple === "all")
        dims.push({ key, count: ds.size[i], values: cats });
      else return null;
    }
  }
  const items = dimsToItems(dims);
  const rows = itemsToRowsLong(ds, dims, items).filter((d) => d.value);

  if (rows.length === 1) return rows[0];
  if (rows.length === 0) return null;
  return rows;
}
