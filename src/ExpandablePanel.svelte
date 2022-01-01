<script>
  import { slide } from "svelte/transition";

  export let name = "";
  export let iconName = "";
  export let isSmallerButton = false;
  export let group = "Item 1";
  $: active = group === name;
</script>

<div class="panel" class:smaller={isSmallerButton}>
  <button
    class="header"
    on:click={() => {
      group = group === name ? "" : name;
    }}
  >
    <div class="panel-button">
      <span class="material-icons" style="font-size: 2rem;">
        {iconName}
      </span>
      <h2 style="font-size: 30px; font-weight: 400;">{name}</h2>
      <i class="icon" style="align-self: center; margin-left: 5%;" class:active>
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

  {#if active}
    <div class="content" transition:slide>
      <slot />
    </div>
  {/if}
</div>

<style>
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Alice', serif;
    color: #2A2A2A;
  }

  .panel-button {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
  }

  .panel {
    border: 1px solid #dfdfdf;
    border-radius: 0px;
  }

  .header {
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

  .smaller {
    width: 650px;
    border: none;
  }

  .h2 {
    font-size: 28px;
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

  @media screen and (max-width: 650px) {
    .panel-button > h2 {
      font-weight: 400;
      font-size: 18px;
    }
  }
</style>
