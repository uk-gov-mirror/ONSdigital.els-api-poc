<script>
  let {
    options,
    selectedRange = $bindable()
  } = $props();

  let selectedIndices = $state([
    options.indexOf(selectedRange[0]) ?? 0, 
    options.indexOf(selectedRange[1]) ?? options.length - 1
  ]);
  $effect(() => {
    selectedRange[0] = options[selectedIndices[0]];
    selectedRange[1] = options[selectedIndices[1]];
  });
</script>

<div>
  <input type="range" name="min" min={0} max={selectedIndices[1]} bind:value={selectedIndices[0]} />
  <input type="range" name="max" min={selectedIndices[0]} max={options.length - 1} bind:value={selectedIndices[1]}/>
</div>