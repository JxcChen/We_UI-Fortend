<template>
  <div class="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'App',
  }
</script>

<style>
  .app{
    position: fixed;
    height: 100%;
    width: 100%;
  }
  label.irequired:before {
      content: '* ';
      color: red;
  }
</style>

