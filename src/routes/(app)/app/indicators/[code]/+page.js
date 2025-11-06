import { resolve } from '$app/paths';

export const load = async ({ params, fetch }) => {
  	const path = resolve(`/api/v1/metadata/indicators/${params.code}?fullDims=true`);
	const indicator = await(await fetch(path)).json();

	const periodPath = resolve(`/api/v1/metadata/indicators/${params.code}/dimensions/period`);
	const periods = await(await fetch(periodPath)).json();

	return {
		indicator,
		periods
	};
};