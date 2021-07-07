:warning: **This plugin is on development and is use mainly for Witfy projects, will be improved as needed**

# nativescript-stomp-connector

**Client connector for Websocket through STOMP protocol.**

**PR are really welcome if you want to add or work on the checklist below**

This plugin use the [**NaikSoftware/StompProtocolAndroid**](https://github.com/NaikSoftware/StompProtocolAndroid) for Android and [**WrathChaos/StompClientLib**](https://github.com/WrathChaos/StompClientLib) for iOS.

## Installation

### Nativescript 7+

```javascript
tns plugin add @nswitfy/stomp-connector
```

### Nativescript 6+

```javascript
tns plugin add nativescript-stomp-connector
```

### #TODO

-   [ ] Migrate to Nativescript 7;
-   [ ] Add nativescript core demo;
-   [ ] Add repository for service example using spring boot to this README;
-   [ ] Add Troubleshooting to this README;
-   [ ] Improve API documentation;

# Usage

## Core

**Under construction**

## TypeScript

Import the **StompConnector** in your component

```typescript
import { StompConnector, StompMessage } from 'nativescript-stomp-connector';
```

### Call Connnect

```typescript
private _wsUrl = "ws://{your-server}:{port}/{path}/websocket";
public stompClient: StompConnector;

constructor(private _changeDetectorRef: ChangeDetectorRef) {
	this.stompClient = new StompConnector();
}

public connect(): void {
	this.stompClient.connect({
		brokerURL: this._wsUrl,
		onConnect: () => {
			console.log(`==== CONNECTED ===`);
		},
		onReconnect: () => {
			console.log(`==== RECONNECTED ===`);
		},
		onStompError: (error) => {
			console.error(error);
		},
		onDisconnect: () => {
			console.log(`==== DISCONNECTED ===`);
		},
		debug: (msg: string) => {
			console.log(msg);
		}
	} as StompConfig);
}
```

### Disconnect

```typescript
public disconnect(): void {
	this.stompClient.disconnect();
}
```

### Subscribe to topic

```typescript
public subscribeToTopic(): void {
	this.stompClient.topic('/topic/broadcast', (response: StompMessage) => { console.dir(response); });
}
```

### Unsubscribe to topic

```typescript
unsubscribeToTopic() {
	this.stompClient.unsubscribe('/topic/broadcast', () => console.log("Unsubscribed successfully"));
}
```

### Send message

```typescript
sendMessageAsObject() {
	this.stompClient.send({
		message: JSON.stringify({ content: this.messageContent }),
		destination: '/app/greetings',
		withHeaders: { "content-type": "application/json" }
	}, () => { console.log('Message just sent!'); });
}
```

## API

### StompConnector

**connect(config)**

This function will connect to your stomp broker and call the callback onConnect after finish it;

**disconnect()**

Disconnect the stomp broker;

**isConnected()**

Return true if broker is connected;

**topic(destination, successCallBack, failCallBack)**

Subscribe to topic passing destination and successCallBack as mandatory parameters.

**unsubscribe(destination, successCallback)**

Unsubscribe to topic by destination.

**send(request, successCallBack, failCallBack)**

Send messsage to stomp broker;

### StompConfiguration

| Property                | Default  | Description                                                              |
| ----------------------- | -------- | ------------------------------------------------------------------------ |
| brokerURL               | empty    | The websocket url. **Mandatory**                                         |
| autoReconnect           | false    | **Android only for now**                                                 |
| reconnectDelay          | 5000     | The delay between attempts to reconnect in ms                            |
| connectHeaders          | empty    | [key: string]: string; > example: { 'content-type': 'application/json' } |
| **onConnect()**         | Function | callback called on websocket connection successful                       |
| **onReconnect()**       | Function | callback called on server auto reconnected. **Android only for now**     |
| **onDisconnect()**      | Function | callback called on webscoket disconnect                                  |
| **onStompError(error)** | Function | called when got an exception                                             |
| **debug(msg)**          | Function | Use this to have more logs                                               |

## Native Component

| Android                                                                                       | iOS                                                                           |
| :-------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| [**NaikSoftware/StompProtocolAndroid**](https://github.com/NaikSoftware/StompProtocolAndroid) | [**WrathChaos/StompClientLib**](https://github.com/WrathChaos/StompClientLib) |

## Author

Daniel Borba, daniel@witfy.io

## License

Apache License Version 2.0, January 2004
