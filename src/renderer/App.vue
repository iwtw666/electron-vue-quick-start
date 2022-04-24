<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  window.g = {
    models: []
  }
  export default {
    name: 'scan-to-model',
    mounted () {
      console.log('Version: scan to model v0.0.1')
    }
  }
</script>

<style>
/* CSS */
/* normalize */
*{
  margin: 0;
  padding: 0;
}
html{
  width:100vw;
  height: 100vh;
}
body{
  width:100%;
  height: 100%;
}
#app{
  min-width: 1440px;
  width:100%;
  height: 100%;
  background-color: #F6F7F8;
}

</style>
