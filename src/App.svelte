<script lang="ts">
  export let name: string;
  import DateCountDown from "./DateCountDown.svelte";
  import MapsLocation from "./GoogleMapsLocation.svelte";

  let showFirstLocation = true;

  function onSwitchLocationShowing(showLocation: boolean) {
    showFirstLocation = showLocation;
  }
</script>

<main>
  <div class="welcome-banner">
    <h2>We Are Getting Married!</h2>
    <h1>Marta & Vitor</h1>
    <p>Save The Date</p>
    <h2>September 10th 2022</h2>
    <div class="graph-overlay" />
    <div class="elementor-shape graph-container">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
      >
        <path
          class="elementor-shape-fill"
          opacity="0.33"
          d="M473,67.3c-203.9,88.3-263.1-34-320.3,0C66,119.1,0,59.7,0,59.7V0h1000v59.7 c0,0-62.1,26.1-94.9,29.3c-32.8,3.3-62.8-12.3-75.8-22.1C806,49.6,745.3,8.7,694.9,4.7S492.4,59,473,67.3z"
        />
        <path
          class="elementor-shape-fill"
          opacity="0.66"
          d="M734,67.3c-45.5,0-77.2-23.2-129.1-39.1c-28.6-8.7-150.3-10.1-254,39.1 s-91.7-34.4-149.2,0C115.7,118.3,0,39.8,0,39.8V0h1000v36.5c0,0-28.2-18.5-92.1-18.5C810.2,18.1,775.7,67.3,734,67.3z"
        />
        <path
          class="elementor-shape-fill"
          d="M766.1,28.9c-200-57.5-266,65.5-395.1,19.5C242,1.8,242,5.4,184.8,20.6C128,35.8,132.3,44.9,89.9,52.5C28.6,63.7,0,0,0,0 h1000c0,0-9.9,40.9-83.6,48.1S829.6,47,766.1,28.9z"
        />
      </svg>
    </div>
  </div>
  <div>
    <div>
      <p>Days till wedding</p>
      <DateCountDown />
    </div>
    <div class="introduction">
      <h2>Hello Children!</h2>
      <p>
        Skrobia kukurydziana, maltodekstryny, białko roślinne, Bifidobacterium
        Iactis W52; Lactobacillus brevis W63; Lactobacillus casei W56;
        Lactococcus lactis W19; Lactococcus lactis W58; Lactobacillus
        acidophilus W37; Bifidobacterium bifidum W23; Lactobacillus salivarius
        W24; otoczkakapsułki: hydroksypropylometyloceluloza. 1 kapsułka zawiera
        bakterii ≥2.5 x 109 CFU/g żywych szczepów bakterii: Bifidobacterium
        lactis W52, Lactobacillus brevis W63, Lactobacillus casei W56,
        Lactococcus lactis W19, Lactococcus lactis W58, Lactobacillus
        acidophilus W37, Bifidobacterium bifidum W23, Bifidobacterium lactis
        W51, Lactobacillus salivarius W24.
      </p>
      <p>
        Skrobia kukurydziana, maltodekstryny, białko roślinne, Bifidobacterium
        Iactis W52; Lactobacillus brevis W63; Lactobacillus casei W56;
        Lactococcus lactis W19; Lactococcus lactis W58; Lactobacillus
        acidophilus W37; Bifidobacterium bifidum W23; Lactobacillus salivarius
        W24; otoczkakapsułki: hydroksypropylometyloceluloza. 1 kapsułka zawiera
        bakterii ≥2.5 x 109 CFU/g żywych szczepów bakterii: Bifidobacterium
        lactis W52, Lactobacillus brevis W63, Lactobacillus casei W56,
        Lactococcus lactis W19, Lactococcus lactis W58, Lactobacillus
        acidophilus W37, Bifidobacterium bifidum W23, Bifidobacterium lactis
        W51, Lactobacillus salivarius W24.
      </p>
      <!-- <MapsLocation /> -->
    </div>
    <div>
      <h2>When and Where</h2>
      <div>
        <button
          class="location-button"
          on:click={() => (showFirstLocation = true)}
          class:selected={showFirstLocation}
        >
          <span>icon</span>
          <p>Church Ceremony</p>
          <p>Friday, August 28, 2020</p>
          <p>01.00 PM</p>
          <p>678 Central Square Melbourne – 10160, Australia</p>
        </button>
        <button
          class="location-button"
          on:click={() => (showFirstLocation = false)}
          class:selected={!showFirstLocation}
        >
          <span>icon</span>
          <p>Celebration Salon</p>
          <p>Friday, August 28, 2020</p>
          <p>01.00 PM</p>
          <p>678 Central Square Melbourne – 10160, Australia</p>
        </button>
        <div>
          {#if showFirstLocation}
            <!-- <MapsLocation /> -->
            show ceremony location
          {:else}
            <!-- <MapsLocation /> -->
            show celebration location
          {/if}
        </div>
      </div>
    </div>
    <div>
      <h2>If you need a place to stay</h2>
      <div>
        <button class="stay-button">Booking.com Link</button>
        <button class="stay-button"> Air BnB Link </button>
      </div>
    </div>
    <div>
      Contacts
      <div>Vitor and Marta</div>
    </div>
  </div>
  <footer>Hello</footer>
</main>

<style>
  :global(*) {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    text-align: center;
    color: rgb(58, 58, 58);
  }

  :global(body) {
    min-height: 100vh;
    color: hsl(0, 0%, 98%);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
  }

  .graph-overlay {
    background-color: #f2f5f7;
    opacity: 0;
    transition: background 0.3s, border-radius 0.3s, opacity 0.3s;
  }

  .graph-container {
    transform: rotate(180deg);
    bottom: -1px;
  }

  .elementor-shape .elementor-shape-fill {
    fill: #fff;
    -webkit-transform-origin: center;
    -ms-transform-origin: center;
    transform-origin: center;
    -webkit-transform: rotateY(0deg);
    transform: rotateY(0deg);
  }

  h1 {
    /* color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100; */
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }

  .welcome-banner {
    color: white;
    background-color: #88a4cd;
    transition: background 0.3s, border 0.3s, border-radius 0.3s,
      box-shadow 0.3s;
    padding-top: 5rem;
    font-style: normal;
    font-weight: 400;
  }

  .welcome-banner > * {
    color: white;
  }

  .introduction {
    padding: 5rem;
    line-height: 27.85px;
  }

  .location-button {
    background-color: #f5f5f5;
    border: solid 2px #94b4e3;
  }

  .location-button.selected {
    background-color: #94b4e3;
  }

  .introduction > h2 {
    padding: 1rem 0px;
  }
</style>
