import { makeDatasetFilter } from "./helpers/datasetFilters.js";
import readData from "$lib/data";

const rawMetadata = await readData("json-stat");

function formatMetadata(ds, minimalMetadata = false, includeDims = false) {
  if (!ds) return {};
  if (minimalMetadata) return {
    label: ds.label,
    slug: ds.extension.slug,
    topic: ds.extension.topic,
    subTopic: ds.extension.subTopic,
    description: ds.extension.subtitle
  };

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
    return formatMetadata(indicator, params.minimalMetadata, params.includeDims);
  }

  const filter = makeDatasetFilter(params.topic, params.excludeMultivariate, params.hasGeo, params.hasYear);
  if (filter.error) return filter;

  const metadata = rawMetadata.link.item
    .filter(filter)
    .map(ds => formatMetadata(ds, params.minimalMetadata, params.includeDims));
  
  return metadata;
}