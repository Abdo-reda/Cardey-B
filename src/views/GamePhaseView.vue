<script setup lang="ts">
import { Avatar, Divider } from 'ant-design-vue';
import { ref } from 'vue';


const currentPhase = ref(1);
const description = ref('This is the description of the game phase');

</script>

<template>
    <div>
        <div class="flex flex-col justify-center items-center p-6">
            <p class="text-2xl font-bold">Game Phase {{ currentPhase }}</p>
            <p class="text-gray-600">{{ description }}</p>
        </div>
        <Divider />
        <div class="flex flex-col justify-center items-center text-center">
            <p class="text-xl font-semibold"> Game Order </p>
            <div class="flex flex-col">
                <div v-for="team in 3" :key=team class="my-4">
                    <p> Team {{ team }} </p>
                    <div class="flex flex-col">
                        <div class="flex flex-row justify-center items-center gap-x-2 my-1" v-for="member in 3"
                            :key=member>
                            <Avatar size="small"> </Avatar>
                            <p> Member {{ member }} </p>
                        </div>
                    </div>
                </div>
                <!-- Loop over teams -->
                <!-- Loop over members of teams -->
                <!-- Highlight selected/current turn of member -->
            </div>
        </div>
    </div>
</template>