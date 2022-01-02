<script>
  import { onMount } from "svelte";

  let weddingDate = new Date("09 / 10 / 2022 12:00").getTime();

  let days = 0;
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  function updateTimer() {
    var nowTime = new Date().getTime();
    var distance = weddingDate - nowTime;
    days = Math.floor(distance / (1000 * 60 * 60 * 24));
    hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    seconds = Math.floor((distance % (1000 * 60)) / 1000);
  }

  onMount(() => {
    const interval = setInterval(() => {
      updateTimer();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  });
</script>

<div class="countdown-timer">
  <div class="time-unit">
    <span>{days}</span>
    <span class="time-unit-legend">Days</span>
  </div>
  <div class="time-unit">
    <span>{hours}</span>
    <span class="time-unit-legend">Hours</span>
  </div>
  <div class="time-unit">
    <span>{minutes}</span>
    <span class="time-unit-legend">Minutes</span>
  </div>
  <div class="time-unit">
    <span>{seconds}</span>
    <span class="time-unit-legend">Seconds</span>
  </div>
</div>

<style>
  .countdown-timer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: 500;
    color: #2a2a2a;
  }

  .time-unit {
    display: flex;
    flex-direction: column;
    margin: 25px 6%;
  }

  .time-unit > span {
    color: #2a2a2a;
    font-family: 'Playfair Display', serif;
    font-size: 24px;
  }

  .time-unit-legend {
    font-size: 18px !important;
  }

  @media screen and (max-width: 650px) {
    .countdown-timer {
      font-size: 18px;
    }

    .time-unit {
      margin: 15px 6%;
    }

    .time-unit > span {
      font-size: 20px;
    }

    .time-unit-legend {
      font-size: 14px !important;
    }
  }
</style>
