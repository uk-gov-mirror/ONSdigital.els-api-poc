
import filterAllDatasets from "./filterAllDatasets.js";
import { makeFilter, makeGeoFilter } from "./helpers/dataFilters.js";
import { toCSVW, csvSerialise } from "./helpers/dataFormatters.js";
import readData from "$lib/data";

const cube = await readData("json-stat");

export default function filterCollection(params = {}) {
  let datasets = cube.link.item;

	// Filter datasets by indicator, and by topic OR sub-topic
	const topicFilter = params.topic === "all" ? () => true : (d) => [params.topic].flat().some(t => [d.extension.topic, d.extension.subTopic].includes(t));
	const indicatorFilter = params.indicator === "all" ? () => true : (d) => [params.indicator].flat().includes(d.extension.slug);
	const combinedFilter = ![params.topic, params.indicator].includes("all") ? (d) => topicFilter(d) || indicatorFilter(d) : (d) => topicFilter(d) && indicatorFilter(d);
	datasets = datasets.filter(combinedFilter);

	// Return only CSVW metadata, if requested
	if (params.format === "csvw") {
		const metadata = toCSVW(datasets, params.measure, params.href);
		return {format: "json", data: metadata};
	}

	// Create filters for data cube dimensions
	const filters = {};
	if (params.geo !== "all") filters.areacd = makeGeoFilter(params.geo, params.geoExtent);
	if (params.time !== "all") filters.period = params.time;
	if (params.measure !== "all") filters.measure = makeFilter(params.measure);

	// Apply filters to datasets and generate output for selected format
	datasets = filterAllDatasets(datasets, filters, params.format);

	return params.format === "csv" ? {format: "text", data: csvSerialise(datasets)} : {format: "json", data: datasets};
}