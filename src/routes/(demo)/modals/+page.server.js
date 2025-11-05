import { resolve } from "$app/paths";
import { addAreaNames } from "$lib/api/geo/helpers/areaCodesNames";
import { geoLevels, geoLevelsLookup } from "$lib/config/geo-levels.js";

export const load = async ({ fetch }) => {
  const path = resolve(
    "/api/v1/metadata/indicators/gross-value-added-per-hour-worked?fullDims=true"
  );
  const metadata = await (await fetch(path)).json();
	const areas = addAreaNames(
    Object.keys(metadata.dimensions[0].category.index).filter(cd => geoLevelsLookup[cd.slice(0, 3)])
  ).sort((a, b) => a.areacd.localeCompare(b.areacd));
  const gLevels = metadata.geography.levels.map(id => ({id, ...geoLevels[id]}));
	const periods = Object.keys(metadata.dimensions[1].category.index);

  return {
    metadata,
		areas,
    geoLevels: gLevels,
		periods
  };
};
