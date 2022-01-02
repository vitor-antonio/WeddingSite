<script>
  import { slide } from "svelte/transition";

  export let name = "";
  export let iconName = "";
  export let isSmallerButton = false;
  export let group = "Item 1";
  export let place = "";
  export let time = "";
  export let location = "";
  $: active = group === name;
</script>

<div class="panel" class:smaller={isSmallerButton}>
  {#if isSmallerButton}
    <button
      class="button-smaller"
      class:selected={active}
      on:click={() => {
        group = group === name ? "" : name;
      }}
    >
      <div class="panel-button-smaller">
        <span class="material-icons" style="font-size: 2rem;">
          {iconName}
        </span>
        <h2 class="title-font-size">{name}</h2>
        <i
          class="icon"
          style="align-self: center; margin-left: 5%;"
          class:active
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
          </svg>
        </i>
      </div>
    </button>
  {:else}
    <button
      class="header"
      class:selected={active}
      on:click={() => {
        group = group === name ? "" : name;
      }}
    >
      <div class="panel-button">
        <span class="material-icons" style="font-size: 2rem;">
          {iconName}
        </span>
        <h2 class="title-font-size">{name}</h2>
        <div class="panel-content-details">
          <p>{place}</p>
          <p>{time}</p>
          <p contenteditable="false" bind:innerHTML={location} />
        </div>
        <i
          class="icon"
          style="align-self: center; margin-left: 5%;"
          class:active
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
          </svg>
        </i>
      </div>
    </button>
  {/if}
  {#if active}
    <div class="content" transition:slide>
      <slot />
    </div>
  {/if}
</div>

<style>
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: "Alice", serif;
    color: #2a2a2a;
  }

  .header.selected {
    background-color: #94b4e3;
  }

  .header.selected > .panel-button > * {
    color: white !important;
  }

  .header.selected > .panel-button > .panel-content-details > * {
    color: white !important;
  }

  .panel-button > .icon.active > svg > path {
    fill: white;
  }

  .panel-button {
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    padding: 0.5rem 0rem;
  }

  .panel-button-smaller {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
    padding: 0.5rem 0rem;
  }

  .button-smaller {
    display: flex;
    width: 100%;
    cursor: pointer;
    background: none;
    line-height: 1;
    border: none;
    outline: none;
    margin: 0;
    padding: 12px 24px;
    text-align: left;
    outline: none;
  }

  .panel-button > * {
    padding: 5px 0px;
  }

  .panel-content-details > * {
    padding: 3px 0px;
  }

  .panel {
    /* border: 1px solid #dfdfdf; */
    border-radius: 0px;
    background-color: #f5f5f5;
    border: solid 2px #94b4e3;
  }

  .panel.smaller {
    background-color: transparent;
    border: none;
  }

  .header {
    display: flex;
    width: 100%;
    background: none;
    line-height: 1;
    border: none;
    outline: none;
    margin: 0;
    padding: 12px 24px;
    text-align: left;
    outline: none;
    border-radius: inherit;
    padding-bottom: 0px;
    cursor: pointer;
  }

  .smaller {
    width: 650px;
    border: none;
  }

  .header:active {
    background: none;
  }
  span {
    line-height: 24px;
  }
  .icon {
    line-height: 0.5;
    transition: 0.25s linear;
  }
  .active {
    transform: rotate(-180deg);
  }

  .content {
    margin: 0;
    padding-bottom: 0px;
  }

  .title-font-size {
    font-size: 22px;
    font-weight: 400;
    letter-spacing: 2px;
  }

  @media screen and (max-width: 650px) {
    .panel-button > .title-font-size {
      font-weight: 400;
      font-size: 18px;
    }

    .panel-button-smaller > .title-font-size {
      font-weight: 400;
      font-size: 18px;
    }
  }
</style>
