import Pusher from 'pusher-js';

const pusher = new Pusher('', {
    cluster: '',
});

const channel = pusher.subscribe('chat');

export { channel, pusher };