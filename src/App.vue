<template>
  <div id="app">
    <EngineToggle :engineOn="engineOn" @toggle="toggleEngine" />
    <UGVMap :engineOn="engineOn" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import EngineToggle from './components/EngineToggle.vue'
import UGVMap from './components/UGVMap.vue'

const engineOn = ref(false)
const toggleEngine = () => {
  engineOn.value = !engineOn.value;
}
</script>

<style scoped>
#app {
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  position: relative;
}
</style>