<script setup lang="ts">
import AvatarComponent from '@/components/AvatarComponent.vue';
import { GameServiceKey, HostServiceKey, PlayerServiceKey } from '@/core/constants/injectionKeys';
import { AvatarsEnum } from '@/core/enums/avatarsEnum';
import { ColorsEnum } from '@/core/enums/colorsEnum';
import { RoutesEnum } from '@/core/enums/routesEnum';
import router from '@/plugins/router';
import { AvatarGroup, Button, Card, message } from 'ant-design-vue';
import { inject } from 'vue';


const playerService = inject(PlayerServiceKey)!;
const gameService = inject(GameServiceKey)!;
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

function joinTeam(teamId: string) {
    gameService.joinTeam(teamId);
}

</script>

<template>
    <div class="flex flex-col justify-center items-center p-4">
        <p class="font-semibold text-center text-2xl"> Lobby - <span class="hover:cursor-pointer underline italic"
                @click="copyCode"> {{ hostService.roomId }} </span> </p>
        <div class="my-6 w-full flex gap-x-4 justify-center">
            <div class="h-full">
                <Card size="small" title="Players">
                    <div v-auto-animate>
                        <div v-auto-animate v-if="gameService.gameState.value.players.filter(p => !p.teamId).length"
                            class="flex flex-col gap-y-4 justify-center items-center">
                            <div v-for="player in gameService.gameState.value.players.filter(p => !p.teamId)"
                                :key="player.id">
                                <AvatarComponent class="size-10" :avatar-icon="player.avatar" :color="ColorsEnum.GRAY"
                                    :tooltip="player.name" />
                            </div>
                        </div>
                        <div v-else>
                            <p class="text-center text-gray-500 text-lg"> ... </p>
                        </div>
                    </div>
                </Card>
            </div>
            <div class="w-4/6 flex flex-col gap-y-2">
                <div class="w-full" v-for="team in gameService.gameState.value.teams" :key="team.id">
                    <Card>
                        <template #title>
                            <div> {{ `Team ${team.id}` }} </div>
                        </template>
                        <div class="flex justify-between items-center">
                            <AvatarGroup :max-count="3" size="large">
                                <template v-for="player in team.players" :key="player">
                                    <AvatarComponent :avatar-icon="gameService.getPlayer(player).avatar"
                                        :color="team.color" :tooltip="gameService.getPlayer(player).name">
                                        {{ gameService.getPlayer(player).name }}
                                    </AvatarComponent>
                                </template>
                            </AvatarGroup>
                            <Button v-if="playerService.player.teamId !== team.id" :danger="false"
                                @click="joinTeam(team.id)">
                                Join </Button>
                            <Button v-else :danger="true"> Leave </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
        <div class="flex gap-x-8">
            <Button size="large" type="link" @click="copyLink"> Copy Link </Button>
            <Button v-if="playerService.player.isHost" size="large" type="primary" @click="startGame"> Start Game
            </Button>
        </div>
    </div>
</template>
