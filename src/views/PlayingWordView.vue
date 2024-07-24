<script setup lang="ts">
import { Button } from 'ant-design-vue';
import { ref } from 'vue';

const timer = ref(60);
const activeWord = ref('apple');
const remainingWords = ref(10);

function skipWord() {
    remainingWords.value -= 1;
    console.log('---- skipping word')
}

function passWord() {
    remainingWords.value -= 1;
    console.log('---- passing word')
}

</script>

<template>
    <div class="h-full">
        <div>
            <p> Words Remaining {{ remainingWords }}</p>
        </div>
        <div class="flex flex-col gap-y-4 justify-center items-center p-4 h-full">
            <p class="text-2xl font-medium text-gray-600"> {{ timer }} </p>
            <p class="text-3xl font-semibold"> {{ activeWord }}</p>
            <div class="flex flex-row jusitfy-center items-center gap-x-14 my-8">
                <Button size="large" type="dashed" :danger="true" @click="skipWord">Skip</Button>
                <Button size="large" type="primary" @click="passWord">Pass</Button>
            </div>
        </div>
    </div>
</template>