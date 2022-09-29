import { ObservableArray } from '@nativescript/core';
import { StompConfig, StompConnector, StompMessage } from '@nswitfy/stomp-connector';

import { DemoSharedBase } from '../utils';

export class DemoSharedStompConnector extends DemoSharedBase {
	private url = 'wss://dev-witfy.asuscomm.com:10443/broadcast/websocket';
	private stompClient: StompConnector;
	public connectionStatus: string = 'Not connected';
	public logs: ObservableArray<string>;

	public messageContent: string = '';
	public token: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI3YzYzYTA2MjI2MmJlYWE2OWNlMmFjYjI3MmM5NTBlNCIsInJvbGUiOiJBVFRFTkRBTlQiLCJpc3MiOiJXaXRmeS5pbyIsImFjY2VwdF90ZXJtcyI6ZmFsc2UsImVtYWlsX2NvbmZpcm1lZCI6dHJ1ZSwiZXhwIjoxNjcyMzA3NTc4LCJpYXQiOjE2NjQ0NDUxNzh9.AUDQ6uf4trcH4MZciYLcvwtkZbjv2QgWL4JZdcTt2AmgZxiSZZdp__I6BR0n6Q84bJiEm7tiH8_wuzSA-R6CvA';

	public isConnected = false;

	constructor() {
		super();
		this.stompClient = new StompConnector();
		this.logs = new ObservableArray<string>();
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
				console.log(`
				STATUS: ${this.connectionStatus}
				`);
				this.logs.unshift('CONNECTED');
				this.isConnected = true;
			},
			onStompError: (error) => {
				this.connectionStatus = 'ERROR';
				console.log(`
				STATUS: ${this.connectionStatus}
				`);
				this.logs.unshift('ERROR');
				this.logs.unshift(error);
			},
			onDisconnect: () => {
				this.connectionStatus = 'DISCONNECT';
				console.log(`
				STATUS: ${this.connectionStatus}
				`);
				this.isConnected = false;
				this.logs.unshift('DISCONNECT');
			},
			onFailedServerHeartBeat: (error: string) => {
				this.logs.unshift(`${error}`);
			},
			debug: (msg: string) => {
				this.logs.unshift(`${msg}`);
				console.log(`
				STATUS: ${this.connectionStatus}
				`);
			},
		} as StompConfig);
	}

	disconnect() {
		this.stompClient.disconnect();
	}

	subscribeToTopic() {
		this.stompClient.topic('/topic/broadcast', (response: StompMessage) => {
			console.log('------------------ SUBSCRIPTION RESPONSE -------------------');
			console.dir(response);
			this.logs.unshift(JSON.stringify(response.payload));
		});
	}

	unsubscribeToTopic() {
		this.stompClient.unsubscribe('/topic/broadcast', () => {
			console.log('Unsubscribed successfully');
		});
	}

	sendMessage() {
		this.stompClient.send({ message: this.messageContent, destination: '/app/greetings' }, () => {
			this.logs.unshift('Message just sent!');
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
				this.logs.unshift('Message just sent!');
			}
		);
	}

	connected() {
		this.logs.unshift('Is connected? ' + (this.stompClient.isConnected() ? 'YES' : 'NO'));
	}
}
