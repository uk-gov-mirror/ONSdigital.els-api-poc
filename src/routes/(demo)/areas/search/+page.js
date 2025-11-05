import { resolve } from '$app/paths';
import { getParam, isValidPostcode } from "$lib/api/utils.js";

export const load = async ({ url, fetch }) => {
	const query = getParam(url, "q", "");
	if (!query) return {query, areas: []};

	try {
		if (isValidPostcode(query.toUpperCase())) {
			const path = resolve(`/api/v1/geo/postcodes/${query}?groupByLevel=true`);
			const result = await(await fetch(path)).json();
			return result;
		} else {
			const path = resolve(`/api/v1/geo/search/${query}?groupByLevel=true`);
			const result = await(await fetch(path)).json();
			return result;
		}
	} catch(err) {
		console.log(err);
		return {meta: { query, total: 0 }, data: []};
	}
};
