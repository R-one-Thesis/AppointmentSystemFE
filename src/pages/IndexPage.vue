<template>
  <div class="calendar-container">
    <q-calendar view="month" :week-days="[1, 2, 3, 4, 5]" v-model="date" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
const date = ref(new Date());
</script>

