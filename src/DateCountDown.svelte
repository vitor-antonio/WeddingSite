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
    <span>Days</span>
  </div>
  <div class="time-unit">
    <span>{hours}</span>
    <span>Hours</span>
  </div>
  <div class="time-unit">
    <span>{minutes}</span>
    <span>Minutes</span>
  </div>
  <div class="time-unit">
    <span>{seconds}</span>
    <span>Seconds</span>
  </div>
</div>

<style>
  .countdown-timer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    font-weight: 500;
  }
  .time-unit {
    display: flex;
    flex-direction: column;
    margin: 25px 20px;
  }

  @media screen and (max-width: 650px) {
    .countdown-timer {
      font-size: 18px;
    }

    .time-unit {
      margin: 15px 10px;
    }
  }
</style>
