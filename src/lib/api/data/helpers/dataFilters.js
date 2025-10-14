import { geoLevels } from "$lib/config/geo-levels.js";

export function ascending(a, b) {
  return a == null || b == null ? NaN : a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

export function makeFilter(param) {
  const set = new Set([param].flat());
  return d => set.has(d[0]);
}

export function makeGeoFilter(param) {
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

export function filterTime(values, param) {
	if (param === "latest") return [values[values.length - 1]];
	if (param === "earliest") return [values[0]];
	
	const params = [param].flat();
	const props = {
		start: params[0].match(/^\d{4}(-\d{2}){0,2}/)?.[0],
		end: params[params.length - 1].match(/^\d{4}(-\d{2}){0,2}/)?.[0],
		earliest: params[0].endsWith("earliest"),
		latest: params[params.length - 1].endsWith("latest")
	};
	if (!props.start && !props.end && !props.earliest && !props.latest) return [];

	const dates = values.map(d => d[0].split("/")[0]);
	let startIndex;
	if (!props.start && props.earliest) startIndex = 0;
	else if (props.start) {
		props.start = props.start.slice(0, dates[0].length);
		const startDates = props.start.length < dates[0].length ?
			dates.map(d => d.slice(0, props.start.length)) :
			dates;
		const index = startDates.indexOf(props.start);
		const indexForce = index === -1 && props.earliest ?
			[props.start, ...startDates].sort(ascending).indexOf(props.start) :
			null;
		startIndex = !indexForce ? index : indexForce && indexForce < dates.length ? indexForce : null;
	}
	let endIndex;
	if (!props.end && props.latest) endIndex = values.length;
	if (props.end) {
		props.end = props.end.slice(0, dates[0].length);
		const endDates = props.end.length < dates[0].length ?
			dates.map(d => d.slice(0, props.end.length)) :
			dates;
		const index = endDates.lastIndexOf(props.end);
		const indexForce = index === -1 && props.latest ?
			[...endDates, props.end].sort(ascending).lastIndexOf(props.end) :
			null;
		endIndex = !indexForce ? index + 1 : indexForce && indexForce > 0 ? indexForce : null;
	}
	if (!Number.isInteger(startIndex) && !Number.isInteger(endIndex)) return [];
	return values.slice(
		Number.isInteger(startIndex) ? startIndex : endIndex - 1,
		Number.isInteger(endIndex) ? endIndex : startIndex + 1
	);
}