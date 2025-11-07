<script>
  import { base } from "$app/paths";
  import { setContext } from "svelte";
  import {
    PhaseBanner,
    Header,
    Breadcrumb,
    Section,
    Footer
  } from "@onsvisual/svelte-components";
  import AreasModal from "./AreasModal.svelte";
  import OptionsModal from "./OptionsModal.svelte";
  import { makePeriodFormatter } from "$lib/utils.js";

  let { data } = $props();

  let pageOptions = $state({
    geoAreas: data.areas,
    geoLevels: data.geoLevels,
    periods: data.periods
  });
  setContext("pageOptions", pageOptions);

  let formatPeriod = $derived(makePeriodFormatter(data.metadata.periodFormat));

  let pageState = $state({
    geoCodes: [],
    geoLevel: data.geoLevels.find(g => g.id === data.metadata.geography.initialLevel),
    periodRange: [data.periods[0], data.periods[data.periods.length - 1]],
    showConfidenceIntervals: false,
    formatPeriod: () => formatPeriod
  });
  setContext("pageState", pageState);
  
</script>

<PhaseBanner phase="prototype"/>
<Header compact title="Selection modals" />
<Breadcrumb links={[{label: "ELS API experiments", href: `${base}/`}]}/>

<Section>
  <div>
    <AreasModal/>
    <OptionsModal/>
  </div>
</Section>

<Section>
  <p>
    Geography level:
    <strong>{pageState.geoLevel.label}</strong>
  </p>
  <p>
    Selected areas:
     <strong>{pageState.geoCodes.map(d => d.areanm).join(", ")}</strong>
  </p>
  <p>
    Date range:
     <strong>{formatPeriod(pageState.periodRange[0])} to {formatPeriod(pageState.periodRange[1])}</strong>
  </p>
  <p>
    Show confidence intervals:
     <strong>{pageState.showConfidenceIntervals ? "Yes" : "No"}</strong>
  </p>
</Section>

<Footer compact />

<style>
  :global(.ons-input) {
    color: #707070;
    margin-bottom: 10px;
  }
</style>