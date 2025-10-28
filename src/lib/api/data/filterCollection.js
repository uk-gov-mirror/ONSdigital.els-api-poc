
import filterAllDatasets from "./filterAllDatasets.js";
import { makeFilter, makeGeoFilter } from "./helpers/dataFilters.js";
import { toCSVW, csvSerialise } from "./helpers/dataFormatters.js";
import { isValidDate, isValidAreaCode } from "$lib/api/utils.js";
import { hasGeo } from "$lib/api/metadata/helpers/datasetFilters.js";
import readData from "$lib/data";

const cube = await readData("json-stat");

export default function filterCollection(params = {}) {
  let datasets = cube.link.item;

	const filters = {};

	// Filter datasets by indicator, and by topic OR sub-topic (additive)
	const topicFilter = params.topic === "all" ? () => true : (d) => [params.topic].flat().some(t => [d.extension.topic, d.extension.subTopic].includes(t));
	const indicatorFilter = params.indicator === "all" ? () => true : (d) => [params.indicator].flat().includes(d.extension.slug);
	const combinedFilter = ![params.topic, params.indicator].includes("all") ? (d) => topicFilter(d) || indicatorFilter(d) : (d) => topicFilter(d) && indicatorFilter(d);
	datasets = datasets.filter(combinedFilter);

	// Filter for datasets that include a specific geography
	if (params.hasGeo !== "any") {
		if (isValidAreaCode(params.hasGeo)) {
			datasets = datasets.filter(ds => hasGeo(ds, params.hasGeo));
			// hasGeo also used later to filter for time periods that include this GSS code
			filters.hasGeo = params.hasGeo; 
		}
		else return {error: 400, message: "The value of 'hasGeo' must be a valid GSS code."};
	}

	// Return only CSVW metadata, if requested
	if (params.format === "csvw") {
		const metadata = toCSVW(datasets, params.measure, params.href);
		return {format: "json", data: metadata};
	}

	// Create filters for standard dimensions
	if (params.geo !== "all") filters.areacd = makeGeoFilter(params.geo, params.geoExtent);
	if (params.time !== "all") {
		if ([params.time].flat().map(t => isValidDate(t)).includes(false)) return {error: 400, message: "Invalid time period requested."};
		filters.period = params.time;
	}
	if (params.measure !== "all") filters.measure = makeFilter(params.measure);

	// Add other dimension filters
	for (const filter of params.dimFilters) {
		filters[filter.key] = makeFilter(filter.values);
	}

	// Apply filters to datasets and generate output for selected format
	datasets = filterAllDatasets(datasets, filters, params.format);

	return params.format === "csv" ? {format: "text", data: csvSerialise(datasets)} : {format: "json", data: datasets};
}