<script setup lang="ts">
import AvatarComponent from '@/components/AvatarComponent.vue';
import { GameServiceKey } from '@/core/constants/injectionKeys';
import { ColorsEnum } from '@/core/enums/colorsEnum';
import { RoutesEnum } from '@/core/enums/routesEnum';
import router from '@/plugins/router';
import { AvatarGroup, Button, Card, message, TypographyTitle } from 'ant-design-vue';
import { computed, inject } from 'vue';

const gameService = inject(GameServiceKey)!;
const player = gameService.getCurrentPlayer();

function startGame() {
    gameService.goToBeginGame();
}

function copyLink() {
    const url = router.resolve({
        name: RoutesEnum.HOME,
        query: { roomId: player.roomId },
    });
    console.log(`${window.location.origin}${url.href}`);
    navigator.clipboard.writeText(`${window.location.origin}${url.href}`);
    console.log("--- copy link ---");
    message.info('Link Copied Successfully');
}

function copyCode() {
    navigator.clipboard.writeText(player.roomId);
    console.log("--- copy code ---");
    message.info('Code Copied Successfully');
}

function joinTeam(teamId: string) {
    gameService.joinTeam(teamId);
    console.log("joinTeam - LobbyView");
}

const areAllPlayersJoined = computed(() => {
    return gameService.gameState.value.players.filter(p => !p.teamId).length === 0;
});

</script>

<template>
    <div class="grid p-4">
        <div class="row-span-2">
            <TypographyTitle class="text-center" :level=2> Lobby </TypographyTitle>
            <TypographyTitle @click="copyCode" class="text-center hover:cursor-pointer underline italic !m-0" :level=3>
                {{ player.roomId }} </TypographyTitle>
        </div>
        <div class="row-span-8 overflow-auto my-6 w-full flex gap-x-4 justify-center">
            <div class="overflow-auto">
                <Card size="small" title="Players">
                    <div v-auto-animate>
                        <template v-if="gameService.gameState.value.players.filter(p => !p.teamId).length">
                            <div v-auto-animate class="flex flex-col gap-y-4 justify-center items-center">
                                <div v-for="player in gameService.gameState.value.players.filter(p => !p.teamId)"
                                    :key="player.id">
                                    <AvatarComponent class="size-10" :avatar-icon="player.avatar"
                                        :color="ColorsEnum.GRAY" :tooltip="player.name" />
                                </div>
                            </div>
                        </template>
                        <div v-else>
                            <p class="text-center text-gray-500 text-lg"> ... </p>
                        </div>
                    </div>
                </Card>
            </div>
            <div class="w-4/6 max-w-md overflow-auto flex flex-col gap-y-2">
                <div class="w-full" v-for="team in gameService.gameState.value.teams" :key="team.id">
                    <Card class="h-36">
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
                            <Button v-if="player.teamId !== team.id" :danger="false" @click="joinTeam(team.id)">
                                Join </Button>
                            <Button v-else :danger="true"> Leave </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
        <div class="row-span-2 flex justify-center gap-x-8">
            <Button size="large" class="font-semibold" type="link" @click="copyLink"> Copy Link </Button>
            <Button :disabled="!areAllPlayersJoined" v-if="player.isHost" size="large" type="primary"
                @click="startGame">
                Start
                Game
            </Button>
        </div>
    </div>
</template>
