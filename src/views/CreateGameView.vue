<script setup lang="ts">
import IncrementorComponent from '@/components/IncrementorComponent.vue'

import { ref } from 'vue'
import router from '@/plugins/router'
import { RoutesEnum } from '@/core/enums/routesEnum'

const numberOfPlayers = ref(5);
const numberOfTeams = ref(3);
const timePerRound = ref(60);
const wordsPerPlayer = ref(5);

function goToLobby() {
  router.push({ name: RoutesEnum.LOBBY });
}

</script>

<template>
    <div class="flex flex-col justify-center items-center m-6">
      <ACard title="Configure settings for the game">
        <IncrementorComponent title="Number of players" v-model="numberOfPlayers"/>
        <IncrementorComponent title="Number of teams" v-model="numberOfTeams"/>
        <IncrementorComponent title="Time per round (seconds)" :max ="300" :factor="10" v-model="timePerRound"/>
        <IncrementorComponent title="Words per player" v-model="wordsPerPlayer"/>
      </ACard>
      <AButton @click="goToLobby" class="mt-4" type="primary">Start Game</AButton>
    </div>
</template>

