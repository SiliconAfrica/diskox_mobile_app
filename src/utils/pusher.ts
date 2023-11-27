// import {
//   Pusher,
//   PusherMember,
//   PusherChannel,
//   PusherEvent,
// } from '@pusher/pusher-websocket-react-native';
import Pusher from 'pusher-js/react-native';
import Echo from 'laravel-echo';
import { BASE_URL } from './httpService';

let pusher ;
// = Pusher.getInstance();



const PUSHER_APP_KEY='f5d4f2be017648807ffe';
const PUSHER_APP_ID='1120726';
const PUSHER_APP_SECRET='2207fb8dfdd934e3f761';

const pusherConfig = {
  appId: PUSHER_APP_ID,
  key: PUSHER_APP_KEY,
  secret: PUSHER_APP_SECRET,
  cluster: 'ap2',
  encrypted: true, // optional, depending on your requirements
};

Pusher.logToConsole = true;

let PusherrClient = new Pusher(PUSHER_APP_KEY, {
  cluster: pusherConfig.cluster,
  wsHost: BASE_URL,
  wsPort: 6001,
  enabledTransports: ['ws'],
  forceTLS: false,
});

let echo = new Echo({
  brroadcaster: 'pusher',
  client: PusherrClient,
})


export default echo;