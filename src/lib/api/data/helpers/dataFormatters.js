import { csvFormat } from "d3-dsv";
import readData from "$lib/data";

const geoLookup = await readData("geo-metadata");

// Makes a code => name lookup from an array of GSS codes
function makeAreaLookup(codes) {
	return Object.fromEntries(codes.map(cd => [cd, geoLookup[cd]?.areanm]));
}

export function dimsToIndex(dims) {
	let index = 0;
	for (const dim of dims) index = (index * dim.count) + dim.value[1];
	return index;
}

export function dimsToItems(dims) {
	let items = [[0]];
	for (const dim of dims) {
		const newItems = [];
		for (const item of items) {
			for (const val of dim.values) {
				newItems.push([(item[0] * dim.count) + val[1], ...item.slice(1), val[0]]);
			}
		}
		items = newItems;
	}
	return items;
}

export function toJSONStat(qb, dims, includeNames = false, includeStatus = false) {
	const cube = {};
	for (const key of Object.keys(qb).filter(key => !["value", "status"].includes(key))) cube[key] = structuredClone(qb[key]);

	let indices = [0];

	for (let i = 0; i < dims.length; i ++) {
		const dim = dims[i];
		const size = dim.values.length;

		if (dim.values.length !== 1) {
			const newIndices = [];
			// const newIndices = Array(indices.length * size);
			// let j = 0;
			for (const index of indices) {
				for (const val of dim.values) {
					newIndices.push((index * dim.count) + val[1]);
					// newIndices[j] = (index * dim.count) + val[1];
					// j ++;
				}
			}
			indices = newIndices;
			// indices = indices.flatMap(index => dim.values.map(val => (index * dim.count) + val[1]));
		}

		cube.dimension[dim.key].category.index = Object.fromEntries(dim.values.map((val, i) => [val[0], i]));
		if (cube.dimension[dim.key].category.label && size < cube.size[i]) {
			const label = {};
			for (const val of dim.values) label[val[1]] = qb.dimension[dim.key].category.label[val[1]];
			cube.dimension[dim.key].category.label = label;
		}
		cube.size[i] = size;
		if (includeNames) cube.dimension.areacd.category.label = makeAreaLookup(Object.keys(cube.dimension.areacd.category.index));
	}

	const value = Array(indices.length).fill(null);

	if (includeStatus) {
		cube.status = {};
		for (let i = 0; i < indices.length; i ++) {
			value[i] = qb.value[indices[i]];
			if (qb.status[indices[i]]) cube.status[indices[i]] = qb.status[indices[i]];
		}
	} else {
		for (let i = 0; i < indices.length; i ++) {
			value[i] = qb.value[indices[i]];
		}
	}

	cube.value = value;
	
	return cube;
}

function makeRowFill(includeNames, includeStatus, measuresCount = 1) {
	const addVals = (row, item, dims) => {
		for (let i = 0; i < dims.length - 1; i ++) row[dims[i].key] = item[i + 1];
	}
	const addValsWithName = (row, item, dims) => {
		row.areacd = item[1];
		row.areanm = geoLookup[row.areacd]?.areanm || null;
		for (let i = 1; i < dims.length - 1; i ++) row[dims[i].key] = item[i + 1];
	}
	const addStatus = (row, item, status) => row.status = status[item[0] * measuresCount] || null
	return includeNames && includeStatus ? (row, item, dims, status) => {
		addValsWithName(row, item, dims);
		addStatus(row, item, status);
	} : includeNames ? addValsWithName : 
	includeStatus ? (row, item, dims, status) => {
		addVals(row, item, dims);
		addStatus(row, item, status);
	} : addVals;
}

// Wide format. Includes a separate value column for each measure
export function itemsToRows(cube, dims, items, measures, includeIndicator = false, includeNames = false, includeStatus = false) {
	const rows = [];
	const rowFill = makeRowFill(includeNames, includeStatus, measures.count);
	for (const item of items) {
		const row = includeIndicator ? {indicator: cube.extension.slug} : {};
		rowFill(row, item, dims, cube.status);
		for (let j = 0; j < measures.values.length; j ++) {
			row[measures.values[j][0]] = cube.value[(item[0] * measures.count) + measures.values[j][1]]
		}
		rows.push(row);
	}
	return rows;
}

// Long format. Includes a "measure" and a "value" column
export function itemsToRowsLong(cube, dims, items, includeIndicator = false, includeNames = false, includeStatus = false) {
	const rows = [];
	const rowFill = makeRowFill(includeNames, includeStatus);
	for (const item of items) {
		const row = includeIndicator ? {indicator: cube.extension.slug} : {};
		rowFill(row, item, dims);
		row.value = cube.value[item[0]];
		rows.push(row);
	}
	return rows;
}

export function toRows(cube, dims, includeIndicator, includeNames, includeStatus) {
	const measures = dims[dims.length - 1];
	if (measures.values.length === 0) return [];

	const items = dimsToItems(dims.slice(0, -1));
	const rows = itemsToRows(cube, dims, items, measures, includeIndicator, includeNames, includeStatus);

	return includeIndicator ? rows : [cube.extension.slug, rows];
}

function makeColFill(includeNames, includeStatus, measuresCount = 1) {
	const pushVals = (data, item, dims) => {
		for (let i = 0; i < dims.length - 1; i ++) data[dims[i].key].push(item[i + 1]);
	}
	const pushName = (data) => data.areanm.push(geoLookup[data.areacd[data.areacd.length - 1]]?.areanm || null);
	const pushStatus = (data, item, status) => data.status.push(status[item[0] * measuresCount] || null);
	return includeNames && includeStatus ? (data, item, dims, status) => {
		pushVals(data, item, dims);
		pushName(data);
		pushStatus(data, item, status);
	} : includeNames ? (data, item, dims) => {
		pushVals(data, item, dims);
		pushName(data);
	} : includeStatus ? (data, item, dims, status) => {
		pushVals(data, item, dims);
		pushStatus(data, item, status);
	} : pushVals;
}

export function itemsToCols(cube, dims, items, measures, includeNames = false, includeStatus = false) {
	const data = {};
	const colFill = makeColFill(includeNames, includeStatus, measures.count);
	for (const dim of dims.slice(0, -1)) {
		data[dim.key] = [];
		if (includeNames && dim.key === "areacd") data.areanm = [];
	};
	for (const val of measures.values) data[val[0]] = [];
	if (includeStatus) data.status = [];
	for (const item of items) {
		colFill(data, item, dims, cube.status);
		for (let j = 0; j < measures.values.length; j ++) {
			data[measures.values[j][0]].push(cube.value[(item[0] * measures.count) + measures.values[j][1]]);
		}
	}
	return data;
}

export function toCols(cube, dims, includeNames, includeStatus) {
	const measures = dims[dims.length - 1];

	const items = dimsToItems(dims.slice(0, -1));
	const data = itemsToCols(cube, dims, items, measures, includeNames, includeStatus);

	return [cube.extension.slug, data];
}

// Infer columns from row data
function inferColumns(rows) {
  const cols = new Set();
	for (const row of rows) {
		for (const col in row) cols.add(col);
	}
	return Array.from(cols);
}

// Sort order of columns for CSV output
function sortColumns(cols) {
	return cols.includes("status") ? [...cols.filter(col => col !== "status"), "status"] : cols
}

export function csvSerialise(datasets) {
	const rows = datasets.flat();
	const cols = sortColumns(inferColumns(rows));
	return csvFormat(rows, cols);
}

export function toCSVW(datasets, measure, href) {
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