<script setup lang="ts">
import { CloseCircleTwoTone, CheckCircleTwoTone } from '@ant-design/icons-vue';
import { Avatar, Button } from 'ant-design-vue';
import { reactive, ref, watchEffect } from 'vue';


const activeTeam = ref(4);
const isReady = ref(false);


const members = reactive([
    {
        name: 'John',
        isReady: true
    },
    {
        name: 'Jane',
        isReady: false
    },
    {
        name: 'Jack',
        isReady: true
    },
    {
        name: 'Jill',
        isReady: false
    },
    {
        name: 'Jenny',
        isReady: true
    }
]);

const timer = ref(3);
const belongsToTeam = ref(true);
const showTimer = ref(false);

let timerInterval: NodeJS.Timeout | null = null;



watchEffect(() => {
    if (members.every(member => member.isReady)) {
        console.log('All members are ready');
        timerInterval = setInterval(() => {
            timer.value -= 1;
        }, 1000);
    } else {
        console.log('Not all members are ready');
        timer.value = 3;
        if (timerInterval) clearInterval(timerInterval);
    }

    if (timer.value === 0) {
        if (timerInterval) clearInterval(timerInterval);
    }
});




</script>

<template>
    <div class="flex flex-col justify-center items-center p-4 gap-y-4">
        <p class="font-semibold text-2xl my-2"> Team {{ activeTeam }} Ready?</p>
        <div v-for="member in members" :key="member.name" class="grid grid-cols-3 place-items-center gap-x-8">
            <Avatar size="large"> </Avatar>
            <p> {{ member.name }} </p>
            <CheckCircleTwoTone twoToneColor="#52c41a" v-if="member.isReady" />
            <CloseCircleTwoTone twoToneColor="#eb2f96" v-else />
        </div>
        <div v-if="belongsToTeam">
            <Button type="primary" @click="isReady = true"> Ready </Button>
        </div>
        <div v-if="showTimer" class="h-80 flex items-center">
            <p class="text-9xl font-extrabold text-gray-500"> {{ timer }} </p>
        </div>
    </div>
</template>