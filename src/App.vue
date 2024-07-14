<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <main class="h-screen p-6">
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>
</template>
