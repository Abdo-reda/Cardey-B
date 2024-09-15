<script setup lang="ts">
import AvatarComponent from '@/components/AvatarComponent.vue';
import useGameState from '@/core/composables/useGameState';
import usePlayer from '@/core/composables/usePlayer';
import { GameServiceKey } from '@/core/constants/injectionKeys';
import { ColorsEnum } from '@/core/enums/colorsEnum';
import { RoutesEnum } from '@/core/enums/routesEnum';
import router from '@/plugins/router';
import { CopyOutlined, ShareAltOutlined } from '@ant-design/icons-vue';
import { AvatarGroup, Button, Card, message, TypographyTitle } from 'ant-design-vue';
import { inject } from 'vue';

const gameService = inject(GameServiceKey)!;
const { currentPlayer } = usePlayer();
const { playersNotInATeam, teams, getPlayer } = useGameState();

function startGame() {
    gameService.goToBeginGame();
}

function randomiseTeams() {
    gameService.randomiseTeams();
}

function copyLink() {
    const roomUrl = getRoomUrl();
    navigator.clipboard.writeText(roomUrl);
    console.log("--- copy link ---");
    message.info('Link Copied Successfully');
}

async function shareLink() {
    const roomUrl = getRoomUrl();
    try {
        await navigator.share({
            title: "Cardy-B",
            text: "Cardy-B Room Url, join for a game!",
            url: roomUrl,
        })
        message.info("Shared succesffully")
    } catch (error) {
        console.log("-- could not share");
        console.log(error);
        message.error("Could not share, did you grant permissions?");
    }
}

function copyCode() {
    navigator.clipboard.writeText(currentPlayer.roomId);
    console.log("--- copy code ---");
    message.info('Code Copied Successfully');
}

function joinTeam(teamId: string) {
    gameService.joinTeam(teamId);
    console.log("joinTeam - LobbyView");
}

function getRoomUrl(): string {
    const url = router.resolve({
        name: RoutesEnum.HOME,
        query: { roomId: currentPlayer.roomId },
    });
    const roomUrl = `${window.location.origin}${url.href}`
    console.log('--- room url', roomUrl);
    return roomUrl;
}



</script>
<style scoped>
.current-player /deep/ .ant-avatar {
  border: 2px solid aqua !important;
}
</style>
<template>
    <div class="grid p-4">
        <div class="row-span-2">
            <TypographyTitle class="text-center" :level=2> Lobby </TypographyTitle>
            <TypographyTitle @click="copyCode" class="text-center hover:cursor-pointer underline italic !m-0" :level=3>
              {{ currentPlayer.roomId }}
            </TypographyTitle>
        </div>
        <div class="row-span-8 overflow-auto my-6 w-full flex gap-x-4 justify-center">
            <div class="overflow-auto">
                <Card size="small" title="Players">
                    <div v-auto-animate>
                        <template v-if="!!playersNotInATeam.length">
                            <div v-auto-animate class="flex flex-col gap-y-4 justify-center items-center">
                                <div v-for="player in playersNotInATeam" :key="player.id">
                                    <AvatarComponent class="size-10" :avatar-icon="player.avatar"
                                        :color="ColorsEnum.GRAY" :tooltip="player.name" />
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <p class="text-center text-gray-500 text-lg"> ... </p>
                        </template>
                    </div>
                </Card>
            </div>
            <div class="w-4/6 max-w-md overflow-auto flex flex-col gap-y-2">
                <div class="w-full" v-for="team in teams" :key="team.id">
                    <Card class="h-36">
                        <template #title>
                            <div> {{ `Team ${team.id}` }} </div>
                        </template>
                        <div class="flex justify-between items-center ">
                            <AvatarGroup :max-count="2" size="large">
                                <template v-for="player in team.players" :key="player">
                                  <div v-bind:class="{'current-player' : player == currentPlayer.id}">
                                    <AvatarComponent
                                      :class="''"
                                      :avatar-icon="getPlayer(player).avatar"
                                      :color="team.color"
                                      :tooltip="getPlayer(player).name">
                                      {{ getPlayer(player).name }}
                                    </AvatarComponent>
                                  </div>
                                </template>
                            </AvatarGroup>
                            <Button v-if="currentPlayer.teamId !== team.id" :danger="false" @click="joinTeam(team.id)">
                                Join </Button>
                            <Button v-else :danger="true"> Leave </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
        <div class="row-span-2 flex flex-col gap-4 ">
            <div class="flex justify-center gap-x-8">
                <Button size="large" class="font-semibold" type="link" @click="shareLink">
                    <ShareAltOutlined /> Share Link
                </Button>
                <Button size="large" class="font-semibold" type="link" @click="copyLink">
                    <CopyOutlined /> Copy Link
                </Button>
            </div>
            <div class="flex justify-center gap-4">
              <Button v-if="currentPlayer.isHost" size="large" type="primary"
                      @click="randomiseTeams">
                Randomise teams
              </Button>
                <Button :disabled="!!playersNotInATeam.length" v-if="currentPlayer.isHost" size="large" type="primary"
                        @click="startGame">
                    Start
                    Game
                </Button>
            </div>
        </div>
    </div>
</template>
