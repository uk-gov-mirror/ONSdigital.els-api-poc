<script>
	import Chart from "./BarcodeChartJoined.svelte";

    let { 
        hoveredArea,
		data,
		selectedArea = "E06000002"
	} = $props();

	function doSelect(cd) {
		selectedArea = cd;
	}
	function doHover(cd) {
		hoveredArea = cd;
	}

	let rectWidth = $derived(selectedArea ? selectedArea.length * 10 + 20 : 0);
	let rectWidthHover = $derived(hoveredArea ? hoveredArea.length * 10 + 20 : 0);
	// imperfect as n characters != length - should probably be done using bbox
	
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css?family=Open Sans"
		rel="stylesheet"
	/>
</svelte:head>

<!-- Selected: {selectedArea}<br/>
Hovered: {hoveredArea} -->

<svg class="label" height="55">
	{#if selectedArea && !hoveredArea}
		<rect class="rect-select" x="0" width={rectWidth} height="40" rx="5">
		</rect>
		<text class="text-select" x="10" y="24">
			{selectedArea}
		</text>
	{/if}
	{#if hoveredArea}
		<rect
			class="rect-hover"
			x="0"
			width={rectWidthHover}
			height="40"
			rx="5"
		>
		</rect>
		<text class="text-select" x="10" y="24">
			{hoveredArea}
		</text>
	{/if}
</svg>

<Chart {data} {selectedArea} {hoveredArea} select={doSelect} hover={doHover} />

<style>
	.rect-select {
		fill: #206095;
	}

	.rect-hover {
		fill: #f39431;
	}

	.text-select {
		fill: white;
		font-size: 18px;
		font-family: "Open Sans";
		text-anchor: start;
		font-weight: bold;
	}
</style>