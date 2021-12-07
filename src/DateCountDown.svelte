<script>
  import { onMount } from "svelte";

  //let now = Date.now();
  //let end = Date(10 / 10 / 2022);

  //   $: count = Math.round((end - now) / 1000);
  //   $: days = Math.floor(count * 60 * 60 * 24);
  //   $: hours = Math.floor(count / 3600);
  //   $: minutes = Math.floor((count - hours * 3600) / 60);
  //   $: seconds = count - hours * 3600 - minutes * 60;

  let time = new Date();
  let endDate = new Date(10 / 10 / 2022);

  // these automatically update when `time`
  // changes, because of the `$:` prefix
  $: count = Math.round((endDate.getTime() - time.getTime()) / 1000);
  $: days = count * 3600 * 24;
  $: hours = time.getHours();
  $: minutes = time.getMinutes();
  $: seconds = time.getSeconds();

  function updateTimer() {
    time = Date.now();
  }

  onMount(() => {
    console.log(count);
    console.log(days);
    // const interval = setInterval(() => {
    //   updateTimer();
    //   console.log(count);
    // }, 1000);
    // return () => {
    //   clearInterval(interval);
    // };
  });
</script>

<div>
  This is the countdown
  {{ days }} - {{ hours }}
</div>

<style>
</style>
