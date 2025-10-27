import { json, text, error } from "@sveltejs/kit";
import { getParam, getDimensionFilters } from "$lib/api/utils.js";
import filterCollection from "$lib/api/data/filterCollection.js";

export function GET({ params, url }) {
  const format = params.format || "cols";
  const topic = getParam(url, "topic", "all");
  const indicator = getParam(url, "indicator", "all");
  const geo = getParam(url, "geo", "all");
  const geoExtent = getParam(url, "geoExtent", "all");
  const time = getParam(url, "time", "latest");
  const timeNearest = getParam(url, "timeNearest", "none");
  const measure = getParam(url, "measure", "all");
	const dimFilters = getDimensionFilters(url);

	const datasets = filterCollection({
		format,
		topic,
		indicator,
		geo,
		geoExtent,
		time,
		timeNearest,
		measure,
		dimFilters,
		href: url.href
	});
  if (datasets.error) error(datasets.error, datasets.message);

	return datasets.format === "text" ? text(datasets.data) : json(datasets.data);
}