<script setup lang="ts">
import IncrementorComponent from '@/components/IncrementorComponent.vue'
import { inject, ref } from 'vue'
import router from '@/plugins/router'
import { RoutesEnum } from '@/core/enums/routesEnum'
import { Button, Card, FormItem } from 'ant-design-vue';
import type { ValidateInfo } from 'ant-design-vue/es/form/useForm';
import { GameServiceKey } from '@/core/constants/injectionKeys';
import useGameState from '@/core/composables/useGameState';

const gameService = inject(GameServiceKey)!;
const { wordsPerPlayer, numberOfPlayers, numberOfTeams, timePerRound } = useGameState();

const errorInfo = ref<ValidateInfo | undefined>();

async function goToLobby(): Promise<void> {
  if (numberOfPlayers.value < numberOfTeams.value) {
    errorInfo.value = getError('Number of players cannot be less than number of teams')
    return;
  }

  await gameService.joinGameAsync();
  router.push({ name: RoutesEnum.LOBBY });
}

function getError(msg: string): ValidateInfo {
  return {
    help: msg,
    validateStatus: "error",
    required: true
  };
}

</script>

<template>
  <div class="flex flex-col p-4 text-center">
    <div class="overflow-hidden flex justify-center">
      <Card class="w-full max-w-sm" title="Configure Game Settings">
        <IncrementorComponent title="Number of players" v-model="numberOfPlayers" />
        <IncrementorComponent title="Number of teams" v-model="numberOfTeams" />
        <IncrementorComponent title="Time per round (seconds)" :max="300" :factor="10" v-model="timePerRound" />
        <IncrementorComponent title="Words per player" v-model="wordsPerPlayer" />
        <FormItem class="w-full text-center m-0 p-0" v-bind="errorInfo"> </FormItem>
      </Card>
    </div>
    <div class="flex justify-center">
      <Button @click="goToLobby" :block="true" size="large" class="mt-4 w-full max-w-sm" type="primary">Start
        Game</Button>
    </div>
  </div>
</template>
