<script setup lang="ts">
import { FirestoreConstants } from '@/core/constants/firestoreConstants';
import { RoutesEnum } from '@/core/enums/routesEnum';
import { cardeyBFireStore } from '@/core/services/firebaseService';
import router from '@/plugins/router';
import { Form, FormItem, Input } from 'ant-design-vue';
import { addDoc, collection, doc, DocumentReference, getDoc, onSnapshot, updateDoc, type DocumentData } from 'firebase/firestore';
import { reactive, ref } from 'vue';

//TODO: make the client peer listen to the offer candidates of the host, and add them to peer connection candidates

interface FormState {
  roomId: string;
}

const joinFormState = reactive<FormState>({
  roomId: '',
});

var offerId = '';
const rulesRef = reactive({
  roomId: [
    {
      required: true,
      message: 'Please input room Id',
    },
  ]
});

const { validate } = Form.useForm(joinFormState, rulesRef);

async function handleJoinGameClick() {
  validate()
    .then(async () => {
      await joinGameNew();
      router.push({ name: RoutesEnum.JOIN_GAME });
    })
    .catch((error) => {
      console.log("Validation failed error: ", error)
    })
}

async function joinGameNew() {
  const roomId = joinFormState.roomId;
  const joinRequestRef = await addJoinRequest(roomId);
  await listenForJoinRequestChanges(joinRequestRef);
}

async function addJoinRequest(roomId: string): Promise<DocumentReference<DocumentData, DocumentData>> {
  console.log('In add joinRequest function roomId: ', roomId);

  const roomsCollection = collection(cardeyBFireStore, 'rooms');
  const roomRef = doc(roomsCollection, roomId);
  console.log('fetching roomRef ', roomRef);

  const joinRequestsCollection = collection(roomRef, 'joinRequests');
  console.log('fetching joinRequests collection ', joinRequestsCollection);

  const joinRequestRef = await addDoc(joinRequestsCollection, {});

  return joinRequestRef;
}

async function listenForJoinRequestChanges(joinRequestRef: DocumentReference<DocumentData, DocumentData>) {

  return onSnapshot(joinRequestRef, async (doc) => {
    const joinRequestData = doc.data();

    if (joinRequestData?.offer.sdp.toString() != offerId) {
      console.log('Check for existing offerId passed');
      console.log(`remote offer: `, joinRequestData?.offer.sdp.toString())
      console.log(`local offer: `, offerId)

      offerId = joinRequestData?.offer.sdp.toString();

      if (doc.exists()) {
        const joinRequest = doc.data();
        const answerCandidates = collection(doc.ref, 'answerCandidates');

        console.log('Join Request Data:', joinRequest);
        if (joinRequest?.offer) {
          console.log('Offer has been set:', joinRequest.offer);
          // Handle the presence of an answer, e.g., update the UI or perform some action
          console.log('------- server configuration', FirestoreConstants.serversConfiguration);
          const pc = new RTCPeerConnection(FirestoreConstants.serversConfiguration);

          // here we listen to the changes and add it to the answerCandidates
          pc.onicecandidate = async event => {
            if (event.candidate) {
              await addDoc(answerCandidates, event.candidate.toJSON());
            }
          }

          //handle dataChannel events
          pc.ondatachannel = (event) => {
            const dataChannel = event.channel;

            dataChannel.onopen = () => {
              console.log('Data channel open');
              dataChannel.send('new player joined')
            };

            dataChannel.onmessage = (event) => {
              console.log('Received data:', event.data);
            };
          };

          // setting the remote data with offerDescription
          const offerDescription = joinRequest.offer;
          await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

          // setting the local data as the answer
          const answerDescription = await pc.createAnswer();
          await pc.setLocalDescription(new RTCSessionDescription(answerDescription));
          // answer config
          const answer = {
            type: answerDescription.type,
            sdp: answerDescription.sdp
          }

          await updateDoc(doc.ref, { answer })
        }
      } else {
        console.log('No such document!');
      }
    } else {
      console.log('check for existing offer id failed (offer already handled)');
    }

  }, (error) => {
    console.error('Error listening to join request changes:', error);
  });

}

</script>

<template>
  <div class="flex flex-col h-5/6 items-center justify-center m-4 p-4">
    <Form :model="joinFormState">
      <div class="flex flex-col justify-center items-center">
        <div class="flex flex-row items-center justify-center m-4 gap-4">
          <FormItem class="m-0" name="roomId" :rules="[{ required: true, message: 'Please input room id' }]">
            <Input placeholder="roomId" v-model:value="joinFormState.roomId" />
          </FormItem>
        </div>
        <div class="flex items-center justify-center gap-4">
          <FormItem>
            <AButton @click="handleJoinGameClick" type="dashed" html-type="submit"> Join Game </AButton>
          </FormItem>
        </div>
      </div>
    </Form>
  </div>
</template>
