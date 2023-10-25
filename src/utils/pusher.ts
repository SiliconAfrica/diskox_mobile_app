import Pusher from 'pusher-js/react-native';

const pusher = new Pusher('ap2', {
    cluster: 'ap2',
});

const channel = pusher.subscribe('chat');
const loginUser = pusher.subscribe('login-user');

export { channel, pusher };