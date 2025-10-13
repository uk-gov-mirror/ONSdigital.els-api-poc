import { json, text } from "@sveltejs/kit";
import { getParam } from "$lib/api/utils.js";
import filterCollection from "$lib/api/data/filterCollection.js";

export function GET({ params, url }) {
  const format = params.format || "json";
  const topic = getParam(url, "topic", "all");
  const indicator = getParam(url, "indicator", "all");
  const geo = getParam	(url, "geo", "all");
  const time = getParam(url, "time", "latest");
  const measure = getParam(url, "measure", "all");

	const datasets = filterCollection({
		format,
		topic,
		indicator,
		geo,
		time,
		measure
	}, url);
  if (datasets.error) error(datasets.error, datasets.message);

	return datasets.format === "text" ? text(datasets.data) : json(datasets.data);
}