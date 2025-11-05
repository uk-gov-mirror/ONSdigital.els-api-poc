<script lang="ts">
	//@ts-nocheck
	// import MarkdownIt from 'markdown-it';
	import { base, assets } from '$app/paths';
	import { afterNavigate } from '$app/navigation';
	import {
		Hero,
		NavSections,
		NavSection,
		Dropdown,
		Table,
		analyticsEvent,
		Header
	} from '@onsvisual/svelte-components';
	import { capitalise } from '@onsvisual/robo-utils';
	// import { pivotData, makeMapData } from '$lib/util/datasets/datasetsHelpers';
	// import ContentBlock from '$lib/components/ContentBlock.svelte';
	// import Map from '$lib/viz/Map.svelte';
	// import ChangeAreas from '$lib/interactivity/ChangeAreas.svelte';
	// import { constructVisibleAreasArray, updateCustomLookup, arrayJoin } from '$lib/utils.js';
	// import LineChartContainerIndicatorPage from '$lib/prototype-components/indicator-page/LineChartContainerIndicatorPage.svelte';
	// import BarChartContainerIndicatorPage from '$lib/prototype-components/indicator-page/BarChartContainerIndicatorPage.svelte';
	// import ChartOptions from '$lib/prototype-components/ChartOptions.svelte';
	// import Icon from '$lib/components/Icon.svelte';
	// import { filterGeoGroups } from '$lib/util/geo/filterGeoGroups.js';

	export let data;

	function arrayJoin(arr, separators = [', ', ' and ']) {
		if (arr.length < 2) return arr.join(separators[0]);
		return arr.slice(0, -1).join(separators[0]) + separators[1] + arr.slice(-1);
}

	// const getUnit = (ind) => ind.subText || ind.suffix || ind.prefix;

	// let geoGroups, geoGroup, prevGeoGroup, columns;
	// let pivotedData, mapData;
	// let selected = [];
	// let chosenXDomainNumbStart,
	// 	chosenXDomainNumbEnd,
	// 	timePeriodsArray,
	// 	chosenTimePeriodDropdownLabel,
	// 	chosenStartTimePeriod;
	// let showConfidenceIntervals = false;

	// const maxSelection = 10;

	const parseDate = (str) => {
		const intlString = str.split('/').reverse().join('-') + 'T12:00';
		const date = new Date(intlString);
		return date.toLocaleString('en-GB', { year: 'numeric', month: 'long', day: '2-digit' });
	};
	// const doSelect = (e) => {
	// 	const chosen = selectionsObject['indicator-additional-chosen'];
	// 	const area = e.detail?.area;
	// 	if (chosen.includes(area.areacd))
	// 		selectionsObject['indicator-additional-chosen'] = chosen.filter((s) => s !== area.areacd);
	// 	else if (chosen.length < maxSelection)
	// 		selectionsObject['indicator-additional-chosen'] = [...chosen, area.areacd];
	// };

	// const refreshData = () => {
	// 	chosenXDomainNumbEnd = timePeriodsArray.find(
	// 		(el) => el.label === chosenTimePeriodDropdownLabel
	// 	).xDomainNumb;
	// 	chosenXDomainNumbStart = Math.min(chosenXDomainNumbStart, chosenXDomainNumbEnd);

	// 	pivotedData = geoGroup?.codes ? pivotData(data.chartData, geoGroup?.codes) : [];
	// };

	// afterNavigate(() => {
	// 	geoGroups = filterGeoGroups(data.indicator.inferredGeos);
	// 	geoGroup = geoGroups[geoGroups.length - 1];
	// 	prevGeoGroup = geoGroup;

	// 	timePeriodsArray = metadata.periodsLookupArray.filter(
	// 		(el) =>
	// 			el.id === data.indicator.id &&
	// 			el.xDomainNumb >= data.indicator.minXDomainNumb &&
	// 			el.xDomainNumb <= data.indicator.maxXDomainNumb
	// 	);
	// 	chosenXDomainNumbStart = data.indicator.minXDomainNumb;
	// 	chosenXDomainNumbEnd = data.indicator.maxXDomainNumb;
	// 	chosenTimePeriodDropdownLabel = timePeriodsArray.find(
	// 		(el) => el.xDomainNumb === chosenXDomainNumbEnd
	// 	).label;

	// 	columns = [
	// 		{ key: 'areacd', label: 'Area code' },
	// 		{ key: 'areanm', label: 'Area name' },
	// 		...timePeriodsArray.map((t) => ({
	// 			key: t.xDomainNumb,
	// 			label: t.label,
	// 			numeric: true,
	// 			dp: +data.indicator.metadata.decimalPlaces
	// 		}))
	// 	];
	// 	refreshData();

	// 	selectionsObject['indicator-related-chosen'] = data.indicator.metadata.initialGeographyLevel;

	// 	selectionsObject['indicator-additional-chosen'] =
	// 		data.indicator.metadata.standardised === 'F'
	// 			? []
	// 			: codesForAreasWithData.includes('K02000001')
	// 				? ['K02000001']
	// 				: codesForAreasWithData.includes('K03000001')
	// 					? ['K03000001']
	// 					: countriesWithDataCodes.length === 1
	// 						? countriesWithDataCodes
	// 						: [];
	// });

	// function filterDuplicateAreas(data, areasObject) {
	// 	const areacds = Array.from(new Set(data.map((d) => d.areacd)));
	// 	const areas = areacds.map((cd) => areasObject[cd]);
	// 	const obsolete = new Set(
	// 		areas
	// 			.filter((area) => area.areanm.endsWith('(obsolete)'))
	// 			.map((area) => `${area.areacd.slice(0, 3)}_${area.areanm.slice(0, -11)}`)
	// 	);
	// 	const remove = new Set(
	// 		areas
	// 			.filter((area) => obsolete.has(`${area.areacd.slice(0, 3)}_${area.areanm}`))
	// 			.map((area) => area.areacd)
	// 	);

	// 	return data.filter((d) => !remove.has(d.areacd));
	// }

	// $: mapData =
	// 	geoGroup?.codes && chosenXDomainNumbEnd && data.indicator.years.includes(chosenXDomainNumbEnd)
	// 		? makeMapData(
	// 				filterDuplicateAreas(data.chartData, data.metadata.areasObject),
	// 				geoGroup?.codes,
	// 				chosenXDomainNumbEnd
	// 			)
	// 		: { data: [], breaks: [] };

	// $: chosenTimePeriodsArray = timePeriodsArray
	// 	? timePeriodsArray.filter(
	// 			(el) => el.xDomainNumb >= chosenXDomainNumbStart && el.xDomainNumb <= chosenXDomainNumbEnd
	// 		)
	// 	: null;

	// $: chosenStartTimePeriod = timePeriodsArray
	// 	? timePeriodsArray.find((el) => el.xDomainNumb === chosenXDomainNumbStart)
	// 	: null;

	// let metadata = data.metadata;

	// $: codesForAreasWithData = [
	// 	...new Set(
	// 		filterDuplicateAreas(data.chartData, data.metadata.areasObject).map((el) => el.areacd)
	// 	)
	// ];

	// $: lowerTierLocalAuthoritiesWithDataCodes = metadata.areasGeogLevelObject.lower.filter((el) =>
	// 	codesForAreasWithData.includes(el)
	// );
	// $: lowerTierLocalAuthoritiesWithDataAreas = lowerTierLocalAuthoritiesWithDataCodes.map(
	// 	(el) => metadata.areasObject[el]
	// );

	// $: upperTierLocalAuthoritiesWithDataCodes = metadata.areasGeogLevelObject.upper.filter((el) =>
	// 	codesForAreasWithData.includes(el)
	// );
	// $: upperTierLocalAuthoritiesWithDataAreas = upperTierLocalAuthoritiesWithDataCodes.map(
	// 	(el) => metadata.areasObject[el]
	// );

	// $: combinedAuthoritiesWithDataCodes = metadata.areasGeogLevelObject.combined.filter((el) =>
	// 	codesForAreasWithData.includes(el)
	// );
	// $: combinedAuthoritiesWithDataAreas = combinedAuthoritiesWithDataCodes.map(
	// 	(el) => metadata.areasObject[el]
	// );

	// $: regionsWithDataCodes = metadata.areasGeogLevelObject.region.filter((el) =>
	// 	codesForAreasWithData.includes(el)
	// );
	// $: regionsWithDataAreas = regionsWithDataCodes.map((el) => metadata.areasObject[el]);

	// $: countriesWithDataCodes = metadata.areasGeogLevelObject.country.filter((el) =>
	// 	codesForAreasWithData.includes(el)
	// );
	// $: countriesWithDataAreas = countriesWithDataCodes.map((el) => metadata.areasObject[el]);

	// $: parentAndRelatedAreasObject = {
	// 	parent: null,
	// 	country: null,
	// 	uk: null,
	// 	groups: {
	// 		country: {
	// 			labels: {
	// 				related: 'All countries'
	// 			},
	// 			areas: countriesWithDataAreas.sort((a, b) =>
	// 				a.areanm > b.areanm ? 1 : b.areanm > a.areanm ? -1 : 0
	// 			),
	// 			codes: countriesWithDataCodes
	// 		},
	// 		region: {
	// 			labels: {
	// 				related: 'All regions'
	// 			},
	// 			areas: regionsWithDataAreas.sort((a, b) =>
	// 				a.areanm > b.areanm ? 1 : b.areanm > a.areanm ? -1 : 0
	// 			),
	// 			codes: regionsWithDataCodes
	// 		},
	// 		combined: {
	// 			labels: {
	// 				related: 'All combined authorities'
	// 			},
	// 			areas: combinedAuthoritiesWithDataAreas.sort((a, b) =>
	// 				a.areanm > b.areanm ? 1 : b.areanm > a.areanm ? -1 : 0
	// 			),
	// 			codes: combinedAuthoritiesWithDataCodes
	// 		},
	// 		utla: {
	// 			labels: {
	// 				related: 'All upper-tier/unitary authorities'
	// 			},
	// 			areas: upperTierLocalAuthoritiesWithDataAreas.sort((a, b) =>
	// 				a.areanm > b.areanm ? 1 : b.areanm > a.areanm ? -1 : 0
	// 			),
	// 			codes: upperTierLocalAuthoritiesWithDataCodes
	// 		},
	// 		ltla: {
	// 			labels: {
	// 				related: 'All lower-tier/unitary authorities'
	// 			},
	// 			areas: lowerTierLocalAuthoritiesWithDataAreas.sort((a, b) =>
	// 				a.areanm > b.areanm ? 1 : b.areanm > a.areanm ? -1 : 0
	// 			),
	// 			codes: lowerTierLocalAuthoritiesWithDataCodes
	// 		}
	// 	}
	// };

	// $: changeAreasOptionsObject = {
	// 	country: countriesWithDataAreas,
	// 	region: regionsWithDataAreas,
	// 	combined: combinedAuthoritiesWithDataAreas,
	// 	upper: upperTierLocalAuthoritiesWithDataAreas,
	// 	lower: lowerTierLocalAuthoritiesWithDataAreas,
	// 	related: Object.keys(parentAndRelatedAreasObject.groups)
	// 		.filter((el) => parentAndRelatedAreasObject.groups[el].areas.length > 0)
	// 		.map((el) => ({
	// 			key: el,
	// 			label: parentAndRelatedAreasObject.groups[el].labels.related
	// 		}))
	// };

	// let selectionsObject = {
	// 	'indicator-additional-chosen': new Array(0),
	// 	'indicator-additional-visible': new Array(0),
	// 	'indicator-related-chosen': null,
	// 	'indicator-related-visible': null
	// };

	// function updateSelections(chosenElement, related) {
	// 	return constructVisibleAreasArray(
	// 		chosenElement,
	// 		related,
	// 		parentAndRelatedAreasObject,
	// 		metadata.areasObject
	// 	);
	// }

	// $: selectionsObject['indicator-additional-visible'] = updateSelections(
	// 	selectionsObject['indicator-additional-chosen'],
	// 	false
	// );

	// $: selectionsObject['indicator-related-visible'] = updateSelections(
	// 	selectionsObject['indicator-related-chosen'],
	// 	true
	// );

	// $: accordionArrayMap = [
	// 	{
	// 		label: '',
	// 		type: 'checkbox',
	// 		chosenKey: 'indicator-additional',
	// 		accordion: true,
	// 		options: [
	// 			{
	// 				key: 'ctry',
	// 				label: 'Countries',
	// 				data: changeAreasOptionsObject.country,
	// 				accordion: true,
	// 				include: true
	// 			},
	// 			{
	// 				key: 'rgn',
	// 				label: 'Countries and regions',
	// 				data: changeAreasOptionsObject.region,
	// 				accordion: true,
	// 				include: true
	// 			},
	// 			{
	// 				key: 'cauth',
	// 				label: 'Combined authorities',
	// 				data: changeAreasOptionsObject.combined,
	// 				accordion: true,
	// 				include: true
	// 			},
	// 			{
	// 				key: 'utla',
	// 				label: 'Upper-tier/unitary authorities',
	// 				data: changeAreasOptionsObject.upper,
	// 				accordion: true,
	// 				include: true
	// 			},
	// 			{
	// 				key: 'ltla',
	// 				label: 'Lower-tier/unitary authorities',
	// 				data: changeAreasOptionsObject.lower,
	// 				accordion: true,
	// 				include: true
	// 			}
	// 		].filter((op) => op.key === geoGroup?.key)
	// 	}
	// ];

	// // $: console.log(accordionArrayMap);

	// $: accordionArrayLineBarBeeswarm = [
	// 	{
	// 		label: 'Selected areas',
	// 		type: 'checkbox',
	// 		chosenKey: 'indicator-additional',
	// 		accordion: true,
	// 		options: [
	// 			{
	// 				key: 'ctry',
	// 				label: 'Countries',
	// 				data: changeAreasOptionsObject.country,
	// 				accordion: true,
	// 				include: true
	// 			},
	// 			{
	// 				key: 'rgn',
	// 				label: 'Countries and regions',
	// 				data: changeAreasOptionsObject.region,
	// 				accordion: true,
	// 				include: true
	// 			},
	// 			{
	// 				key: 'combined',
	// 				label: 'Combined authorities',
	// 				data: changeAreasOptionsObject.combined,
	// 				accordion: true,
	// 				include: true
	// 			},
	// 			{
	// 				key: 'utla',
	// 				label: 'Upper-tier/unitary authorities',
	// 				data: changeAreasOptionsObject.upper,
	// 				accordion: true,
	// 				include: true
	// 			},
	// 			{
	// 				key: 'ltla',
	// 				label: 'Lower-tier/unitary authorities',
	// 				data: changeAreasOptionsObject.lower,
	// 				accordion: true,
	// 				include: true
	// 			}
	// 		]
	// 	},
	// 	{
	// 		label: 'Other areas',
	// 		type: 'radio',
	// 		search: null,
	// 		chosenKey: 'indicator-related',
	// 		accordion: true,
	// 		options: [
	// 			{
	// 				data: changeAreasOptionsObject.related,
	// 				accordion: false,
	// 				labelKey: 'label',
	// 				idKey: 'key'
	// 			},
	// 			{
	// 				data: [{ label: 'None', key: 'none' }],
	// 				accordion: false,
	// 				labelKey: 'label',
	// 				idKey: 'key'
	// 			}
	// 		]
	// 	}
	// ];

	// $: customLookup = {
	// 	'indicator-additional-visible': {}
	// };

	// $: {
	// 	customLookup['indicator-additional-visible'] = updateCustomLookup(
	// 		customLookup['indicator-additional-visible'],
	// 		selectionsObject['indicator-additional-visible'].filter((el) => el.role === 'custom')
	// 	);
	// }

    $: console.log(data.indicator)

	$: source = data.indicator.source
	$: sourceName = source.map(d => d.name)
	$: sourceLink = source.map(d => d.href)
	$: sourceDate = source.map(d => d.date)
	// $: experimental = data.indicator.experimentalStatistic === 'T';
	$: caveats = data.indicator.caveats
	// 	? new MarkdownIt().render(data.indicator.metadata.caveats)
	// 	: null;
</script>

<Header/>

<Hero
	title={data.indicator.label}
	width="medium"
	meta={[
		{
			key: source.length === 1 ? 'Data source' : 'Data sources',
			value: arrayJoin(
				Array.from(sourceName.keys().map(
					(i) => `<a href="${sourceLink[i]}" target="_blank">${sourceName[i]}</a>`
				))
			)
		},
		{
			key: 'Published on',
			value: sourceDate.every((d) => d === sourceDate[0])
				? parseDate(sourceDate[0])
				: arrayJoin(sourceDate.map((d) => parseDate(d)))
		}
	]}
	background="#eaeaea"
	titleBadge={{
		// label: experimental ? 'Official statistics in development' : capitalise(data.indicator.topic),
		label: capitalise(data.indicator.topic),
		ariaLabel: `Topic: ${capitalise(data.indicator.topic)}`,
		color: '#003c57'
	}}
>
	<p class="ons-hero__text">
		{data.indicator.description}
	</p>
</Hero>