// import {
//   Pusher,
//   PusherMember,
//   PusherChannel,
//   PusherEvent,
// } from '@pusher/pusher-websocket-react-native';

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

// try {
//   (async function() {
//     await pusher.init({
//       apiKey: PUSHER_APP_KEY,
//       cluster: pusherConfig.cluster,
//        authEndpoint: 'https://test404.diskox.com',
//       onConnectionStateChange: (current: string, prrevious: string) => {
//           console.log(`Currrent state ${current}`);
//           console.log(`previous state ${prrevious}`);
//       },
//       // onError,
//       // onEvent,
//       onSubscriptionSucceeded: (channelName, data) => {
//         console.log(`Channel name ${channelName}`);
//         console.log(`data ${data}`);
//       },
//       // onSubscriptionError,
//       // onDecryptionFailure,
//       // onMemberAdded,
//       // onMemberRemoved,
//       // onSubscriptionCount,
//     });
//   })()

//   await pusher.subscribe({ channelName: 'test.event' });
//   await pusher.connect();
// } catch (e) {
//   console.log(`ERROR: ${e}`);
// }




export default pusher;