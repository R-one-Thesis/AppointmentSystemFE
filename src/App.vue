<template>
  <router-view />
</template>

<script setup>
import { auth } from "./stores/auth";
const authInstance = auth();
// Initialize the auth store


// Call initializeUserFromLocalStorage on mounted (when the app starts or refreshes

</script>
