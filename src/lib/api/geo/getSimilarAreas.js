import areasClusters from "$lib/data/areas-clusters.json";
import areasSimilar from "$lib/data/areas-similar.json";
import { isValidAreaCode } from "../utils.js";
import { addAreaNames } from "./helpers/areaCodesNames.js";

export default function getSimilarAreas(params = {}) {
  const cdUpper = (params?.code || "").toUpperCase();
  if (!isValidAreaCode(cdUpper))
    return { error: 400, message: `${params?.code} is not a valid GSS code.` };

  const similar = areasSimilar[cdUpper];
  if (!similar) return [];

  const clusters = [];
  const clusterTypes = areasClusters.types;
  const clusterLookup = areasClusters.lookup[cdUpper];
  
  for (const type of clusterTypes) {
    const similarAreas = similar[type];
    const obj = {
      key: type,
      label: `${type === "global" ? "All" : type[0].toUpperCase() + type.slice(1)} indicators`,
      similar: params.includeNames ? addAreaNames(similarAreas) : similarAreas
    };
    
    if (clusterLookup) {
      const key = clusterLookup[type];
      const areas = areasClusters.clusters[type][key];
      obj.cluster = {key};
      obj.cluster.label = key.toUpperCase();
      obj.cluster.areas = params.includeNames ? addAreaNames(areas) : areas;
      obj.cluster.description = areasClusters.descriptions[type][key];
    }
    clusters.push(obj);
  }
  return clusters;
}