<script setup lang="ts">
import { Avatar, Button, Form, FormItem, Input } from 'ant-design-vue';
import { reactive, ref } from 'vue';

const name = ref('');

// const avatarName = computed(() => {
//     name.value.length > 56
//     return name.value;
// });

interface FormState {
    name: string;
}

const joinFormState = reactive<FormState>({
    name: '',
});

function onSumbit() {
    console.log("I am submitttingggg!!!!")
}

function onFail() {
    console.log("I am failinggggg!!!!")
}

</script>

<template>
    <div class="h-full">
        <div class="text-center m-4">
            <p class="font-semibold text-3xl"> Cardey-B Game </p>
        </div>
        <div class="flex flex-col h-5/6 bg-red-200 items-center justify-center m-4 p-4">
            <Form :model="joinFormState" @finish="onSumbit" @finish-failed="onFail">
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
                            <Button type="primary" html-type="submit"> Host Game </Button>
                        </FormItem>
                        <FormItem>
                            <Button type="dashed" html-type="submit"> Join Game </Button>
                        </FormItem>
                    </div>
                </div>
            </Form>
        </div>
    </div>
</template>
