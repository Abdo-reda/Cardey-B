<script setup lang="ts">
import { Form, FormItem, Button, type FormInstance, Input, Divider } from 'ant-design-vue';
import { reactive, ref } from 'vue';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';

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

const submitForm = () => {
    formRef.value!
        .validate()
        .then(() => {
            console.log('values', wordsFieldList.words);
        })
        .catch(error => {
            console.log('error', error);
        });
};

const resetForm = () => {
    formRef.value!.resetFields();
};

const removeDomain = (item: IWordField) => {
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

</script>

<template>

    <div class="flex flex-col justify-center items-center p-6">
        <p class="text-2xl font-semibold"> Input your words </p>
        <Divider />
        <Form ref="formRef" :model="wordsFieldList">
            <FormItem v-for="(word, index) in wordsFieldList.words" class="mb-10" :key="word.key"
                :name="['words', index, 'value']" :rules="{
                    required: true,
                    message: 'word cannot be empty',
                    trigger: 'change',
                }">
                <div class="flex items-center justify-center gap-x-4">
                    <Input v-model:value="word.value" placeholder="please input word" />
                    <MinusCircleOutlined @click="removeDomain(word)" />
                </div>
            </FormItem>
            <FormItem class="w-full flex justify-center mx-2">
                <Button :disabled="wordsFieldList.words.length >= maxNumberOfWords" class="flex items-center"
                    type="dashed" @click="addField">
                    <PlusOutlined /> Add Word
                </Button>
            </FormItem>
            <FormItem>
                <div class="flex gap-x-8 justify-center">
                    <Button @click="resetForm">Reset</Button>
                    <Button type="primary" html-type="submit" @click="submitForm">Submit</Button>
                </div>
            </FormItem>
        </Form>
    </div>
</template>