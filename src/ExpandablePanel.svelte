<script>
  import { slide } from "svelte/transition";

  export let name = "";
  export let iconName = "";
  export let group = "Item 1";
  $: active = group === name;
</script>

<div class="panel">
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
      <span>{name}</span>
      <i class="icon" class:active>
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
  .panel-button {
    display: flex;
    flex-direction: row;
    /* place-content: unset; */
    width: 100%;
    justify-content: space-between;
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
</style>
