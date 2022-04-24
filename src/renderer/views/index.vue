<template>
  <div id="wrapper">
    <progress-bar :step="step"/>
    <div class="main">
      <div style="position:absolute; bottom:0">
        <el-button @click ="toPre">toPre</el-button>
        <el-button @click="toNext">toNext</el-button>
      </div>
      <upload-page v-if="step===0" @toNext="toNext"/>
      <fix-page v-else-if="step===1" @toNext="toNext"/>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-undef */

import ProgressBar from './required/ProgressBar/ProgressBar.vue'
import UploadPage from './required/upload.vue'
import FixPage from './required/fix.vue'
const models = g.models

export default {
  name: 'HomePage',
  components: {
    ProgressBar,
    UploadPage,
    FixPage
  },
  data () {
    return {
      step: 0
    }
  },
  computed: { },
  watch: {
  },
  beforeCreate () { },
  created () { },
  mounted () {

  },
  methods: {
    toNext () {
      console.log(models)
      this.step = Math.min(3, this.step + 1)
    },
    toPre () {
      this.step = Math.max(0, this.step - 1)
    }
  }
}
</script>

<style lang="scss" scoped>
#wrapper {
  height:100vh;
  width: 100%;
}
#logo {
  height: auto;
  margin-bottom: 20px;
  width: 420px;
}
#container {
  height: 768px;
  width: 1024px;
}
.main{
  height: 100%;
}
</style>
