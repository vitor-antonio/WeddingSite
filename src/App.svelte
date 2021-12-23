<script lang="ts">
  import DateCountDown from "./DateCountDown.svelte";
  import MapsLocation from "./GoogleMapsLocation.svelte";
  import ExpandablePanel from "./ExpandablePanel.svelte";

  let showFirstLocation = true;
  let bookingLink = "https://bit.ly/3pVJMKk";
  let airbnbLink = "https://www.airbnb.com/s/Leiria--Portugal/homes";

  let windowWidth: number;
  $: isMobile = windowWidth < 650;

  function navigateToLink(url: string) {
    window.open(url, "_blank");
  }
</script>

<svelte:window bind:innerWidth={windowWidth} />
<main>
  <div class="welcome-banner">
    <div class="header-container">
      <h2>We Are Getting Married!</h2>
      <h1>Marta & Vitor</h1>
      <p style="font-size: 18px; margin-top: 15px;">Save The Date</p>
      <h2 style="padding-top: 5px;">September 10th 2022</h2>
    </div>

    <div class="graph-overlay" />
    <div class="elementor-shape graph-container">
      <svg class="svg-graphic"
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
    <div class="location-section">
      <h2 style="margin-bottom: 2rem;">When and Where</h2>
      {#if !isMobile}
        <div>
          <button
            class="location-button"
            on:click={() => (showFirstLocation = true)}
            class:selected={showFirstLocation}
          >
            <span
              class="material-icons"
              style="font-size: 3rem; padding: 1rem;"
            >
              church
            </span>
            <p>Church Ceremony</p>
            <p>Igreja de Colmeias</p>
            <p>12:00</p>
            <p>R. Central nº3411 <br /> 2420-205 Leiria, Portugal</p>
          </button>
          <button
            class="location-button"
            on:click={() => (showFirstLocation = false)}
            class:selected={!showFirstLocation}
          >
            <span
              class="material-icons"
              style="font-size: 3rem; padding: 1rem;"
            >
              celebration
            </span>
            <p>Celebration Salon</p>
            <p>Quinta dos Castanheiros, Morgatoes</p>
            <p>14:00</p>
            <p>
              Estrada Nacional 1/IC2, Km 129 <br /> 2410-656 Boa Vista, Leiria
            </p>
          </button>
          <div>
            <MapsLocation
              locationCode={showFirstLocation
                ? "Igreja+de+Colmeias"
                : "Quinta+dos+Castanheiros+-+Morgatões"}
            />
          </div>
        </div>
      {:else}
        <div class="expandable-panel">
          <ExpandablePanel name={"Church Ceremony"} iconName={"church"}>
            <div class="panel-content-details">
              <p>Igreja de Colmeias</p>
              <p>12:00</p>
              <p>R. Central nº3411 <br /> 2420-205 Leiria, Portugal</p>
            </div>
            <div>
              <MapsLocation locationCode={"Igreja+de+Colmeias"} />
            </div>
          </ExpandablePanel>
        </div>
        <div class="expandable-panel">
          <ExpandablePanel name={"Celebration Salon"} iconName={"celebration"}>
            <div class="panel-content-details">
              <p>Quinta dos Castanheiros, Morgatoes</p>
              <p>14:00</p>
              <p>
                Estrada Nacional 1/IC2, Km 129 <br /> 2410-656 Boa Vista, Leiria
              </p>
            </div>
            <div>
              <MapsLocation
                locationCode={"Quinta+dos+Castanheiros+-+Morgatões"}
              />
            </div>
          </ExpandablePanel>
        </div>
      {/if}
    </div>
    <div style="margin-top: 5rem;">
      <h2>If you need a place to stay</h2>
      <div class="stay-buttons-container">
        <div class="stay-button">
          <div class="stay-button-img booking" />
          <div class="stay-button-content">
            <span> Search for some accomodation on Booking.com </span>
            <button
              class="booking"
              on:click={() => navigateToLink(bookingLink)}
            >
              <img src="../assets/booking-icon.png" alt="booking logo" />
            </button>
          </div>
        </div>

        <div class="stay-button airbnb">
          <div class="stay-button-img airbnb" />
          <div class="stay-button-content">
            <span> Search for some accomodation on Air BnB </span>
            <button class="airbnb" on:click={() => navigateToLink(airbnbLink)}>
              <img src="../assets/airbnb-icon.png" alt="airbnb logo" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <footer>
    <h4>You can contact us:</h4>
    <!-- <div>Our Contacts:</div> -->
    <div class="contacts-container">
      <div class="contact-column">
        <span>Marta</span>
        <div class="contact-content">
          <span>phone: 12121212</span>
          <span>email: aaaaa@aa.com</span>
        </div>
      </div>
      <div class="contact-column">
        <span>Vitor</span>
        <div class="contact-content">
          <span>phone: 12121212</span>
          <span>email: aaaaa@aa.com</span>
        </div>
      </div>
    </div>
  </footer>
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

  .svg-graphic {
    margin-top: -1px;
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

  h2 {
    font-size: 28px;
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
    margin-bottom: 3rem;
  }

  .welcome-banner > * {
    color: white;
  }

  .header-container {
    padding-bottom: 2rem;
  }

  .header-container > * {
    color: white;
    padding: 10px 0px;
  }

  .introduction {
    margin: 5rem;
    line-height: 27.85px;
  }

  .location-section {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .location-button {
    background-color: #f5f5f5;
    border: solid 2px #94b4e3;
    min-width: 20rem;
  }

  .location-button.selected {
    background-color: #94b4e3;
  }

  .location-button.selected > * {
    color: white !important;
  }

  .expandable-panel {
    width: 90%;
    display: flex;
    flex-direction: column;
    margin-top: 5px;
  }

  .introduction > h2 {
    padding: 1rem 0px;
  }

  .stay-buttons-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 3rem 0rem;
  }

  .stay-button {
    border: solid 1px #94b4e3;
    background: transparent;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 17rem;
  }

  .stay-button.airbnb {
    margin-left: 1rem;
  }

  .stay-button-img.booking {
    background-image: url(../assets/booking-img.jpg);
    border-radius: inherit;
    height: 13rem;
    width: 100%;
    background-size: contain;
    background-repeat: no-repeat;
  }

  .stay-button-img.airbnb {
    background-image: url(../assets/airbnb-img.jpg);
    border-radius: inherit;
    height: 13rem;
    width: 100%;
    background-size: contain;
    background-repeat: no-repeat;
  }

  .stay-button-content {
    display: flex;
    flex-direction: column;
    width: 85%;
    height: 11rem;
    justify-content: space-between;
    align-items: center;
  }

  .stay-button-content > span {
    padding: 15px 0px;
  }

  .stay-button-content > button {
    margin-bottom: 3rem;
    height: 3rem;
    background-repeat: no-repeat;
    background-size: contain;
    background-color: transparent;
    border: transparent;
    background-position-x: center;
    width: fit-content;
    cursor: pointer;
  }

  .stay-button-content > button.booking > img {
    border-radius: 5px;
    height: 50px;
  }

  .stay-button-content > button.airbnb > img {
    border-radius: 5px;
    height: 50px;
  }

  footer {
    height: 10rem;
    background: #94b4e3;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 500;
  }

  .contacts-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    width: 80%;
    align-self: center;
  }

  .contact-column {
    display: flex;
    flex-direction: column;
    font-size: 1.2rem;
    font-weight: 500;
  }

  .contact-content {
    display: flex;
    flex-direction: column;
  }

  @media screen and (max-width: 650px) {
    .stay-buttons-container {
      flex-direction: column;
      align-items: center;
    }

    .stay-button.airbnb {
      margin-left: 0rem;
      margin-top: 1rem;
    }

    footer {
      height: auto;
      padding: 1rem 0rem;
    }

    .contacts-container {
      flex-direction: column;
      justify-content: center;
      height: auto;
    }

    .contacts-container>.contact-column{
      padding: 1rem 0rem;
    }

    .panel-content-details {
      padding: 1rem 0rem;
    }

    .panel-content-details>* {
      padding: 0.3rem 0rem;
    }
  }
</style>
