<script>
	
	import PyramidChart from "./PyramidChart.svelte";

	let { 
		data,
		selectedArea = "E06000002"
	} = $props();

	// export let selectedArea = "E06000002";

	function doSelect(cd) {
		selectedArea = cd;
	}

	let rectWidth = $derived(selectedArea ? selectedArea.length * 10 + 20 : 0);
	
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
	{#if selectedArea}
		<rect class="rect-select" x="0" width={rectWidth} height="40" rx="5">
		</rect>
		<text class="text-select" x="10" y="24">
			{selectedArea}
		</text>
	{/if}
</svg>

<PyramidChart {data} {selectedArea} select={doSelect}  />

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