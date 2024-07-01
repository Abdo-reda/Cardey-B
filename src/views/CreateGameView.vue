<script setup lang="ts">
import IncrementorComponent from '@/components/IncrementorComponent.vue'
import { ref } from 'vue'
import router from '@/plugins/router'
import { RoutesEnum } from '@/core/enums/routesEnum'
import { FormItem } from 'ant-design-vue';
import type { ValidateInfo } from 'ant-design-vue/es/form/useForm';

const numberOfPlayers = ref(5);
const numberOfTeams = ref(3);
const timePerRound = ref(60);
const wordsPerPlayer = ref(5);


// const errorInfo: ValidateInfo = reactive({
//   help: 'ok',
//   validateStatus: "error",
//   required: true 
// });

const errorInfo = ref<ValidateInfo|undefined>();

function goToLobby(): void {
  if (numberOfPlayers.value < numberOfTeams.value) {
    errorInfo.value = getError('Number of players cannot be less than number of teams')
    return;
  } 
    
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
    <div class="flex flex-col justify-center items-center m-6">
      <ACard title="Configure settings for the game">
        <IncrementorComponent title="Number of players" v-model="numberOfPlayers"/>
        <IncrementorComponent title="Number of teams" v-model="numberOfTeams"/>
        <IncrementorComponent title="Time per round (seconds)" :max ="300" :factor="10" v-model="timePerRound"/>
        <IncrementorComponent title="Words per player" v-model="wordsPerPlayer"/>
        <FormItem class="w-full text-center" v-bind="errorInfo"> </FormItem>
      </ACard>
      <AButton @click="goToLobby" class="mt-4" type="primary">Start Game</AButton>
    </div>
</template>

