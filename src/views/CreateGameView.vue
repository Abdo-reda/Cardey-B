<script setup lang="ts">
import IncrementorComponent from '@/components/IncrementorComponent.vue'
import { inject, ref } from 'vue'
import router from '@/plugins/router'
import { RoutesEnum } from '@/core/enums/routesEnum'
import { Button, Card, FormItem } from 'ant-design-vue';
import type { ValidateInfo } from 'ant-design-vue/es/form/useForm';
import { GameServiceKey } from '@/core/constants/injectionKeys';

const gameService = inject(GameServiceKey)!;
const gameSettings = gameService.gameState.value.gameSettings;

const errorInfo = ref<ValidateInfo | undefined>();

async function goToLobby(): Promise<void> {
  if (gameSettings.numberOfPlayers < gameSettings.numberOfTeams) {
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
  <div class="flex flex-col justify-center items-center p-6 text-center">
    <Card title="Configure Game Settings">
      <IncrementorComponent title="Number of players" v-model="gameSettings.numberOfPlayers" />
      <IncrementorComponent title="Number of teams" v-model="gameSettings.numberOfTeams" />
      <IncrementorComponent title="Time per round (seconds)" :max="300" :factor="10"
        v-model="gameSettings.timePerRound" />
      <IncrementorComponent title="Words per player" v-model="gameSettings.wordsPerPlayer" />
      <FormItem class="w-full text-center m-0 p-0" v-bind="errorInfo"> </FormItem>
    </Card>
    <Button @click="goToLobby" class="mt-4" type="primary">Start Game</Button>
  </div>
</template>
