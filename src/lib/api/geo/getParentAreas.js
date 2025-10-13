import geoMetadata from "$lib/data/geo-metadata.json";
import { isValidAreaCode } from "../utils.js";
import { addAreaNames } from "./helpers/areaCodesNames.js";

export default function getParentAreas(params = {}) {
  const cdUpper = (params?.code || "").toUpperCase();
  if (!isValidAreaCode(cdUpper))
    return { error: 400, message: `${params?.code} is not a valid GSS code.` };

  const area = geoMetadata[cdUpper];
  if (!area) return { error: 400, message: `Parents not found for ${code}` };

  return params.includeNames ? addAreaNames(area.parents) : area.parents;
}
