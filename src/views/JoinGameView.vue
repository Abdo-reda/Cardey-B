<script setup lang="ts">
import { ClientServiceKey } from '@/core/constants/injectionKeys';
import { RoutesEnum } from '@/core/enums/routesEnum';
import router from '@/plugins/router';
import { Form, FormItem, Input } from 'ant-design-vue';
import { inject, reactive } from 'vue';

//TODO: make the client peer listen to the offer candidates of the host, and add them to peer connection candidates

interface FormState {
  roomId: string;
}

const joinFormState = reactive<FormState>({
  roomId: '',
});

const clientService = inject(ClientServiceKey)!;

const rulesRef = reactive({
  roomId: [
    {
      required: true,
      message: 'Please input room Id',
    },
  ]
});

const { validate } = Form.useForm(joinFormState, rulesRef);

async function handleJoinGameClick() {
  validate()
    .then(async () => {
      await clientService.createJoinRequestAsync(joinFormState.roomId);
      router.push({ name: RoutesEnum.JOIN_GAME });
    })
    .catch((error) => {
      console.log("Validation failed error: ", error)
    })
}


</script>

<template>
  <div class="flex flex-col h-5/6 items-center justify-center m-4 p-4">
    <Form :model="joinFormState">
      <div class="flex flex-col justify-center items-center">
        <div class="flex flex-row items-center justify-center m-4 gap-4">
          <FormItem class="m-0" name="roomId" :rules="[{ required: true, message: 'Please input room id' }]">
            <Input placeholder="roomId" v-model:value="joinFormState.roomId" />
          </FormItem>
        </div>
        <div class="flex items-center justify-center gap-4">
          <FormItem>
            <AButton @click="handleJoinGameClick" type="dashed" html-type="submit"> Join Game </AButton>
          </FormItem>
        </div>
      </div>
    </Form>
  </div>
</template>
