<script lang="ts">
  export let name: string;
</script>

<main>
  <div>
    <h2>We Are Getting Married!</h2>
    <h1>Marta & Vitor</h1>
    <p>Save The Date</p>
    <h2>September 10th 2022</h2>
  </div>
  <div>
    <p>Days till wedding</p>
  </div>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }

  .welcome-banner {
    background-color: #88a4cd;
    transition: background 0.3s, border 0.3s, border-radius 0.3s,
      box-shadow 0.3s;
    margin-top: 0px;
    margin-bottom: 0px;
  }
</style>
