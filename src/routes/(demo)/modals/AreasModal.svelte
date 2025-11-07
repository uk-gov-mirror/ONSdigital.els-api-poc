<script>
  import { getContext } from "svelte";
  import { Button, Dropdown, Select } from "@onsvisual/svelte-components";
  import Modal from "./Modal.svelte";
  import { ONSpalette } from "$lib/config.js";

  let pageOptions = getContext("pageOptions");
  let pageState = getContext("pageState");

  function addArea(area) {
    if (!pageState.geoCodes.find(d => d.areacd === area.areacd)) pageState.geoCodes.push(area);
  }

  function removeArea(area) {
    pageState.geoCodes = pageState.geoCodes.filter(d => d.areacd !== area.areacd);
  }
</script>

<Modal title="Select areas" label="Change areas">
  <Dropdown id="geo-level-select" label="Geography type" options={pageOptions.geoLevels} bind:value={pageState.geoLevel}/>
  <div class="select-container">
    <Select id="area-select" label="Individual areas" placeholder="Choose one or more" options={pageOptions.geoAreas} labelKey="areanm" on:change={(e) => addArea(e.detail)} autoClear/>
  </div>
  {#each pageState.geoCodes as area, i}
    <Button
      icon="cross"
      color={ONSpalette[i]}
      small
      on:click={() => removeArea(area)}>{area.areanm}</Button>
  {/each}
</Modal>

<style>
  :global(.area-select__listbox) {
    /* z-index: 1 !important; */
  }
  :global(.modal-contents .ons-btn) {
    margin: .5em .5em 0 0;
  }
  .select-container {
    width: 22.5rem;
    max-width: 100%;
  }
</style>