import { Observable } from '@nativescript/core';
import { StompConfig, StompFailMessage, StompHeaders, StompMessage, StompSendMessage } from './index';

export { StompHeaders, StompMessage, StompFailMessage, StompConfig, StompSendMessage };

class MyStompClientLibDelegateImpl extends NSObject implements StompClientLibDelegate {
	public static ObjCProtocols = [StompClientLibDelegate];
	private _owner: WeakRef<any>;

	public static initWithOwner(owner: WeakRef<any>): MyStompClientLibDelegateImpl {
		let delegate = this.new();
		delegate._owner = owner;
		return delegate;
	}

	static new(): MyStompClientLibDelegateImpl {
		return <MyStompClientLibDelegateImpl>super.new();
	}

	stompClientWithClientDidReceiveMessageWithJSONBodyAkaStringBodyWithHeaderWithDestination(client: StompClientLib, jsonBody: string, stringBody: string, headers: any, destination: string): void {
		if (!!this._owner) {
			this._owner.get()._callDebug(`stompClientDidReceiveMessageWithJSONBodyWithJSONBodyAkaStringBodyWithHeaderWithDestination: ${jsonBody} | ${stringBody} | ${headers} | ${destination}`);
			this._owner.get()._notify('topics', destination, stringBody);
		}
	}

	stompClientDidConnectWithClient(client: StompClientLib): void {
		if (!!this._owner) {
			this._owner.get().connected = true;
			this._owner.get()._callDebug(`stompClientDidConnectWithClient`);
			this._owner.get()._config.onConnect();
		}
	}

	stompClientDidDisconnectWithClient(client: StompClientLib): void {
		if (!!this._owner) {
			this._owner.get().connected = false;
			this._owner.get()._callDebug(`stompClientDidDisconnectWithClient`);
			this._owner.get()._config.onDisconnect();
		}
	}

	serverDidSendReceiptWithClientWithReceiptId(client: StompClientLib, receiptId: string): void {
		if (!!this._owner) {
			this._owner.get()._callDebug(`serverDidSendReceiptWithClientWithReceiptId | ${receiptId}`);
		}
	}

	serverDidSendErrorWithClientWithErrorMessageDetailedErrorMessage(client: StompClientLib, description: string, message: string): void {
		if (!!this._owner) {
			this._owner.get()._callDebug(`serverDidSendErrorWithClientWithErrorMessageDetailedErrorMessage: ${description} | ${message} `);
			this._owner.get().connected = false;

			this._owner.get()._config.onStompError(description + message);
		}
	}

	serverDidSendPing(): void {
		if (!!this._owner) {
			this._owner.get()._callDebug(`serverDidSendPing`);
		}
	}
}

export class StompConnector extends Observable {
	private _callbacks: {
		topics: [{ destination: string; callback: (payload: StompMessage) => void; fail?: (error: StompFailMessage) => void }?];
		messages: [{ destination: string; callback: () => void; fail?: (error: StompFailMessage) => void }?];
	};

	private _mStompClient: any;
	private _iosDelegate: MyStompClientLibDelegateImpl;

	private _config: StompConfig;
	private _isConnected = false;

	constructor() {
		super();
		this._callbacks = { topics: [], messages: [] };
		this._iosDelegate = MyStompClientLibDelegateImpl.initWithOwner(new WeakRef(this));
	}

	public connect(config: StompConfig): void {
		if (!!this.mStompClient) {
			this.disconnect();
		}

		this._config = config;
		this.mStompClient = StompClientLib.new();

		this._callConnectWithHeader();
	}

	private _callConnectWithHeader() {
		let header: NSDictionary<any, any>;
		if (!!this._config.connectHeaders) {
			header = this._buildHeader(this._config.connectHeaders);
		}

		this.mStompClient.reconnectWithRequestDelegateConnectionHeadersTimeExponentialBackoff(NSURLRequest.requestWithURL(NSURL.URLWithString(this._config.brokerURL)), this._iosDelegate, header, 5000, true);
	}

	set connected(newStatus: boolean) {
		this._isConnected = newStatus;
	}

	public isConnected(): boolean {
		return this._isConnected;
	}

	private _buildHeader(connectHeaders: StompHeaders) {
		let keys = Object.keys(connectHeaders);
		let values = [];
		keys.forEach((key) => {
			values.push(connectHeaders[key]);
		});

		return new NSDictionary({ objects: values, forKeys: keys });
	}

	public disconnect(): void {
		this._callbacks = { topics: [], messages: [] };
		this.mStompClient.disconnect();
		this.mStompClient = null;
	}

	public topic(destination: string, callback: (payload: StompMessage) => void, fail?: (payload: StompFailMessage) => void) {
		this._callDebug(`[STOMP_CONNECTOR_DEBUG] attempt to subscribe to topic: ${destination}`);

		if (!!this.mStompClient) {
			if (!this._isAlreadySubscribedToTopic(destination)) {
				this._callbacks['topics'].push({
					destination: destination,
					callback: callback,
					fail: !!fail
						? fail
						: (error) => {
								console.error(error);
						  },
				});

				this.mStompClient.subscribeWithDestination(destination);
			} else if (!!fail) {
				fail({ destination: destination, error: 'Already subscribed to topic for destination' });
			}
		} else if (!!fail && typeof fail === 'function') {
			fail({ destination: destination, error: 'Client is NULL' });
		}
	}

	private _isAlreadySubscribedToTopic(destination: string) {
		const foundIndex = this._callbacks['topics'].findIndex((topic) => topic.destination === destination);
		this._callDebug(`[STOMP_CONNECTOR_DEBUG] is topic already subscribed for ${destination}? ${foundIndex !== -1 ? 'YES' : 'NO'}`);
		return foundIndex !== -1;
	}

	public unsubscribe(destination: string, callback?: () => void) {
		const that = new WeakRef(this);
		if (!!this.mStompClient) {
			this._removeFromCallback('topics', destination);
			this.mStompClient.unsubscribeWithDestination(destination);
		} else {
			that.get()._callDebug(`[STOMP_CONNECTOR_DEBUG] unsubscribePath not possible because stomp client is null to destination: ${destination}`);
		}
	}

	public send(request: StompSendMessage, callback?: () => void, fail?: (payload: StompFailMessage) => {}) {
		this._callDebug(`[STOMP_CONNECTOR_DEBUG] attempt to send message to destination: ${request.destination}`);
		if (!!this.mStompClient) {
			let header: NSDictionary<any, any>;
			if (!!request.withHeaders) {
				header = this._buildHeader(request.withHeaders);
			}

			this.mStompClient.sendMessageWithMessageToDestinationWithHeadersWithReceipt(request.message, request.destination, header, request.withReceipt);
		} else if (!!fail && typeof fail === 'function') {
			fail({ destination: request.destination, error: 'Unable to send message because client is null' });
		}
	}

	set mStompClient(stompClient: StompClientLib) {
		this._mStompClient = stompClient;
	}

	get mStompClient() {
		return this._mStompClient;
	}

	private _callDebug(msg: string) {
		if (!!this._config.debug) {
			this._config.debug(msg);
		}
	}

	private _notify(type: string, destination: string, response?: any, error?: any): void {
		var _cb = this._callbacks[type];
		if (_cb.length > 0) {
			const callBackEvent = _cb.find((cbByType) => cbByType.destination === destination);
			if (!!error) {
				callBackEvent.error({ destination: destination, error: error });
			} else {
				if (!!response) {
					callBackEvent.callback({ destination: destination, payload: response });
				} else {
					callBackEvent.callback();
				}
			}
		}
	}

	private _removeFromCallback(type: string, destination: string): void {
		var events = this._callbacks[type];
		if (events.length > 0) {
			const index = events.findIndex((topic) => topic.destination === destination);
			if (index >= 0) {
				this._callbacks[type].splice(index, 1);
			}
		}
	}
}
