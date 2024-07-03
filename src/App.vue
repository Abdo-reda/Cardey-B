<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <main class="h-screen">
    <RouterView v-slot="{ Component }">
      <!-- <Transition name="fade"> -->
      <component :is="Component" />
      <!-- </Transition> -->
    </RouterView>
  </main>
</template>
