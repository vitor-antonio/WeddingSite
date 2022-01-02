<script>
  // your script goes here
  let googleAPIcredentials = "AIzaSyDQwc1C5C57PrNUiNCUnDT-1wleMtbA40Y";
  export let locationCode;
  export let isMobileView = false;
</script>

<iframe title="Maps Location"
  width="100%"
  height="460px"
  frameborder="0"
  style="border-radius: 0px; padding-right: 1px;"
  src="https://www.google.com/maps/embed/v1/place?key={googleAPIcredentials}&q={locationCode}&zoom={isMobileView ? '15' : '16'}"
  allowfullscreen
/>

<style>
  /* your styles go here */
</style>
