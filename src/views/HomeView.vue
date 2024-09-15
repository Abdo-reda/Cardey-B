<script setup lang="ts">
import { Button, Form, FormItem, Input, message } from 'ant-design-vue';
import { inject, reactive, ref, watch } from 'vue'
import router from '@/plugins/router'
import { RoutesEnum } from '@/core/enums/routesEnum'
import AvatarComponent from '@/components/AvatarComponent.vue'
import { ColorsEnum } from '@/core/enums/colorsEnum';
import { GameServiceKey } from '@/core/constants/injectionKeys';
import usePlayer from '@/core/composables/usePlayer';
import { AvatarsList } from '@/core/enums/avatarsEnum';

const roomId = ref(router.currentRoute.value.query.roomId as string);
const { currentPlayer } = usePlayer();
const gameService = inject(GameServiceKey)!;
const showRoomId = ref(false);
const isJoining = ref(false);
const loadingJoin = ref(false);

const rulesRef = reactive({
  name: [
    {
      required: true,
      message: 'Please input name',
    },
  ],
  roomId: [
    {
      required: isJoining,
      message: 'Please input room id',
    },
  ],
});

const { validate } = Form.useForm(currentPlayer, rulesRef);

function handleHostGameClick() {
  currentPlayer.isHost = true;
  showRoomId.value = false;
  isJoining.value = false;
  validate()
    .then(() => {
      router.push({ name: RoutesEnum.CREATE_GAME });
    })
    .catch(() => {
      console.log("Validation failed")
    })
}

async function handleJoinGameClick() {
  currentPlayer.isHost = false;
  if (showRoomId.value) isJoining.value = true;

  try {
    await validate();
    showRoomId.value = true;
    if (isJoining.value) {
      loadingJoin.value = true;
      await gameService.joinGameAsync();
      // loadingJoin.value = false;
      // The host will route the player if he joined .... 
      // router.push({ name: RoutesEnum.LOBBY }); 
    }
  } catch (error) {
    loadingJoin.value = false;
    if (error instanceof Error) {
      message.error(error.message);
    }
    console.log("Validation failed", error)
  }

}

function changeAvatarIcon(): void {
  console.log("Avatar Icon Changed")
  const currentIndex = AvatarsList.indexOf(currentPlayer.avatar);
  const nextIndex = (currentIndex + 1) % AvatarsList.length;
  currentPlayer.avatar = AvatarsList[nextIndex];
}

watch(
  () => roomId,
  () => {
    if (roomId.value) {
      showRoomId.value = true;
      isJoining.value = true;
      currentPlayer.roomId = roomId.value!;
    }
  },
  { immediate: true }
);


</script>

<template>
  <div class="h-full">
    <div class="text-center p-4">
      <p class="font-origami text-6xl text-white font-stroke-gray-400 font-stroke title"> Cardy-B Game </p>
    </div>
    <div class="flex flex-col items-center justify-center m-4 p-4">
      <Form :model="currentPlayer">
        <div class="flex flex-col justify-center items-center">
          <AvatarComponent @click="changeAvatarIcon" class="size-32 hover:cursor-pointer" :color="ColorsEnum.GRAY"
            :avatar-icon="currentPlayer.avatar" />
          <div v-auto-animate class="flex flex-col items-center justify-center m-4 gap-4">
            <FormItem class="m-0 flex" name="name" :rules="[{ required: true, message: 'Please input your name' }]">
              <Input placeholder="name" v-model:value="currentPlayer.name" />
            </FormItem>
            <FormItem v-if="showRoomId" class="m-0" name="roomId"
              :rules="[{ required: isJoining, message: 'Please input room id' }]">
              <Input :disabled="!!roomId" placeholder="roomId" v-model:value="currentPlayer.roomId" />
            </FormItem>
          </div>
          <div class="flex items-center justify-center gap-4">
            <FormItem>
              <Button :loading="loadingJoin" @click="handleJoinGameClick()" type="dashed" html-type="submit"> Join Game
              </Button>
            </FormItem>
            <FormItem v-if="!roomId">
              <Button @click="handleHostGameClick()" type="primary" html-type="submit"> Host Game </Button>
            </FormItem>
          </div>
        </div>
      </Form>
    </div>
  </div>
</template>