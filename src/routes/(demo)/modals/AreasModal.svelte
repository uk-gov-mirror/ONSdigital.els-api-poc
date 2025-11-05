<script>
  import { getContext } from "svelte";
  import { Button, Dropdown, Select } from "@onsvisual/svelte-components";

  let dialog = $state();
  let pageOptions = getContext("pageOptions");
  let pageState = getContext("pageState");

  function addArea(area) {
    if (!pageState.geoCodes.find(d => d.areacd === area.areacd)) pageState.geoCodes.push(area);
  }

  function removeArea(area) {
    pageState.geoCodes = pageState.geoCodes.filter(d => d.areacd !== area.areacd);
  }
</script>

<Button variant="secondary" small on:click={() => dialog.showModal()}>Areas</Button>

<dialog aria-labelledby="areas-modal-heading" bind:this={dialog}>
  <h1 id="areas-modal-heading" tabindex="-1">Select areas</h1>
  <Dropdown id="geo-level-select" label="Geography type" options={pageOptions.geoLevels} bind:value={pageState.geoLevel}/>
  <Select id="area-select" label="Select areas" options={pageOptions.geoAreas} labelKey="areanm" on:change={(e) => addArea(e.detail)} autoClear/>
  {#each pageState.geoCodes as area}
    <Button variant="secondary" small on:click={() => removeArea(area)}>{area.areanm} X</Button>
  {/each}
  <Button variant="secondary" small on:click={() => dialog.close()}>Close</Button>
</dialog>