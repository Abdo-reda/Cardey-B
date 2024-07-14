<script setup lang="ts">
import IncrementorComponent from '@/components/IncrementorComponent.vue'
import { inject, ref } from 'vue'
import router from '@/plugins/router'
import { RoutesEnum } from '@/core/enums/routesEnum'
import { Button, Card, FormItem } from 'ant-design-vue';
import type { ValidateInfo } from 'ant-design-vue/es/form/useForm';
import { HostServiceKey } from '@/core/constants/injectionKeys';

const numberOfPlayers = ref(5);
const numberOfTeams = ref(3);
const timePerRound = ref(60);
const wordsPerPlayer = ref(5);


const hostService = inject(HostServiceKey)!;

/*
//===== HOST
  - roomId
  - peerConnections[] //dictionary -- mapping joinRequestId / playerId
  - dataChannels[] //dictionary -- mapping joinRequestId / playerId

  - sendMessage(playerIds[]?)
  - sendToAll(excludePlayerIds[]?)
  - createNewRoom()

  - 
*/

//could we need multiple hosts? in the same instance of our application?
//sessionStorage (tab specific) 


const errorInfo = ref<ValidateInfo | undefined>();

async function goToLobby(): Promise<void> {
  if (numberOfPlayers.value < numberOfTeams.value) {
    errorInfo.value = getError('Number of players cannot be less than number of teams')
    return;
  }

  await hostService.createNewRoomAsync();

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
    <Card title="Configure settings for the game">
      <IncrementorComponent title="Number of players" v-model="numberOfPlayers" />
      <IncrementorComponent title="Number of teams" v-model="numberOfTeams" />
      <IncrementorComponent title="Time per round (seconds)" :max="300" :factor="10" v-model="timePerRound" />
      <IncrementorComponent title="Words per player" v-model="wordsPerPlayer" />
      <FormItem class="w-full text-center" v-bind="errorInfo"> </FormItem>
    </Card>
    <Button @click="goToLobby" class="mt-4" type="primary">Start Game</Button>
  </div>
</template>
