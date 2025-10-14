import { filterTime } from "./helpers/dataFilters.js";
import { toJSONStat, toRows, toJSON } from "./helpers/dataFormatters.js";

export default function filterDataset(cube, filters, format) {
	const dims = [];
	for (let i = 0; i < cube.id.length; i ++) {
		const key = cube.id[i];
		const dimension = cube.dimension[key];
		const dim = {
			key: key,
			count: cube.size[i],
			values: Object.entries(dimension.category.index)
		};
		const filter = filters[key];
		if (filter && dim.key === "period") {
			dim.values = filterTime(dim.values, filter);
		}
		else if (filter) dim.values = dim.values.filter(filter);
		dims.push(dim);
	}
	const length = dims.map(dim => dim.values.length).reduce((a, b) => a * b, 1);
	if (length === 0) return null;

	if (format === "json") return toJSON(cube, dims);
	if (format === "csv") return toRows(cube, dims);
	return toJSONStat(cube, dims);
}
