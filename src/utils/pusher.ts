import {Pusher} from '@pusher/pusher-websocket-react-native';

const pusher = Pusher.getInstance();

pusher.init({
    apiKey: 'f5d4f2be017648807ffe',
    cluster: 'ap2',
});

const pusherInstance = async () => await pusher.connect();

export default pusher;