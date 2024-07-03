<script setup lang="ts">
import { Form, FormItem, Button, type FormInstance, Input, Divider, AvatarGroup, Avatar } from 'ant-design-vue';
import { reactive, ref, watchEffect } from 'vue';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
import router from '@/plugins/router';
import { RoutesEnum } from '@/core/enums/routesEnum';

//will the game be a single view? and we memorize states? each state shows a different components/view, or different routes? routes are the states.

interface IWordField {
    value: string;
    key: number;
}

const formRef = ref<FormInstance>();
const wordsFieldList = reactive<{ words: IWordField[] }>({
    words: []
});
const maxNumberOfWords = 5;
const readyState = ref(false);

function readyUp() {
    formRef.value!
        .validate()
        .then(() => {
            console.log('values', wordsFieldList.words);
            readyState.value = true;
        })
        .catch(error => {
            console.log('error', error);
        });
};

function unready() {
    readyState.value = false;
}

function resetForm() {
    formRef.value!.resetFields();
};

function removeDomain(item: IWordField) {
    const index = wordsFieldList.words.indexOf(item);
    if (index !== -1) {
        wordsFieldList.words.splice(index, 1);
    }
};

function addField(): void {
    if (wordsFieldList.words.length >= maxNumberOfWords) return;

    wordsFieldList.words.push({
        value: '',
        key: Date.now(),
    });
};

// watchEffect(() => {
//     //if all players are ready, then switch to the next view
// });

function nextTemp() {
    console.log('next temp');
    router.push({ name: RoutesEnum.GAME_PHASE });
}

</script>

<template>

    <div class="flex flex-col justify-center items-center p-6">
        <p class="text-2xl font-semibold"> Input your words </p>
        <p class="text-lg font-medium my-2"> {{ readyState ? 'Ready!' : 'Not Ready' }} </p>
        <Divider />
        <Form ref="formRef" :model="wordsFieldList">
            <FormItem v-for="(word, index) in wordsFieldList.words" class="mb-10" :key="word.key"
                :name="['words', index, 'value']" :rules="{
                    required: true,
                    message: 'word cannot be empty',
                    trigger: 'change',
                }">
                <div class="flex items-center justify-center gap-x-4">
                    <Input :disabled="readyState" v-model:value="word.value" placeholder="please input word" />
                    <MinusCircleOutlined @click="removeDomain(word)" />
                </div>
            </FormItem>
            <FormItem class="w-full flex justify-center">
                <Button :disabled="wordsFieldList.words.length >= maxNumberOfWords || readyState"
                    class="flex items-center" type="dashed" @click="addField">
                    <PlusOutlined /> Add Word
                </Button>
            </FormItem>
            <FormItem>
                <div class="flex gap-x-8 justify-center">
                    <Button @click="resetForm">Reset</Button>
                    <Button v-if="!readyState" type="primary" html-type="submit" @click="readyUp">Ready up</Button>
                    <Button v-else type="dashed" html-type="submit" @click="unready">Edit</Button>
                </div>
            </FormItem>
        </Form>
        <Divider />
        <div>
            <p class="text-lg font-semibold my-4"> Waiting for players ... </p>
            <AvatarGroup :max-count="10">
                <Avatar v-for="player in 10" :key="player"> {{ player }}</Avatar>
            </AvatarGroup>
        </div>
        <Button type="primary" @click="nextTemp"> Next Temp </Button>
    </div>
</template>