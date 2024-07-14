<script setup lang="ts">
import { Form, FormItem, Input } from 'ant-design-vue';
import { reactive, ref } from 'vue'
import router from '@/plugins/router'
import { RoutesEnum } from '@/core/enums/routesEnum'
import AvatarComponent from '@/components/AvatarComponent.vue'
import { ColorsEnum } from '@/core/enums/colorsEnum';
import { AvatarsEnum } from '@/core/enums/avatarsEnum';

interface FormState {
  name: string;
}

const avatarsList = Object.values(AvatarsEnum);
const currentAvatar = ref(avatarsList[0]);

const joinFormState = reactive<FormState>({
  name: '',
});

const rulesRef = reactive({
  name: [
    {
      required: true,
      message: 'Please input name',
    },
  ]
});

const { validate } = Form.useForm(joinFormState, rulesRef);

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
  const currentIndex = avatarsList.indexOf(currentAvatar.value);
  const nextIndex = (currentIndex + 1) % avatarsList.length;
  currentAvatar.value = avatarsList[nextIndex];
  console.log(currentAvatar.value)
}

</script>

<template>
  <div class="h-full">
    <div class="text-center p-4">
      <p class="font-semibold text-3xl"> Cardey-B Game </p>
    </div>
    <div class="flex flex-col h-5/6 items-center justify-center m-4 p-4">
      <Form :model="joinFormState">
        <div class="flex flex-col justify-center items-center">
          <AvatarComponent @click="changeAvatarIcon" class="size-32 hover:cursor-pointer" :color="ColorsEnum.GRAY"
            :avatar-icon="currentAvatar" />
          <div class="flex flex-row items-center justify-center m-4 gap-4">
            <FormItem class="m-0" name="name" :rules="[{ required: true, message: 'Please input your name' }]">
              <Input placeholder="name" v-model:value="joinFormState.name" />
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
