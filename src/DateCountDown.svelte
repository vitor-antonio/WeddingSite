<script>
  import { onMount } from "svelte";
  import moment from "moment";
  //let now = Date.now();
  //let end = Date(10 / 10 / 2022);

  //   $: count = Math.round((end - now) / 1000);
  //   $: days = Math.floor(count * 60 * 60 * 24);
  //   $: hours = Math.floor(count / 3600);
  //   $: minutes = Math.floor((count - hours * 3600) / 60);
  //   $: seconds = count - hours * 3600 - minutes * 60;

  let time = new Date();
  let endDate = new Date("09 / 10 / 2022 12:00");

  // these automatically update when `time`
  // changes, because of the `$:` prefix
  // console.log(endDate.getTime());
  // console.log(time.getTime());
  // $: count = Math.round((endDate.getTime() - time.getTime()) / 1000);
  // $: days = count * 3600 * 24;
  // $: hours = time.getHours();
  // $: minutes = time.getMinutes();
  // $: seconds = time.getSeconds();

  console.log(endDate);
  console.log(time);

  let newEndDate = endDate * 1000;
  const difference = endDate.getTime() - time.getTime();

  let now = Date.now();
  $: count = Math.round((newEndDate - Date.now()) / 1000);
  $: h = Math.floor(count / 3600);
  $: m = Math.floor((count - h * 3600) / 60);
  $: s = count - h * 3600 - m * 60;

  //const difference = endDate.getTime() - time.getTime();

  const days = Math.round(difference / (1000 * 3600 * 24));
  //const hours = Math.ceil(difference / (1000 * 3600));
  console.log(days + " days to Wedding");
  // console.log(h + ' hours to Wedding');
  // console.log(m + ' minutes to Wedding');
  // console.log(s + ' seconds to Wedding');

  var duration = moment.duration((endDate.getTime() - time.getTime()) * 1000, "milliseconds");
  console.log(duration.days());
  // console.log(m + ' minutes to Wedding');
  // console.log(s + ' seconds to Wedding');

  function updateTimer() {
    time = Date.now();
  }

  onMount(() => {
    console.log(count);
    //console.log(days);
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
  {h} - {m}
</div>

<style>
</style>
