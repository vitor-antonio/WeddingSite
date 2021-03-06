<script lang="ts">
  import DateCountDown from "./DateCountDown.svelte";
  import MapsLocation from "./GoogleMapsLocation.svelte";
  import ExpandablePanel from "./ExpandablePanel.svelte";
  import { onMount } from "svelte";

  let showFirstLocation = true;
  let bookingLink = "https://bit.ly/3pVJMKk";
  let airbnbLink = "https://www.airbnb.com/s/Leiria--Portugal/homes";

  let windowWidth: number;
  $: isMobile = windowWidth < 650;

  function navigateToLink(url: string) {
    window.open(url, "_blank");
  }

  let languages = {
    pl: {
      firstText: "POBIERAMY SIĘ!",
      thirdText: "10 Wrzesień 2022",
      fourthText: "Witajcie!",
      fifthText:
        "<p style='margin: 1rem 0rem; text-align: justify;'>Wszystko zaczęło się w 2012 roku, kiedy poznaliśmy się przez Internet. Niedługo później, bo już po roku, Vitor przyleciał do Polski i oficjalnie zostaliśmy parą. Już wtedy wiedzieliśmy, że ten związek ma przyszłość, dlatego zamieszkaliśmy razem we Wrocławiu pół roku później. Pomimo tego, że nasze wspólne życie nie zawsze było łatwe i kolorowe, jesteśmy szczęśliwi i cieszymy się z tego, co razem osiągnęliśmy, dlatego też chcemy Wam powiedzieć, że po 9 latach związku <span style='font-weight: 600;'>bierzemy ślub!</span> Będzie nam niezmiernie miło, jeśli będziecie towarzyszyć Nam w tym wyjątkowym dniu, <span style='font-weight: 600;'>10 września 2022 roku</span>. </p><p style='margin: 1rem 0rem; text-align: justify;'>Ślub i wesele odbędą się <span style='font-weight: 600;'>w Portugalii</span>, a dokładnie w rodzinnej miejscowości Vitora - <span style='font-weight: 600;'>Leiria</span>. To miejscowość położona w zachodniej części tego kraju, oddalona od Oceanu Atlantyckiego o około 20 km i licząca około 130 tysięcy mieszkańców. Wrzesień to miesiąc, kiedy pogoda w tym kraju jest jeszcze sprzyjająca, a średnia temperatura wynosi  około 25 stopni Celsjusza. Jest to idealny czas na to, by odwiedzić Portugalię, która jest jednym z tych uroczych miejsc, o których można z pełnym przekonaniem powiedzieć, że mają wszystko, by Was zachwycić: historyczne miasta, światowej sławy kuchnię, niesamowite krajobrazy i jedne z najbardziej spektakularnych plaż na świecie. Będziecie mogli się o tym przekonać już we wrześniu, przy okazji wizyty na naszym ślubie i weselu. </p><p style='margin: 1rem 0rem; text-align: justify;'>Nie zdradzimy Wam od razu wszystkiego, co dla Was zaplanowaliśmy, ale na pewno będzie to niezapomniane, międzykulturowe wydarzenie i doświadczenie. Choć wesela w Portugalii różnią się nieco od wesel organizowanych w Polsce, to atmosfera jest równie gorąca i zabawa trwa od godziny 12-tej w południe do białego rana! Będziecie mogli skosztować portugalskich specjałów, w tym świeżych ryb, owoców morza i  lokalnych, mięsnych potraw, ale również jedyny w swoim rodzaju deser - Pastéis de nata, który skradnie serce każdego łasucha. Oczywiście nie zabraknie także słynnego na całym świecie portugalskiego wina - Porto, którym będziemy mogli wspólnie wznosić toasty za zdrowie naszych Gości. Przyjęcie weselne trwa wiele godzin, dlatego też w Portugalii nie obchodzi się “poprawin” - następnego dnia będziecie mogli na spokojnie odespać nieprzespaną noc. </p><p style='margin: 1rem 0rem; text-align: justify;'>Ślub odbędzie się w uroczym, małym kościele w <span style='font-weight: 600;'>Colmeias</span>, skąd pochodzi Vitor. Przyjęcie zaplanowaliśmy natomiast w <span style='font-weight: 600;'>Quinta dos Castanheiros - Morgatões</span>, sali weselnej oddalonej od kościoła o 5 km. Wszystko oczywiście w bliskiej odległości od miejscowości Leiria (14 km od Colmeias). W dniu ślubu planujemy zorganizować dla Was dojazd z Leiria do kościoła oraz na salę weselną, a także z powrotem do Leiria. Odnośnie przylotu do Portugalii, najlepiej będzie Wam dolecieć na lotnisko w Lizbonie, a następnie dojechać do Leiria, która jest oddalona od lotniska o 140 km (1,5 godziny drogi). Dalsze wskazówki odnośnie transportu przekażemy Wam bliżej terminu ślubu, abyście mogli na spokojnie i bez stresu zorganizować swoją podróż.</p><p style='margin: 1rem 0rem; text-align: justify;'>Oficjalne zaproszenia również planujemy przekazać Wam bliżej terminu ślubu, jednak będzie nam bardzo miło, jeśli  już teraz zarezerwujecie sobie termin - <span style='font-weight: 600;'>10 września 2022 roku</span>, aby móc towarzyszyć Nam w tym szczególnym dniu. Mamy nadzieję, że ten czas będzie wyjątkowy również dla Was i zapamiętacie Nasz ślub i wesele jako niezapomniane wydarzenie! </p>",
      sixthText: "Gdzie i Kiedy",
      seventhText: "Jeśli potrzebujesz miesjca na nocleg",
      bookingText: "Szukaj noclegu na Booking.com",
      airbnbText: "Szukaj noclegu na Airbnb",
      eigthText: "Kontakt",
      phoneText: "telefon:",
      emailText: "email:",
      churchCeremony: "Ceremonia w Kościele",
      celebrationSalon: "Sala Weselna",
      daysString: "Dni",
      hoursString: "Godzin",
      minutesString: "Minut",
      secondsString: "Sekund",
      bottomText:
        "<p style='margin: 1rem 0rem; text-align: justify;'>Chcemy, aby ta strona była dla Was pomocna i zawierała niezbędne informacje, które pomogą Wam zorganizować swój pobyt w Portugalii na Naszym ślubie i weselu, dlatego też będziemy ją systematycznie rozwijać. Planujemy dodać m.in. informacje dotyczące dojazdu z lotniska w Lizbonie do miejscowości Leiria, a także polecane miejsca do zobaczenia w Portugalii. </p><p style='margin: 1rem 0rem; text-align: justify;'>Jeśli macie jakiekolwiek pytania - skontaktujcie się z Nami na social media (Facebook), telefonicznie albo bezpośrednio. Chętnie udzielimy Wam odpowiedzi.</p>",
    },
    pt: {
      firstText: "VAMOS DAR O NÓ!",
      thirdText: "10 de Setembro de 2022",
      fourthText: "Olá!",
      fifthText: "<p style='margin: 1rem 0rem; text-align: justify;'>Tudo começou em 2012, quando nos conhecemos pela internet. Depois de um ano, o Vitor veio para a Polónia e a partir daí tornamo-nos oficialmente num casal. Já sabíamos então que esta relação teria futuro, por isso mudamo-nos juntos para Wrocław seis meses depois. Apesar do nosso percurso nem sempre ter sido fácil e colorido, estamos felizes com o que conquistámos juntos, por isso queremos anunciar que após 9 anos de relacionamento, <span style='font-weight: 600;'>vamos casar!</span> Ficaríamos muito satisfeitos se se juntassem-se a nós neste dia especial, <span style='font-weight: 600;'>10 de Setembro de 2022</span>.</p><p style='margin: 1rem 0rem; text-align: justify;'>O casamento e celebração vão decorrer em <span style='font-weight: 600;'>Leiria</span>. O casamento irá ser na Igreja de Colmeias e a festa está programada para a <span style='font-weight: 600;'>Quinta dos Castanheiros - Morgatões</span>, salão de festas a 5 km da Igreja.</p><p style='margin: 1rem 0rem; text-align: justify;'>Pretendemos entregar os convites oficiais mais perto da data do casamento, mas ficaríamos muito satisfeitos se reservassem já a data <span style='font-weight: 600;'>10 de Setembro de 2022</span>, para nos poderem acompanhar neste dia tão especial para nós. Esperamos que este momento seja tão especial para vocês como para nós e que se lembrem do nosso casamento como um acontecimento inesquecível!</p>",      
      sixthText: "Quando e Onde",
      seventhText: "Se presisarem de alojamento",
      bookingText: "Procurar alojamento no Booking.com",
      airbnbText: "Procurar alojamento no Airbnb",
      eigthText: "Contactos",
      phoneText: "telefone:",
      emailText: "email:",
      churchCeremony: "Cerimónia Religiosa",
      celebrationSalon: "Salão de Baquete",
      daysString: "Dias",
      hoursString: "Horas",
      minutesString: "Minutos",
      secondsString: "Segundos",
      bottomText:
      "<p style='margin: 1rem 0rem; text-align: justify;'>Queremos que esta página vos seja útil e contenha a informação necessária a ajudar-vos a organizar a vossa ida ao casamento, pelo que poderemos vir a atualizá-la. Se tiverem alguma dúvida - falem conosco nas redes sociais (Facebook), por telefone ou diretamente. Teremos o maior prazer em responder e ajudar.</p>",
    },
    en: {
      firstText: "WE ARE GETTING MARRIED!",
      thirdText: "September 10th 2022",
      fourthText: "Hello!",
      fifthText:
        "<p style='margin: 1rem 0rem; text-align: justify;'>It all started in 2012, when we met on the Internet. After a year Vitor came to Poland and we officially became a couple. We already knew then that this relationship had a future, so we moved together to Wrocław six months later. Despite the fact that our life together was not always easy and colorful, we are happy with what we achieved together, so we want to tell you that after 9 years of relationship, <span style='font-weight: 600;'>we are getting married!</span> We will be very pleased if you will join us on this special day, <span style='font-weight: 600;'>September 10, 2022</span>. </p><p style='margin: 1rem 0rem; text-align: justify;'>The wedding and reception will take place in <span style='font-weight: 600;'>Portugal</span>, and more precisely in the hometown of Vitor - <span style='font-weight: 600;'>Leiria</span>. It is a town located in the western part of the country, about 20 km from the Atlantic Ocean and with a population of about 130,000. September is the month when the weather in this country is still pleasant, and the average temperature is around 25 degrees. This is the perfect time to visit Portugal, which is one of those lovely places that you can confidently say has everything to impress you: historic cities, world-famous cuisine, amazing landscapes and some of the most spectacular beaches in the world. You will be able to find out about it in September, when you come to our wedding.</p><p style='margin: 1rem 0rem; text-align: justify;'>We will not immediately reveal to you everything that we have planned for you, but it will certainly be an intercultural event and experience to remember. Although weddings in Portugal are slightly different from weddings organized in Poland, the atmosphere is equally exciting and the party lasts from 12 noon until dawn! You will be able to taste Portuguese specialties, including fresh fish, seafood and local meat dishes, but also a unique dessert - Pastéis de nata, which will steal the heart of every foodie. Of course, there will also be the world-famous Portuguese wine - Porto, with which we will be able to toast together.</p><p style='margin: 1rem 0rem; text-align: justify;'>The wedding will take place in a lovely little church in <span style='font-weight: 600;'>Colmeias</span>, where Vitor comes from. We have planned the party in <span style='font-weight: 600;'>Quinta dos Castanheiros - Morgatões</span>, a wedding hall 5 km away from the church. Everything, of course, in close proximity to the town of Leiria (14 km from Colmeias). On the day of the wedding, we plan to organize transport for you from Leiria to the church and to the wedding hall, as well as back to Leiria. Regarding your arrival in Portugal, the best idea is to fly to Lisbon airport and then travel to Leiria, which is 140 km away (1,5 hours away). We will provide you with further transport tips closer to the wedding date, so that you can organize your trip safely and without stress. </p><p style='margin: 1rem 0rem; text-align: justify;'>We also plan to provide you with official invitations closer to the wedding date, but we will be very pleased if you book the date now - <span style='font-weight: 600;'>September 10, 2022</span>, to be able to accompany us on this special day. We hope that this time will also be special for you and you will remember our wedding as an unforgettable event!</p>",
      sixthText: "When and Where",
      seventhText: "If you need a place to stay",
      bookingText: "Search on Booking.com",
      airbnbText: "Search on Airbnb",
      eigthText: "Contacts",
      phoneText: "phone:",
      emailText: "email:",
      churchCeremony: "Church Ceremony",
      celebrationSalon: "Wedding Hall",
      daysString: "Days",
      hoursString: "Hours",
      minutesString: "Minutes",
      secondsString: "Seconds",
      bottomText:
        "<p style='margin: 1rem 0rem; text-align: justify;'>We want this page to be helpful for you and contain the necessary information that will help you organize your stay in Portugal, therefore we will continue to update it. We plan to add, among others, information on how to travel from Lisbon airport to Leiria, as well as recommended places to see in Portugal. </p><p style='margin: 1rem 0rem; text-align: justify;'>If you have any questions - contact us on social media (Facebook), by phone or directly. We will be happy to answer them.</p>",
    },
  };

  let currentLanguageCode = "";

  function languageButtonClicked(languageCode: string) {
    window.location.hash = languageCode;
    location.reload();
  }

  onMount(() => {
    var elementsToTranslate = document.querySelectorAll("[translated-text]");
    currentLanguageCode = window.location.hash.replace("#", "");
    console.log(currentLanguageCode);
    if (currentLanguageCode) {
      elementsToTranslate.forEach(function (element) {
        element.innerHTML = languages[currentLanguageCode][element.id];
      });
    } else {
      currentLanguageCode = "pl";
      elementsToTranslate.forEach(function (element) {
        element.innerHTML = languages[currentLanguageCode][element.id];
      });
    }
  });
</script>

<svelte:window bind:innerWidth={windowWidth} />
<main>
  <div class="welcome-banner">
    <div class="language-switcher">
      <a href="#pl" on:click={() => languageButtonClicked("pl")}>
        <span id="lang-pl" flag-button> PL </span>
      </a>
      <a href="#pt" on:click={() => languageButtonClicked("pt")}>
        <span id="lang-pt" flag-button> PT </span>
      </a>
      <a href="#en" on:click={() => languageButtonClicked("en")}>
        <span id="lang-en" flag-button> EN </span>
      </a>
    </div>
    <div class="header-container">
      <!-- svelte-ignore a11y-missing-content -->
      <h2
        translated-text
        id="firstText"
        style="letter-spacing: 4px;"
        class="text-font-size"
      />
      <h1 class="main-title-font">Marta & Vitor</h1>
      <!-- svelte-ignore a11y-missing-content -->
      <h2
        style="padding-top: 5px;"
        class="title-font-size"
        translated-text
        id="thirdText"
      />
    </div>

    <div class="graph-overlay" />
    <div class="elementor-shape graph-container">
      <svg
        class="svg-graphic"
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
      <DateCountDown
        daysText={languages[currentLanguageCode]?.daysString}
        hoursText={languages[currentLanguageCode]?.hoursString}
        minutesText={languages[currentLanguageCode]?.minutesString}
        secondsText={languages[currentLanguageCode]?.secondsString}
      />
    </div>
    <div class="introduction">
      <!-- svelte-ignore a11y-missing-content -->
      <h2 translated-text id="fourthText" class="title-font-size" />
      <div class="main-intro-text" translated-text id="fifthText" />
    </div>
    <div class="location-section">
      <!-- svelte-ignore a11y-missing-content -->
      <h2
        style="margin-bottom: 2rem;"
        class="title-font-size"
        translated-text
        id="sixthText"
      />
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
            <h3 style="margin-bottom: 10px;">
              {languages[currentLanguageCode]?.churchCeremony}
            </h3>
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
            <h3 style="margin-bottom: 10px;">
              {languages[currentLanguageCode]?.celebrationSalon}
            </h3>
            <p>Quinta dos Castanheiros, Morgatoes</p>
            <p>14:00</p>
            <p>
              Estrada Nacional 1/IC2, Km 129 <br /> 2410-656 Boa Vista, Leiria
            </p>
          </button>
          <div>
            <MapsLocation
              isMobileView={false}
              locationCode={showFirstLocation
                ? "Igreja+de+Colmeias"
                : "Quinta+dos+Castanheiros+-+Morgatões"}
            />
          </div>
        </div>
      {:else}
        <div class="expandable-panel">
          <ExpandablePanel
            name={languages[currentLanguageCode]?.churchCeremony}
            iconName={"church"}
            place={"Igreja de Colmeias"}
            time={"12:00"}
            location={"R. Central nº3411 <br /> 2420-205 Leiria, Portugal"}
            isSmallerButton={false}
          >
            <div>
              <MapsLocation
                isMobileView={true}
                locationCode={"Igreja+de+Colmeias"}
              />
            </div>
          </ExpandablePanel>
        </div>
        <div class="expandable-panel">
          <ExpandablePanel
            name={languages[currentLanguageCode]?.celebrationSalon}
            iconName={"celebration"}
            place={"Quinta dos Castanheiros, Morgatoes"}
            time={"14:00"}
            location={"Estrada Nacional 1/IC2, Km 129 <br /> 2410-656 Boa Vista, Leiria"}
            isSmallerButton={false}
          >
            <div>
              <MapsLocation
                isMobileView={true}
                locationCode={"Quinta+dos+Castanheiros+-+Morgatões"}
              />
            </div>
          </ExpandablePanel>
        </div>
      {/if}
    </div>
    <div class="expandable-panel-container">
      <ExpandablePanel
        name={languages[currentLanguageCode] &&
        languages[currentLanguageCode]["seventhText"]
          ? languages[currentLanguageCode]["seventhText"]
          : "If you need a place to stay"}
        isSmallerButton={true}
        iconName={""}
      >
        <div class="stay-buttons-container">
          <div class="stay-button">
            <div class="stay-button-img booking" />
            <div class="stay-button-content">
              <!-- translated-text id="bookingText" -->
              <span>{languages[currentLanguageCode]?.bookingText}</span>
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
              <!-- translated-text id="airbnbText" -->
              <span>{languages[currentLanguageCode]?.airbnbText}</span>
              <button
                class="airbnb"
                on:click={() => navigateToLink(airbnbLink)}
              >
                <img src="../assets/airbnb-icon.png" alt="airbnb logo" />
              </button>
            </div>
          </div>
        </div>
      </ExpandablePanel>
    </div>
    <div class="introduction bottom">
      <p translated-text id="bottomText" />
    </div>
  </div>
  <footer>
    <h4 translated-text id="eigthText" class="title-font-size">
      You can contact us:
    </h4>
    <div class="contacts-container">
      <div class="contact-column">
        <span>Marta</span>
        <div class="contact-content">
          <div>
            <span translated-text id="phoneText">phone: </span><span>
              +48 602 624 712 <br style="margin-bottom: 5px;" /></span
            >
          </div>
          <div>
            <span translated-text id="emailText">email:</span><span>
              kruczykmarta@gmail.com</span
            >
          </div>
        </div>
      </div>
      <div class="contact-column">
        <span>Vitor</span>
        <div class="contact-content">
          <div>
            <span translated-text id="phoneText">phone: </span><span>
              +48 536 553 653 <br />
              +351 924 243 851</span
            >
          </div>

          <div>
            <span translated-text id="emailText">email: </span><span>
              jiggseven@gmail.com</span
            >
          </div>
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
    color: #808285;
    font-size: 14px;
  }

  :global(body) {
    min-height: 100vh;
    font-family: "Muli", sans-serif;
    font-weight: 300;
    color: #808285;
    font-size: 14px;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    /* font-family: "Alice", serif; */
    /* font-family: 'Libre Baskerville', serif; */
    font-family: "Playfair Display", serif;
    color: #2a2a2a;
  }

  h3 {
    font-size: 16px;
    letter-spacing: 2px;
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

  .welcome-banner {
    color: white;
    background-color: #88a4cd;
    transition: background 0.3s, border 0.3s, border-radius 0.3s,
      box-shadow 0.3s;
    padding-top: 5rem;
    font-style: normal;
    font-weight: 400;
    margin-bottom: 0rem;
  }

  .welcome-banner > * {
    color: white;
  }

  .language-switcher {
    display: flex;
    flex-direction: row;
    justify-content: end;
    margin: 0rem 7rem 1rem 0rem;
  }

  .language-switcher > a {
    margin: 0rem 0.5rem;
  }

  .language-switcher > a > span {
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
    margin: 3rem 11rem;
    margin-bottom: 4rem;
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
    min-width: 27rem;
    padding-bottom: 20px;
    cursor: pointer;
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
    width: 20rem;
  }

  .stay-button.airbnb {
    margin-left: 1rem;
  }

  .stay-button-img.booking {
    background-image: url(../assets/booking-img.jpg);
    border-radius: inherit;
    height: 16rem;
    width: 100%;
    background-size: cover;
    background-repeat: no-repeat;
  }

  .stay-button-img.airbnb {
    background-image: url(../assets/airbnb-img.webp);
    border-radius: inherit;
    height: 16rem;
    width: 100%;
    background-size: cover;
    background-repeat: no-repeat;
  }

  .stay-button-content {
    display: flex;
    flex-direction: column;
    width: 85%;
    height: 9rem;
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
    background: #94b4e3;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 500;
    padding: 2rem 0rem 3rem 0rem;
  }

  footer > * {
    color: white;
  }

  .contacts-container {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    width: 80%;
    margin-top: 10px;
    align-self: center;
  }

  .contact-column {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 1.2rem;
    font-weight: 500;
  }

  .contact-column > * {
    color: white;
  }

  .contact-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    align-items: center;
    /* justify-content: space-between; */
  }

  .contact-column > span {
    font-size: 25px;
    font-family: "Playfair Display", serif;
  }

  .contact-content > div > * {
    color: white;
    margin: 5px;
    font-family: "Playfair Display", serif;
    font-size: 16px;
    letter-spacing: 1px;
  }

  .contact-content > div {
    display: flex;
  }

  .expandable-panel-container {
    margin: 2rem 0rem 3rem;
    display: flex;
    justify-content: center;
  }

  .title-font-size {
    font-size: 30px;
    font-weight: 400;
  }

  .text-font-size {
    font-size: 14px;
    font-weight: 400;
  }

  .main-title-font {
    font-size: 64px;
    font-weight: 400;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }

  @media screen and (max-width: 650px) {
    .introduction {
      margin: 2rem;
      margin-bottom: 3rem;
      line-height: 27.85px;
    }

    .introduction.bottom {
      margin-top: 1rem;
    }

    .stay-buttons-container {
      flex-direction: column;
      align-items: center;
      margin-top: 0rem;
      margin-bottom: 0rem;
    }

    .stay-button.airbnb {
      margin-left: 0rem;
      margin-top: 1rem;
    }

    footer {
      height: auto;
      padding: 1rem 0rem;
    }

    .welcome-banner {
      padding-top: 2rem;
    }

    .language-switcher {
      margin: 0rem 0rem 3rem 0rem;
      justify-content: center;
    }

    .contacts-container {
      flex-direction: column;
      justify-content: center;
      height: auto;
    }

    .expandable-panel-container {
      margin: 1rem 0rem 0rem;
    }

    .contacts-container > .contact-column {
      padding: 1rem 0rem;
    }

    .title-font-size {
      font-size: 24px;
      font-weight: 400;
    }

    .text-font-size {
      font-size: 14px;
      font-weight: 400;
    }

    .main-title-font {
      font-size: 34px;
      font-weight: 400;
    }
  }
</style>
