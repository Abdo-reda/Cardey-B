<script setup lang="ts">
import IncrementorComponent from '@/components/IncrementorComponent.vue'
import { ref } from 'vue'
import router from '@/plugins/router'
import { RoutesEnum } from '@/core/enums/routesEnum'
import { Button, Card, FormItem } from 'ant-design-vue';
import type { ValidateInfo } from 'ant-design-vue/es/form/useForm';
import { addDoc, collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@/core/services/firebaseService';

const numberOfPlayers = ref(5);
const numberOfTeams = ref(3);
const timePerRound = ref(60);
const wordsPerPlayer = ref(5);

const hostPeerConnections = ref<Record<string, RTCPeerConnection>>({});
const dataChannels = ref<Record<string, RTCDataChannel>>({});

const errorInfo = ref<ValidateInfo | undefined>();

async function goToLobby(): Promise<void> {
  if (numberOfPlayers.value < numberOfTeams.value) {
    errorInfo.value = getError('Number of players cannot be less than number of teams')
    return;
  }

  await createRoomNew();

  router.push({ name: RoutesEnum.LOBBY });
}

// async function createRoom(): Promise<string> {

//   let offerLink: string = '';
//   const offerCollection = collection(db, 'offers');


//   const servers = {
//     iceServers: [
//       {
//         urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'], // free stun server
//       },
//     ],
//     iceCandidatePoolSize: 10,
//   };

//   // global states
//   const pc = new RTCPeerConnection(servers);

//   const offerDescription = await pc.createOffer();

//   await pc.setLocalDescription(offerDescription);

//   const offerDoc = await addDoc(offerCollection, {
//     offer: {
//       type: offerDescription.type,
//       sdp: offerDescription.sdp,
//     },
//     players: {}
//   });

//   offerLink = offerDoc.id;

//   // onSnapshot(offerDoc, (snapshot) => {
//   //   const data = snapshot.data();
//   //   if (data?.answer && !pc.currentRemoteDescription) {
//   //     console.log('offer has been answered');
//   //     const answerDescription = new RTCSessionDescription(data.answer);
//   //     pc.setRemoteDescription(answerDescription);
//   //   }
//   // });

//   // Listen for new players

//   onSnapshot(offerDoc, (snapshot) => {
//     const data = snapshot.data();
//     if (data && data.players) {
//       Object.keys(data.players).forEach(async playerId => {
//         const playerData = data.players[playerId];

//         if (playerData.answer && !hostPeerConnections.value[playerId]) {
//           const playerPC = new RTCPeerConnection(servers);
//           hostPeerConnections.value[playerId] = playerPC;

//           // Set remote description for each player's answer
//           console.log('trying to set remoteDescription answer data: ', playerData.answer);
//           const answerDescription = new RTCSessionDescription(playerData.answer);
//           await playerPC.setRemoteDescription(answerDescription);

//           // Handle ICE candidate gathering for each player
//           playerPC.onicecandidate = (event) => {
//             console.log('on ice candidate invoked for new player pc: ', event.candidate?.toJSON())
//             if (event.candidate) {
//               addDoc(collection(offerDoc, 'iceCandidates'), {
//                 candidate: event.candidate.toJSON(),
//                 playerId: playerId,
//               });
//             }
//           };

//           sendPlayerJoinedMessageForAllPeers();

//           // Create a data channel for each player
//           const dataChannel = playerPC.createDataChannel(`gameData_${playerId}`);
//           dataChannel.onopen = () => {
//             console.log(`Data channel open with player ${playerId}`);
//           };
//           dataChannel.onmessage = (event) => {
//             console.log(`Received data from player ${playerId}:`, event.data);
//           };

//           dataChannels.value[playerId] = dataChannel;

//           // Handle incoming ICE candidates for each player
//           onSnapshot(collection(offerDoc, 'iceCandidates'), (snapshot) => {
//             snapshot.docChanges().forEach((change) => {
//               if (change.type === 'added' && change.doc.data().playerId === playerId) {
//                 const candidate = new RTCIceCandidate(change.doc.data().candidate);
//                 playerPC.addIceCandidate(candidate);
//               }
//             });
//           });

//           // Create an offer for each player and set the local description
//           const offer = await playerPC.createOffer();
//           await playerPC.setLocalDescription(offer);

//           // Update Firestore with the offer
//           await updateDoc(offerDoc, {
//             [`players.${playerId}.offer`]: {
//               type: offer.type,
//               sdp: offer.sdp,
//             },
//           });

//         }
//       });
//     }
//   });

//   pc.onicecandidate = (event) => {
//     console.log('on ice candidate invoked: ', event)
//     if (event.candidate) {
//       addDoc(collection(offerDoc, 'iceCandidates'), event.candidate.toJSON());
//     }
//   };

//   console.log('offer link created: ', offerLink);

//   return offerLink;
// }

async function createRoomNew() {
  const servers = {
    iceServers: [
      {
        urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'], // free stun server
      },
    ],
    iceCandidatePoolSize: 10,
  };

  const roomsCollection = collection(db, 'rooms');
  const roomDoc = await addDoc(roomsCollection, {})
  const joinRequests = collection(roomDoc, 'joinRequests');
  console.log('consoling joinRequests', joinRequests)
  // const offerCandidates = roomsCollection.collection('offerCandidates');
  // const answerCandidiates = roomsCollection.collection('answerCandidates');

  console.log('new room created id: ', roomDoc.id);

  onSnapshot(joinRequests, (snapshot) => {
    console.log('something changed in joinRequests changes: ', snapshot.docChanges())
    snapshot.docChanges().forEach(async (change) => {
      if (change.type === 'added') {
        console.log('room document has been changed ref =', change.doc.ref)
        const data = change.doc.ref;
        if (data) {
          console.log('join request has been added data: ', data);

          const joinRequestData = data;
          const joinRequestsCollection = collection(roomDoc, 'joinRequests')
          const jointRequestDoc = doc(joinRequestsCollection, joinRequestData.id);

          const offerCandidates = collection(jointRequestDoc, 'offerCandidates');
          const answerCandidates = collection(jointRequestDoc, 'answerCandidates');

          const pc = new RTCPeerConnection(servers);
          // Create a data channel for each player
          const dataChannel = pc.createDataChannel(`gameData_${joinRequestData.id}`);
          dataChannel.onopen = () => {
            console.log(`Data channel open with player ${joinRequestData.id}`);
            dataChannel.send('message from host: you joined the channel successfully')
          };
          dataChannel.onmessage = (event) => {
            console.log(`Received data from player ${joinRequestData.id}:`, event.data);
          };

          dataChannels.value[joinRequestData.id] = dataChannel;

          pc.onicecandidate = async event => {
            if (event.candidate)
              await addDoc(offerCandidates, event.candidate.toJSON());
          }

          // create offer
          const offerDescription = await pc.createOffer();
          await pc.setLocalDescription(new RTCSessionDescription(offerDescription));



          // config for offer
          const offer = {
            sdp: offerDescription.sdp,
            type: offerDescription.type
          }

          await updateDoc(jointRequestDoc, { offer })

          onSnapshot(jointRequestDoc, snapshot => {
            const data = snapshot.data();

            if (!pc.currentRemoteDescription && data?.answer) {
              const answerDescription = new RTCSessionDescription(data.answer);
              pc.setRemoteDescription(answerDescription);
            }

            // if answered add candidates to peer connection
            onSnapshot(answerCandidates, snapshot => {
              snapshot.docChanges().forEach(change => {

                if (change.type === 'added') {
                  const candidate = new RTCIceCandidate(change.doc.data());
                  pc.addIceCandidate(candidate);
                }
              })
            })
          })

          hostPeerConnections.value[joinRequestData.id] = pc;
          sendPlayerJoinedMessageForAllPeers();

        }
      }
    })
  });


}

function sendPlayerJoinedMessageForAllPeers() {
  Object.keys(dataChannels).forEach(playerId => {
    const dataChannel = dataChannels.value[playerId]

    dataChannel.send("New Player Joined!");
  })
}

function getError(msg: string): ValidateInfo {
  return {
    help: msg,
    validateStatus: "error",
    required: true
  };
}

</script>

<template>
  <div class="flex flex-col justify-center items-center p-6 text-center">
    <Card title="Configure settings for the game">
      <IncrementorComponent title="Number of players" v-model="numberOfPlayers" />
      <IncrementorComponent title="Number of teams" v-model="numberOfTeams" />
      <IncrementorComponent title="Time per round (seconds)" :max="300" :factor="10" v-model="timePerRound" />
      <IncrementorComponent title="Words per player" v-model="wordsPerPlayer" />
      <FormItem class="w-full text-center" v-bind="errorInfo"> </FormItem>
    </Card>
    <Button @click="goToLobby" class="mt-4" type="primary">Start Game</Button>
  </div>
</template>
