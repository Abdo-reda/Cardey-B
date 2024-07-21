<script setup lang="ts">
import { Button, Form, FormItem, Input } from 'ant-design-vue';
import { inject, reactive, ref, watch } from 'vue'
import router from '@/plugins/router'
import { RoutesEnum } from '@/core/enums/routesEnum'
import AvatarComponent from '@/components/AvatarComponent.vue'
import { ColorsEnum } from '@/core/enums/colorsEnum';
import { AvatarsEnum } from '@/core/enums/avatarsEnum';
import { ClientServiceKey, PlayerServiceKey } from '@/core/constants/injectionKeys';

const props = defineProps<{ roomId?: string; }>();
const playerService = inject(PlayerServiceKey)!;
const clientService = inject(ClientServiceKey)!;
const avatarsList = Object.values(AvatarsEnum);
const showRoomId = ref(false);
const isJoining = ref(false);
const loadingJoin = ref(false);

playerService.player.avatar = avatarsList[Math.floor(Math.random() * avatarsList.length)];

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

const { validate } = Form.useForm(playerService.player, rulesRef);

function handleHostGameClick() {
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

  if (showRoomId.value) isJoining.value = true;

  validate()
    .then(async () => {
      showRoomId.value = true;
      if (isJoining.value) {
        loadingJoin.value = true;
        await clientService.joinRoomAsync(playerService.player.roomId);
        loadingJoin.value = false;
        // router.push({ name: RoutesEnum.JOIN_GAME });
      }
    })
    .catch(() => {
      console.log("Validation failed")
    })
}

function changeAvatarIcon(): void {
  console.log("Avatar Icon Changed")
  const currentIndex = avatarsList.indexOf(playerService.player.avatar);
  const nextIndex = (currentIndex + 1) % avatarsList.length;
  playerService.player.avatar = avatarsList[nextIndex];
}

watch(
  () => props.roomId,
  () => {
    if (props.roomId) {
      showRoomId.value = true;
      isJoining.value = true;
      playerService.player.roomId = props.roomId!;
    }
  },
  { immediate: true }
);


</script>

<template>
  <div class="h-full">
    <div class="text-center p-4">
      <p class="font-origami text-6xl text-white drop-shadow-md title"> Cardy-B Game </p>
    </div>
    <div class="flex flex-col items-center justify-center m-4 p-4">
      <Form :model="playerService.player">
        <div class="flex flex-col justify-center items-center">
          <AvatarComponent @click="changeAvatarIcon" class="size-32 hover:cursor-pointer" :color="ColorsEnum.GRAY"
            :avatar-icon="playerService.player.avatar" />
          <div v-auto-animate class="flex flex-col items-center justify-center m-4 gap-4">
            <FormItem class="m-0 flex" name="name" :rules="[{ required: true, message: 'Please input your name' }]">
              <Input placeholder="name" v-model:value="playerService.player.name" />
            </FormItem>
            <FormItem v-if="showRoomId" class="m-0" name="roomId"
              :rules="[{ required: isJoining, message: 'Please input room id' }]">
              <Input :disabled="!!roomId" placeholder="roomId" v-model:value="playerService.player.roomId" />
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

<style>
.title {
  -webkit-text-stroke: 0.5px gray;
}
</style>