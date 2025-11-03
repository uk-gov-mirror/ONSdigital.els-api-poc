import readData from "$lib/data";
import { capitalise } from "$lib/utils.js";

const collection = await readData("json-stat");

function makeTaxonomy(collection) {
  return collection.link.item.map(ds => ({
    label: ds.label,
    slug: ds.extension.slug,
    topic: ds.extension.topic,
    subTopic: ds.extension.subTopic,
    description: ds.extension.subtitle
  }));
}

function nestTaxonomy(taxonomy) {
  const topicsIndex = {};

  for (const ind of taxonomy) {
    const indicator = {
      label: ind.label,
      slug: ind.slug,
      description: ind.description
    };
    if (!topicsIndex[ind.topic]) topicsIndex[ind.topic] = {
      label: capitalise(ind.topic),
      slug: ind.topic,
      children: {}
    };
    if (ind.topic === ind.subTopic) {
      topicsIndex[ind.topic].children[ind.slug] = indicator;
    } else {
      if (!topicsIndex[ind.topic].children[ind.subTopic])
        topicsIndex[ind.topic].children[ind.subTopic] = {
          label: capitalise(ind.subTopic),
          slug: ind.subTopic,
          children: {}
      };
      topicsIndex[ind.topic].children[ind.subTopic].children[ind.slug] = indicator;
    }
  }

  const topics = Object.values(topicsIndex);
  for (const topic of topics) {
    topic.children = Object.values(topic.children);
    if (topic.children[0].children) {
      for (const subTopic of topic.children) subTopic.children = Object.values(subTopic.children);
    }
  }
  return topics;
}

// function flattenTaxonomy(taxonomy) {
//   return taxonomy
//     .map((topic) =>
//       topic.children
//         .map((subTopic) =>
//           subTopic.children
//             ? subTopic.children
//                 .map((ind) => ({
//                   label: ind.label,
//                   key: ind.key,
//                   description: ind.description,
//                   topic: topic.key,
//                   subTopic: subTopic.key,
//                 }))
//                 .flat()
//             : {
//                 label: subTopic.label,
//                 key: subTopic.key,
//                 description: subTopic.description,
//                 topic: topic.key,
//                 subTopic: topic.key,
//               }
//         )
//         .flat()
//     )
//     .flat();
// }

export default function getTaxonomy(params = {}) {
  const taxonomy = makeTaxonomy(collection)
  return params.flat ? taxonomy : nestTaxonomy(taxonomy);
}
