import { makeDatasetFilter } from "./helpers/datasetFilters.js";
import readData from "$lib/data";

const rawMetadata = await readData("json-stat");

function formatMetadata(ds, includeDims = false) {
  if (!ds) return {};
  const metadata = {label: ds.label, ...ds.extension, caveats: ds.note};
  if (includeDims) metadata.dimensions = ds.id.map(key => {
    const dim = {
      key,
      label: ds.dimension[key].label,
      values: Object.keys(ds.dimension[key].category.index)
    };
    return dim;
  });
  return metadata;
}

export default function getIndicators(params = {}) {
  if (params.indicator) {
    const indicator = rawMetadata.link.item.find(ds => ds.extension.slug === params.indicator);
    if (!indicator) return {error: "Invalid indicator code"};
    return formatMetadata(indicator, params.includeDims);
  }

  const filter = makeDatasetFilter(params.topic, params.hasGeo, params.hasYear);
  if (filter.error) return filter;

  const metadata = rawMetadata.link.item
    .filter(filter)
    .map(ds => formatMetadata(ds, params.includeDims));
  
  return metadata;
}