<script setup lang="ts">
import { Avatar, AvatarGroup, Divider } from 'ant-design-vue';


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

</script>

<template>
    <div class="flex flex-col justify-center items-center m-4">
        <p class="font-semibold text-3xl"> Lobby </p>
        <div class="m-4" v-for="team in teams" :key="team.id">
            <p class="text-lg"> Team {{ team.id }}</p>
            <AvatarGroup :max-count="3" size="large">
                <Avatar v-for="member in team.members" :key="member.id"> 
                    
                </Avatar>
            </AvatarGroup>
            <Divider/> 
        </div>
    </div>
</template>

