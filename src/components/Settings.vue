<template>
  <div>
    <label for="distance">Enter Distance (in feet):</label>
    <input v-model="settings.distance" type="number" id="distance" />
  </div>

  <div>
    <label for="intervalTime">Select Interval Time (in seconds):</label>
    <select id="intervalTime" v-model="settings.intervalTime">
      <option :value="15">15 seconds</option>
      <option :value="30">30 seconds</option>
      <option :value="60">1 minute</option>
      <option :value="120">2 minutes</option>
      <option :value="180">3 minutes</option>
      <option :value="240">4 minutes</option>
      <option :value="300">5 minutes</option>
    </select>
  </div>

  <button @click="emits('trackData', settings)">Track Me</button>
</template>

<script setup lang="ts">
import { ref } from "vue";

const emits = defineEmits(["trackData"]);

const settings = ref({
  distance: 150,
  intervalTime: 15,
});
</script>
