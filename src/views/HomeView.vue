<script setup lang="ts">
import { Form, FormItem, Input } from 'ant-design-vue';
import { inject, reactive, ref } from 'vue'
import router from '@/plugins/router'
import { RoutesEnum } from '@/core/enums/routesEnum'
import AvatarComponent from '@/components/AvatarComponent.vue'
import { ColorsEnum } from '@/core/enums/colorsEnum';
import { AvatarsEnum } from '@/core/enums/avatarsEnum';
import { PlayerServiceKey } from '@/core/constants/injectionKeys';


const playerService = inject(PlayerServiceKey)!;
const avatarsList = Object.values(AvatarsEnum);

const rulesRef = reactive({
  name: [
    {
      required: true,
      message: 'Please input name',
    },
  ]
});

const { validate } = Form.useForm(playerService.player, rulesRef);

function handleHostGameClick() {
  validate()
    .then(() => {
      router.push({ name: RoutesEnum.CREATE_GAME });
    })
    .catch(() => {
      console.log("Validation failed")
    })
}

function handleJoinGameClick() {
  validate()
    .then(() => {
      router.push({ name: RoutesEnum.JOIN_GAME });
    })
    .catch(() => {
      console.log("Validation failed")
    })
}

function changeAvatarIcon() {
  console.log("Avatar Icon Changed")
  const currentIndex = avatarsList.indexOf(playerService.player.avatar);
  const nextIndex = (currentIndex + 1) % avatarsList.length;
  playerService.player.avatar = avatarsList[nextIndex];
}

</script>

<template>
  <div class="h-full">
    <div class="text-center p-4">
      <p class="font-semibold text-3xl"> Cardey-B Game </p>
    </div>
    <div class="flex flex-col h-5/6 items-center justify-center m-4 p-4">
      <Form :model="playerService.player">
        <div class="flex flex-col justify-center items-center">
          <AvatarComponent @click="changeAvatarIcon" class="size-32 hover:cursor-pointer" :color="ColorsEnum.GRAY"
            :avatar-icon="playerService.player.avatar" />
          <div class="flex flex-row items-center justify-center m-4 gap-4">
            <FormItem class="m-0" name="name" :rules="[{ required: true, message: 'Please input your name' }]">
              <Input placeholder="name" v-model:value="playerService.player.name" />
            </FormItem>
          </div>
          <div class="flex items-center justify-center gap-4">
            <FormItem>
              <AButton @click="handleJoinGameClick()" type="dashed" html-type="submit"> Join Game </AButton>
            </FormItem>
            <FormItem>
              <AButton @click="handleHostGameClick()" type="primary" html-type="submit"> Host Game </AButton>
            </FormItem>
          </div>
        </div>
      </Form>
    </div>
  </div>
</template>
