<script>
  let now = Date.now();
  let end = Date(10/10/2022);

  $: count = Math.round((end - now) / 1000);
  $: h = Math.floor(count / 3600);
  $: m = Math.floor((count - h * 3600) / 60);
  $: s = count - h * 3600 - m * 60;
</script>

<style>
</style>
