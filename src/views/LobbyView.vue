<script setup lang="ts">
import { GameServiceKey, HostServiceKey, PlayerServiceKey } from '@/core/constants/injectionKeys';
import { RoutesEnum } from '@/core/enums/routesEnum';
import router from '@/plugins/router';
import { Avatar, AvatarGroup, Button, Card, message } from 'ant-design-vue';
import { inject, ref } from 'vue';


const playerService = inject(PlayerServiceKey)!;
const gameService = inject(GameServiceKey)!;
const joinedTeamId = ref('');
const hostService = inject(HostServiceKey)!;

function startGame() {
    console.log("--- start game ---");
    router.push({ name: RoutesEnum.BEGIN_GAME });
}

function copyLink() {
    navigator.clipboard.writeText("Link copied");
    console.log("--- copy link ---");
    message.info('Linked Copied Successfully');
}

function copyCode() {
    navigator.clipboard.writeText(hostService.roomId.value);
    console.log("--- copy code ---");
    message.info('Code Copied Successfully');
}

</script>

<template>
    <div class="flex flex-col justify-center items-center p-4">
        <p class="font-semibold text-3xl"> Lobby - <span class="hover:cursor-pointer underline italic"
                @click="copyCode"> {{ hostService.roomId }} </span> </p>
        <div class="my-6">
            <div class="w-72 my-2" v-for="team in gameService.gameState.teams" :key="team.id">
                <Card :title="`Team ${team.id}`">
                    <div class="flex justify-between items-center">
                        <AvatarGroup :max-count="3" size="large">
                            <Avatar v-for="player in team.players" :key="player.id">
                                {{ player.name }}
                            </Avatar>
                        </AvatarGroup>
                        <Button v-if="joinedTeamId !== team.id" :danger="false" @click="joinedTeamId = team.id">
                            Join </Button>
                        <Button v-else :danger="true" @click="joinedTeamId = ''"> Leave </Button>
                    </div>
                </Card>
            </div>
        </div>
        <div class="flex gap-x-8">
            <Button size="large" type="link" @click="copyLink"> Copy Link </Button>
            <Button v-if="playerService.player.isHost" size="large" type="primary" @click="startGame"> Start Game
            </Button>
        </div>
    </div>
</template>
