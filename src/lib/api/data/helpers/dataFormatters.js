import { csvFormat } from "d3-dsv";

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

export function toJSONStat(qb, dims) {
	const cube = structuredClone(qb);
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
			for (const val of dim.values) label[val[1]] = cube.dimension[dim.key].category.label[val[1]];
			cube.dimension[dim.key].category.label = label;
		}
		cube.size[i] = size;
	}

	const value = Array(indices.length).fill(null);

	for (let i = 0; i < indices.length; i ++) {
		value[i] = cube.value[indices[i]];
	}
	cube.value = value;
	
	return cube;
}

// Wide format. Includes a separate value column for each measure
export function itemsToRows(cube, dims, items, measures) {
	const rows = [];
	for (const item of items) {
		const row = {indicator: cube.extension.slug};
		for (let i = 0; i < dims.length - 1; i ++) row[dims[i].key] = item[i + 1];
		for (let j = 0; j < measures.values.length; j ++) {
			row[measures.values[j][0]] = cube.value[(item[0] * measures.count) + measures.values[j][1]]
		}
		rows.push(row);
	}
	return rows;
}

// Long format. Includes a "measure" and a "value" column
export function itemsToRowsLong(cube, dims, items) {
	const rows = [];
	for (const item of items) {
		const row = {indicator: cube.extension.slug};
		for (let i = 0; i < dims.length - 1; i ++) row[dims[i].key] = item[i + 1];
		row.value = cube.value[item[0]];
		rows.push(row);
	}
	return rows;
}

export function toRows(cube, dims) {
	const measures = dims[dims.length - 1];
	if (measures.values.length === 0) return [];

	const items = dimsToItems(dims.slice(0, -1));
	const rows = itemsToRows(cube, dims, items, measures);

	return rows;
}

export function itemsToCols(cube, dims, items, measures) {
	const data = {};
	for (const dim of dims.slice(0, -1)) data[dim.key] = [];
	for (const val of measures.values) data[val[0]] = [];
	for (const item of items) {
		for (let i = 0; i < dims.length - 1; i ++) data[dims[i].key].push(item[i + 1]);
		for (let j = 0; j < measures.values.length; j ++) {
			data[measures.values[j][0]].push(cube.value[(item[0] * measures.count) + measures.values[j][1]]);
		}
	}
	return data;
}

export function toCols(cube, dims) {
	const measures = dims[dims.length - 1];

	const items = dimsToItems(dims.slice(0, -1));
	const data = itemsToCols(cube, dims, items, measures);

	return [cube.extension.slug, data];
}

export function csvSerialise(datasets) {
	return csvFormat(datasets.flat());
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