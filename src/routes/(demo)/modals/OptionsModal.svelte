<script>
  import { getContext } from "svelte";
  import { Button, Checkbox } from "@onsvisual/svelte-components";
  import RangeSlider from "./RangeSlider.svelte";

  let dialog = $state();
  let pageOptions = getContext("pageOptions");
  let pageState = getContext("pageState");
</script>

<Button variant="secondary" small on:click={() => dialog.showModal()}>Options</Button>

<dialog aria-labelledby="options-modal-heading" bind:this={dialog}>
  <h1 id="options-modal-heading" tabindex="-1">Chart options</h1>
  <RangeSlider options={pageOptions.periods} bind:selectedRange={pageState.periodRange}/>
  <Checkbox bind:checked={pageState.showConfidenceIntervals} label="Show confidence intervals" compact/>
  <Button variant="secondary" small on:click={() => dialog.close()}>Close</Button>
</dialog>