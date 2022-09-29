import { ObservableArray } from '@nativescript/core';
import { StompConfig, StompConnector, StompMessage } from '@nswitfy/stomp-connector';

import { DemoSharedBase } from '../utils';

export class DemoSharedStompConnector extends DemoSharedBase {
	private url = 'wss://{your-server-url}';
	private stompClient: StompConnector;
	public connectionStatus: string = 'Not connected';
	public logs: ObservableArray<{ log: string }>;

	public messageContent: string = '';
	public token: string = '';

	public isConnected = false;

	constructor() {
		super();
		this.stompClient = new StompConnector();
		this.logs = new ObservableArray<{ log: string }>();
	}

	connect() {
		this.connectionStatus = 'Trying to connect';
		console.log(`
		STATUS: ${this.connectionStatus}
		`);
		this.stompClient.connect({
			brokerURL: this.url,
			connectHeaders: {
				'X-Authorization': this.token,
			},
			onConnect: () => {
				this.connectionStatus = 'CONNECTED';
				this.logs.unshift({ log: 'CONNECTED' });
				this.isConnected = true;
			},
			onStompError: (error) => {
				this.connectionStatus = 'ERROR';
				this.logs.unshift({ log: 'ERROR' });
				this.logs.unshift({ log: error });
			},
			onDisconnect: () => {
				this.connectionStatus = 'DISCONNECT';
				this.isConnected = false;
				this.logs.unshift({ log: 'DISCONNECT' });
			},
			onFailedServerHeartBeat: (error: string) => {
				this.logs.unshift({ log: `${error}` });
			},
			debug: (msg: string) => {
				this.logs.unshift({ log: `${msg}` });
			},
		} as StompConfig);
	}

	disconnect() {
		this.stompClient.disconnect();
	}

	subscribeToTopic() {
		this.stompClient.topic(`/queue/messages/chat-id-cf20870b-f522-42d7-a400-078a42bd6d47`, (response: StompMessage) => {
			this.logs.unshift({ log: 'Message from subscription' });
		});
	}

	unsubscribeToTopic() {
		this.stompClient.unsubscribe('/queue/messages/chat-id-cf20870b-f522-42d7-a400-078a42bd6d47', () => {
			this.logs.unshift({ log:
				'Unsubscribed successfully [/queue/messages/chat-id-cf20870b-f522-42d7-a400-078a42bd6d47]' });
		});
	}

	sendMessage() {
		this.stompClient.send({ message: this.messageContent, destination: '/app/greetings' }, () => {
			this.logs.unshift({ log: 'Message just sent!' });
		});
	}

	sendMessageAsObject() {
		this.stompClient.send(
			{
				message: JSON.stringify({ content: this.messageContent }),
				destination: '/app/greetings',
				withHeaders: { 'content-type': 'application/json' },
			},
			() => {
				this.logs.unshift({ log: 'Message just sent!' });
			}
		);
	}

	connected() {
		this.logs.unshift({ log: 'Is connected? ' + (this.stompClient.isConnected() ? 'YES' : 'NO') });
	}
}
