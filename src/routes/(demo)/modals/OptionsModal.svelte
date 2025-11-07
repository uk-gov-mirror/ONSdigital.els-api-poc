<script>
  import { getContext } from "svelte";
  import { Checkbox } from "@onsvisual/svelte-components";
  import Modal from "./Modal.svelte";
  import RangeSlider from "./RangeSlider.svelte";

  let pageOptions = getContext("pageOptions");
  let pageState = getContext("pageState");

  let formatTick = $derived(pageState.formatPeriod());
</script>

<Modal title="Chart options" label="Chart options">
  <RangeSlider
    label="Selected time range"
    options={pageOptions.periods}
    {formatTick}
    bind:selectedRange={pageState.periodRange}/>
  <Checkbox bind:checked={pageState.showConfidenceIntervals} label="Show confidence intervals" compact/>
</Modal>
