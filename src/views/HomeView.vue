<script setup lang="ts">
import { Avatar, Form, FormItem, Input } from 'ant-design-vue';
import { reactive } from 'vue'
import router from '@/plugins/router'
import { RoutesEnum } from '@/core/enums/routesEnum'

interface FormState {
    name: string;
}

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
    .then(() =>{
      router.push({ name: RoutesEnum.CREATE_GAME });
    })
    .catch(() => {
      console.log("Validation failed")
    })
}

function handleJoinGameClick() {
    validate()
      .then(() =>{
        router.push({ name: RoutesEnum.JOIN_GAME });
      })
      .catch(() => {
        console.log("Validation failed")
      })
}

</script>

<template>
    <div class="h-full">
        <div class="text-center m-4">
            <p class="font-semibold text-3xl"> Cardey-B Game </p>
        </div>
        <div class="flex flex-col h-5/6 bg-red-200 items-center justify-center m-4 p-4">
            <Form :model="joinFormState">
                <div class="flex flex-col justify-center items-center">
                    <Avatar class="hover:cursor-pointer size-32">
                    </Avatar>
                    <div class="flex flex-row items-center justify-center m-4 gap-4">
                        <FormItem class="m-0" name="name"
                          :rules="[{ required: true, message: 'Please input your name' }]">
                            <Input placeholder="name" v-model:value="joinFormState.name" />
                        </FormItem>
                    </div>
                    <div class="flex items-center justify-center gap-4">
                        <FormItem>
                            <AButton @click="handleHostGameClick()" type="primary" html-type="submit"> Host Game </AButton>
                        </FormItem>
                        <FormItem>
                            <AButton @click="handleJoinGameClick()" type="dashed" html-type="submit"> Join Game </AButton>
                        </FormItem>
                    </div>
                </div>
            </Form>
        </div>
    </div>
</template>
