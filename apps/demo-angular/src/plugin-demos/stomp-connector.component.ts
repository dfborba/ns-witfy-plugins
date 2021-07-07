import { ChangeDetectorRef, Component } from '@angular/core';
import { ObservableArray } from '@nativescript/core';
import { StompConfig, StompConnector, StompMessage } from '@nswitfy/stomp-connector';

@Component({
	selector: 'demo-stomp-connector',
	templateUrl: 'stomp-connector.component.html',
})
export class StompConnectorComponent {
	private url = 'ws://10.0.0.2:4242/greetings/websocket';
	private stompClient: StompConnector;
	public connectionStatus: string = 'Not connected';
	public logs: ObservableArray<string>;

	public messageContent: string = '';
	public token: string = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0ZSIsImV4cCI6MTYyNTYzNzgxNCwiaWF0IjoxNjI1NjE5ODE0fQ.8bX_cmBT4gHTPhF7zYycSocr0cWLg0wDetfwJkf1RBJBrJKrn21k3n9_rKYUEUAvs7MqfrDK4CmvAAo6kP48_Q';

	public isConnected = false;

	constructor(private _changeDetectorRef: ChangeDetectorRef) {
		this.stompClient = new StompConnector();
		this.logs = new ObservableArray<string>();
	}

	ngOnInit(): void {
		this.connect();
	}

	connect() {
		this.connectionStatus = 'Trying to connect';
		this.stompClient.connect({
			brokerURL: this.url,
			connectHeaders: {
				'X-Authorization': this.token,
			},
			onConnect: () => {
				this.connectionStatus = 'CONNECTED';
				this.logs.unshift('CONNECTED');
				this.isConnected = true;
				if (!this._changeDetectorRef['destroyed']) {
					this._changeDetectorRef.detectChanges();
				}
			},
			onStompError: (error) => {
				this.connectionStatus = 'ERROR';
				this.logs.unshift('ERROR');
				this.logs.unshift(error);
			},
			onDisconnect: () => {
				this.connectionStatus = 'DISCONNECT';
				this.isConnected = false;
				if (!this._changeDetectorRef['destroyed']) {
					this._changeDetectorRef.detectChanges();
				}
				this.logs.unshift('DISCONNECT');
			},
			onFailedServerHeartBeat: (error: string) => {
				this.logs.unshift(`${error}`);
			},
			debug: (msg: string) => {
				this.logs.unshift(`${msg}`);
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
			this._changeDetectorRef.detectChanges();
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
