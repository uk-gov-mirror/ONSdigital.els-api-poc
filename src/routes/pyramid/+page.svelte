<script>
  import {
    Header,
    Breadcrumb,
    Titleblock,
    Section,
    Grid,
    Blockquote,
    Footer,
    NavSection,
    NavSections,
    Select,
    Button,
  } from "@onsvisual/svelte-components";
  import { fetchChartData } from "$lib/utils.js";
  import Barcode from "./Barcode.svelte";
  import Pyramid from "./Pyramid.svelte";
  import BarcodeJoined from "./BarcodeJoined.svelte";

  let { data } = $props()

  // let selected = 'E06000002';
  // Select is returning the object, not just the areacd string
  let selectedObj = $state(data.areaList2023.find((d) => d.areacd === "E06000002"));
  let selected = $derived(selectedObj ? selectedObj.areacd : null);
</script>

<Header title="Population pyramid" compact={true} />

<main id="main">
  <Section>
    <p style:margin="12px 0 32px">
      Select an area to highlight on the population pyramid. (NB Scotland and
      Northern Ireland population data not yet available.)
    </p>
    <form
      class="select-container"
      on:submit|preventDefault={() => selectArea(selected)}
    >
      <Select
        options={data.areaList2023}
        bind:value={selectedObj}
        labelKey="areanm"
        label="Select a local authority"
        placeholder="Eg. Fareham or Newport"
      />
      <!-- <Button small type="submit">Select area</Button> -->
    </form>
  </Section>

  <Section
    title="Population by age and sex: barcode original"
    marginTop={true}
    width="medium"
  >
    {#await fetchChartData("population-by-age-and-sex", "ltla", "latest")}
      Fetching chart data
    {:then chartData}
      <Barcode
        data={chartData.filter((d) => d.sex !== "All" && d.value != null)}
        bind:selectedArea={selected}
      />
    {:catch}
      Failed to load chart data
    {/await}
  </Section>

  <Section
    title="Population by age and sex: barcode joined lines"
    marginTop={true}
    width="medium"
  >
    {#await fetchChartData("population-by-age-and-sex", "ltla", "latest")}
      Fetching chart data
    {:then chartData}
      <BarcodeJoined
        data={chartData.filter((d) => d.sex !== "All" && d.value != null)}
        bind:selectedArea={selected}
      />
    {:catch}
      Failed to load chart data
    {/await}
  </Section>

  <Section
    title="Population by age and sex: traditional pop pyramid"
    marginTop={true}
    width="medium"
  >
    {#await fetchChartData("population-by-age-and-sex", "ltla", "latest")}
      Fetching chart data
    {:then chartData}
      <Pyramid
        data={chartData.filter((d) => d.sex !== "All" && d.value != null)}
        bind:selectedArea={selected}
      />
    {:catch}
      Failed to load chart data
    {/await}
  </Section>
</main>

<Footer compact={true} />
