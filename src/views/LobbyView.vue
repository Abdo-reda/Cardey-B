<script setup lang="ts">
import { RoutesEnum } from '@/core/enums/routesEnum';
import router from '@/plugins/router';
import { Avatar, AvatarGroup, Button, Divider, message } from 'ant-design-vue';
import { ref } from 'vue';


// const numberOfTeams = 8;

const teams = [
    {
        id: 1,
        members: [
            {
                id: 2,
                name: "blah"
            },
            {
                id: 2,
                name: "A"
            },
            {
                id: 2,
                name: "S"
            },
            {
                id: 2,
                name: "F"
            }
        ]
    },
    {
        id: 2,
        members: [
            {
                id: 2,
                name: "S"
            },
            {
                id: 2,
                name: "F"
            }
        ]
    },
    {
        id: 3,
        members: [
            {
                id: 2,
                name: "blah"
            },
            {
                id: 2,
                name: "A"
            },
        ]
    },
    {
        id: 4,
        members: [
            {
                id: 2,
                name: "blah"
            },
            {
                id: 2,
                name: "A"
            },
            {
                id: 2,
                name: "blah"
            },
            {
                id: 2,
                name: "A"
            },
            {
                id: 2,
                name: "blah"
            },
            {
                id: 2,
                name: "A"
            },
        ]
    }
]

const joinedTeam = ref(-1);

function startGame() {
    console.log("--- start game ---");
    router.push({ name: RoutesEnum.BEGIN_GAME });
}

function copyLink() {
    navigator.clipboard.writeText("Link copied");
    console.log("--- copy link ---");
    message.info('Linked Copied Successfully');
}


</script>

<template>
    <div class="flex flex-col justify-center items-center p-4">
        <p class="font-semibold text-3xl"> Lobby - [GameCODE] </p>
        <div class="my-6">
            <div v-for="team in teams" :key="team.id">
                <p class="text-lg text-center p-2"> Team {{ team.id }}</p>
                <div class="flex justify-between items-center gap-x-4">
                    <AvatarGroup :max-count="3" size="large">
                        <Avatar v-for="member in team.members" :key="member.id">
                            {{ member.name }}
                        </Avatar>
                    </AvatarGroup>
                    <Button v-if="joinedTeam !== team.id" :danger="false" @click="joinedTeam = team.id">
                        Join </Button>
                    <Button v-else :danger="true" @click="joinedTeam = -1"> Leave </Button>
                </div>
                <Divider class="my-8" />
            </div>
        </div>
        <div class="flex gap-x-8">
            <Button size="large" type="link" @click="copyLink"> Copy Link </Button>
            <Button size="large" type="primary" @click="startGame"> Start Game </Button>
        </div>
    </div>
</template>
