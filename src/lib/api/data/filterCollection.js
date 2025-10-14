import { csvFormat } from "d3-dsv";
import cube from "$lib/data/json-stat.json";
import filterAllDatasets from "./filterAllDatasets.js";

function makeFilter(param) {
	const set = new Set([param].flat());
	return d => set.has(d[0]);
}

function makeGeoFilter(param) {
	const codes = new Set();
	const types = new Set();
	for (const geo of [param].flat()) {
		if (geo.match(/^[EKNSW]\d{2}$/)) types.add(geo);
		else if (geoLevels[geo]) {
			for (const code of geoLevels[geo].codes) types.add(code);
		}
		else if (geo.match(/^[EKNSW]\d{8}$/) && !types.has(geo.slice(0, 3))) codes.add(geo);
	}
	return codes.size > 0 && types.size > 0 ? d => codes.has(d[0]) || types.has(d[0].slice(0, 3)) :
		types.size > 0 ? d => types.has(d[0].slice(0, 3)) :
		codes.size > 0 ? d => codes.has(d[0]) :
		() => false;
}

function csvSerialise(datasets) {
	return csvFormat(datasets.flat());
}

function toCSVW(datasets, measure, href) {
	let metadata = {
		"@context": "http://www.w3.org/ns/csvw",
		url: href.replace(".csvw", ".csv"),
		"rdfs:label": "Filtered datasets from ONS Explore Local Statistics API",
	}
	if (datasets.length === 1) {
		const ds = datasets[0];
		const sourceOrg = ds.extension.source[0].href.split("/").slice(0, 3).join("/") + "/";
		metadata = {
			...metadata,
			"rdfs:label": "Filtered dataset from ONS Explore Local Statistics API",
			"dc:title": ds.label,
			"rdfs:comment": ds.extension.description,
			"dc:issued": {
					"@type": "date",
					"@value": ds.updated
			},
			"dc:creator": {
					"@id": sourceOrg
			},
			"dc:publisher": {
					"@id": sourceOrg
			},
			"dcat:landingPage": {
					"@id": ds.extension.source[0].url
			}
		}
	}
	let measures = [
		{
			titles: "Lower confidence interval",
			name: "lci",
			datatype: "number"
		},
		{
			titles: "Upper confidence interval",
			name: "uci",
			datatype: "number"
		},
		{
			titles: "Value",
			name: "value",
			datatype: "number"
		}
	];
	if (measure !== "all") measures = measures.filter(m => [measure].flat().includes(m.name));
	metadata.tableSchema = {
		columns: [
			{
				titles: "Indicator",
				name: "indicator",
				datatype: "string"
			},
			{
				titles: "Time period",
				name: "period",
				datatype: "date"
			},
			{
				titles: "Area code",
				name: "areacd",
				datatype: "string"
			},
			...measures
		]
	};
	return metadata;
}

export default function filterCollection(params = {}) {
  let datasets = cube.link.item;

	// Filter datasets by topic OR sub-topic
	if (params.topic !== "all") {
		datasets = datasets.filter(
			d => [params.topic].flat().some(t => [d.extension.topic, d.extension.subTopic].includes(t))
		);
	}

	// Filter datasets by indicator
	if (params.indicator !== "all") {
		datasets = datasets.filter(
			d => [params.indicator].flat().includes(d.extension.slug)
		);
	}

	// Return only CSVW metadata, if requested
	if (params.format === "csvw") {
		const metadata = toCSVW(datasets, params.measure, params.href);
		return {format: "json", data: metadata};
	}

	// Create filters for data cube dimensions
	const filters = {};
	if (params.geo !== "all") filters.areacd = makeGeoFilter(params.geo);
	if (params.time !== "all") filters.period = params.time;
	if (params.measure !== "all") filters.measure = makeFilter(params.measure);

	// Apply filters to datasets and generate output for selected format
	datasets = filterAllDatasets(datasets, filters, params.format);

	return params.format === "csv" ? {format: "text", data: csvSerialise(datasets)} : {format: "json", data: datasets};
}