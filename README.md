# cardey-b

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Notes

-   disable the start until all players have joined team.
-   player can only join, if the current screen/phase is Lobby [currentRoute]
-   I am host, I want to send message, to tell players go to next screen "X screen" (go to hell), I want to tell players go to (phase/screen/) "begin-game"
    -   New message RouteTo(RouteName)
    -   New reciever
-   Each player has two messages, AddAllWords, RemoveAllWords -- (playerId) maybe the words are stored as a dictionary? <id, words[]>
    -   we can check the number of keys in the dictionary to know when players are ready.
    -   Maybe add a view to know we are waiting for which player.
-   Keep track of game phase.
    -   we have 3 phases, each phase a description. (just a name)
    -   when we go to a new phase, we shuffle the words and start from the beggining.
    -   but we keep track which player/team had the turn.
-   Keep track of:
    -   skipped words.
    -   passed words.
    -   remaining words.
    -   current team, and current player.
-   Once there are no more remaining words, we go the next game phase.

### Enhancements

-   [ ] Make the webRTC more stable
-   [ ] Make the room code more friendly.
-   [ ] Add sounds / music / audio
-   [ ] Spectators? players not in a team.
