import { RoutesEnum } from '@/core/enums/routesEnum'
import GamePhaseView from '@/views/GamePhaseView.vue'
import BeginGameView from '@/views/BeginGameView.vue'
import CreateGameView from '@/views/CreateGameView.vue'
import HomeView from '@/views/HomeView.vue'
import JoinGameView from '@/views/JoinGameView.vue'
import LobbyView from '@/views/LobbyView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: RoutesEnum.HOME,
      component: HomeView
    },
    {
      path: '/create-game',
      name: RoutesEnum.CREATE_GAME,
      component: CreateGameView
    },
    {
      path: '/join-game',
      name: RoutesEnum.JOIN_GAME,
      component: JoinGameView
    },
    {
      path: '/lobby',
      name: RoutesEnum.LOBBY,
      component: LobbyView
    },
    {
      path: '/begin-game',
      name: RoutesEnum.BEGIN_GAME,
      component: BeginGameView
    },
    {
      path: '/game-phase',
      name: RoutesEnum.GAME_PHASE,
      component: GamePhaseView
    }
  ]
})

export default router
