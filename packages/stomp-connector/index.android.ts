import { Observable } from '@nativescript/core';
import { StompConfig, StompFailMessage, StompMessage, StompSendMessage } from './index';

export { StompMessage, StompFailMessage, StompConfig, StompSendMessage };

type LifecycleEvent = ua.naiksoftware.stomp.dto.LifecycleEvent;
type StompClient = ua.naiksoftware.stomp.StompClient;

export class StompConnector extends Observable {
	private _callbacks: {
		topics: [{ destination: string; callback: (payload: StompMessage) => void; fail?: (error: StompFailMessage) => void }?];
		messages: [{ destination: string; callback: () => void; fail?: (error: StompFailMessage) => void }?];
	};

	private _mStompClient: ua.naiksoftware.stomp.StompClient;
	private _compositeDisposable: io.reactivex.disposables.CompositeDisposable;
	private _topicCompositeDisposable: io.reactivex.disposables.CompositeDisposable;

	private _listOfTopicsDisposable: Array<{ destination: string; disposable: io.reactivex.disposables.Disposable }>;

	private _config: StompConfig;

	constructor() {
		super();
		this._callbacks = { topics: [], messages: [] };
		this._listOfTopicsDisposable = new Array<{ destination: string; disposable: io.reactivex.disposables.Disposable }>();
	}

	connect(config: StompConfig) {
		this._config = config;

		this.mStompClient = ua.naiksoftware.stomp.Stomp.over(ua.naiksoftware.stomp.Stomp.ConnectionProvider.OKHTTP, config.brokerURL);

		this._connectToStompClientLifecycle();
		this._callConnectWithHeader();
	}

	private _connectToStompClientLifecycle() {
		this._callDebug(`[STOMP_CONNECTOR_DEBUG] reconnect stomp client lifecycle!`);

		this.mStompClient.withClientHeartbeat(this._config.heartbeatIncoming ? this._config.heartbeatIncoming : 2000).withServerHeartbeat(this._config.heartbeatOutgoing ? this._config.heartbeatOutgoing : 2000);

		this._resetSubscriptions();
		this._resetTopicDisposables();

		const that = new WeakRef(this);

		this._compositeDisposable.add(
			this.mStompClient
				.lifecycle()
				.subscribeOn(io.reactivex.schedulers.Schedulers.io())
				.observeOn(io.reactivex.android.schedulers.AndroidSchedulers.mainThread())
				.subscribe(
					new io.reactivex.functions.Consumer<LifecycleEvent>({
						accept: (lifecycleEvent: LifecycleEvent) => {
							that.get()._callDebug(`[STOMP_CONNECTOR_DEBUG] LifecycleEvent: ${lifecycleEvent.getType()}`);
							switch (lifecycleEvent.getType()) {
								case ua.naiksoftware.stomp.dto.LifecycleEvent.Type.OPENED:
									that.get()._config.onConnect();
									break;
								case ua.naiksoftware.stomp.dto.LifecycleEvent.Type.ERROR:
									console.error(lifecycleEvent.getException().toString());
									that.get()._config.onStompError(lifecycleEvent.getException().toString());
									break;
								case ua.naiksoftware.stomp.dto.LifecycleEvent.Type.CLOSED:
									that.get()._config.onDisconnect();
									break;
								case ua.naiksoftware.stomp.dto.LifecycleEvent.Type.FAILED_SERVER_HEARTBEAT:
									that.get()._gotHeartBeatFail();
									that.get()._config.onFailedServerHeartBeat(lifecycleEvent.getMessage());
									break;
							}
						},
					}),
					new io.reactivex.functions.Consumer<any>({
						accept: function (throwable: any /*Throwable*/) {
							that.get()._callDebug(`[STOMP_CONNECTOR_DEBUG] connect error: ${JSON.stringify(throwable.getMessage())}`);
							that.get()._config.onStompError(JSON.stringify(throwable));
						},
					})
				)
		);
	}

	private _callConnectWithHeader() {
		const headers = new java.util.ArrayList<ua.naiksoftware.stomp.dto.StompHeader>();

		if (this._config.connectHeaders) {
			const keys = Object.keys(this._config.connectHeaders);
			keys.forEach((key) => {
				headers.add(new ua.naiksoftware.stomp.dto.StompHeader(key, this._config.connectHeaders[key]));
			});
		}

		this.mStompClient.connect(headers);
	}

	private _resetSubscriptions() {
		if (this._compositeDisposable) {
			this._compositeDisposable.dispose();
		}

		this._compositeDisposable = new io.reactivex.disposables.CompositeDisposable();
	}

	private _resetTopicDisposables() {
		if (this._topicCompositeDisposable) {
			this._topicCompositeDisposable.dispose();
		}

		this._topicCompositeDisposable = new io.reactivex.disposables.CompositeDisposable();

		this._callbacks = { topics: [], messages: [] };
		this._listOfTopicsDisposable = new Array<{ destination: string; disposable: io.reactivex.disposables.Disposable }>();
	}

	private _gotHeartBeatFail() {
		this._callDebug(`[STOMP_CONNECTOR_DEBUG] HEART beat failed!`);
	}

	public disconnect() {
		if (this.mStompClient) {
			this.mStompClient.disconnect();
			this.mStompClient = null;
		}
	}

	public isConnected(): boolean {
		if (this.mStompClient) {
			return this.mStompClient.isConnected();
		} else {
			return false;
		}
	}

	public topic(destination: string, callback: (payload: StompMessage) => void, fail?: (payload: StompFailMessage) => void): void {
		if (this.mStompClient) {
			if (!this._isAlreadySubscribedToTopic(destination)) {
				this._callDebug(`[STOMP_CONNECTOR_DEBUG] how callback list looks like? ${JSON.stringify(this._callbacks)}`);
				this._callbacks['topics'].push({
					destination: destination,
					callback: callback,
					fail: fail
						? fail
						: (error) => {
								console.error(error);
						  },
				});

				const that = new WeakRef(this);
				this._callDebug(`[STOMP_CONNECTOR_DEBUG] attempt to subscribe to topic: ${destination}`);

				const newTopicDisposable = this.mStompClient
					.topic(destination)
					.subscribeOn(io.reactivex.schedulers.Schedulers.io())
					.observeOn(io.reactivex.android.schedulers.AndroidSchedulers.mainThread())
					.doFinally(
						new io.reactivex.functions.Action({
							run: function () {
								that.get()._callDebug(`[STOMP_CONNECTOR_DEBUG] unsubscribePath from destination ${destination}`);
							},
						})
					)
					.subscribe(
						new io.reactivex.functions.Consumer({
							accept: function (topicMessage: ua.naiksoftware.stomp.dto.StompMessage) {
								console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> WARM THAT SHIT');
								that.get()._callDebug(`[STOMP_CONNECTOR_DEBUG] topic message received from destination: ${destination}`);
								that.get()._notify('topics', destination, JSON.parse(topicMessage.getPayload()));
							},
						}),
						new io.reactivex.functions.Consumer({
							accept: function (throwable: any /*Throwable*/) {
								that.get()._callDebug(`[STOMP_CONNECTOR_DEBUG] topic message error from destination: ${destination} | error: ${JSON.stringify(throwable)}`);
								that.get()._notify('topics', destination, null, JSON.stringify(throwable));
							},
						})
					);

				this._listOfTopicsDisposable.push({ destination: destination, disposable: newTopicDisposable });
				this._topicCompositeDisposable.add(newTopicDisposable);
			}
		}
	}

	private _isAlreadySubscribedToTopic(destination: string) {
		const foundIndex = this._callbacks['topics'].findIndex((topic) => topic.destination === destination);
		this._callDebug(`[STOMP_CONNECTOR_DEBUG] is topic already subscribed for | ${destination} |? ${foundIndex !== -1 ? 'YES' : 'NO'}`);
		return foundIndex !== -1;
	}

	public unsubscribe(destination: string, callback?: () => void) {
		const that = new WeakRef(this);
		that.get()._callDebug(`[STOMP_CONNECTOR_DEBUG] topicId? ${this.mStompClient.getTopicId(destination)}`);
		if (this.mStompClient && this.mStompClient.getTopicId(destination)) {
			that.get()._callDebug(`[STOMP_CONNECTOR_DEBUG] unsubscribePath call dispose from ${destination}`);
			this._removeTopicFromDisposable(destination, callback);
		} else {
			that.get()._callDebug(`[STOMP_CONNECTOR_DEBUG] unsubscribePath not possible because you never subscribe to ${destination}`);
			if (!!callback && typeof callback === 'function') {
				callback();
			}
		}
	}

	private _removeTopicFromDisposable(destination: string, callback?: () => void) {
		this._removeFromCallback('topics', destination);
		const index = this._listOfTopicsDisposable.findIndex((topic) => topic.destination === destination);

		if (index >= 0) {
			this._callDebug(`[STOMP_CONNECTOR_DEBUG] removed disposable from list`);
			const topicDisposableToDispose = this._listOfTopicsDisposable.splice(index, 1)[0];
			this._topicCompositeDisposable.remove(topicDisposableToDispose.disposable);

			topicDisposableToDispose.disposable.dispose();
			if (!!callback && typeof callback === 'function') {
				callback();
			}
		}
	}

	public send(request: StompSendMessage, callback?: () => void, fail?: (payload: StompFailMessage) => void) {
		const that = new WeakRef(this);
		if (this.mStompClient) {
			this._callDebug(`[STOMP_CONNECTOR_DEBUG] attempt to send message to destination: ${request.destination}`);

			const _stompSendMessage = this._buildStompSendMessageRequestObject(request);
			this._compositeDisposable.add(
				this.mStompClient
					.send(_stompSendMessage)
					.unsubscribeOn(io.reactivex.schedulers.Schedulers.newThread())
					.subscribeOn(io.reactivex.schedulers.Schedulers.io())
					.observeOn(io.reactivex.android.schedulers.AndroidSchedulers.mainThread())
					.subscribe(
						new io.reactivex.functions.Action({
							run: function () {
								that.get()._callDebug(`[STOMP_CONNECTOR_DEBUG] message sent`);
								if (!!callback && typeof callback === 'function') {
									callback();
								}
							},
						}),
						new io.reactivex.functions.Consumer({
							accept: function (throwable: any /*Throwable*/) {
								that.get()._callDebug(`[STOMP_CONNECTOR_DEBUG] message error: ${JSON.stringify(throwable)}`);
								if (!!fail && typeof fail === 'function') {
									fail(throwable);
								}
							},
						})
					)
			);
		}
	}

	private _buildStompSendMessageRequestObject(request: StompSendMessage) {
		const headers = new java.util.ArrayList<ua.naiksoftware.stomp.dto.StompHeader>();
		headers.add(new ua.naiksoftware.stomp.dto.StompHeader('destination', request.destination));

		if (request.withHeaders) {
			const keys = Object.keys(request.withHeaders);
			keys.forEach((key) => {
				headers.add(new ua.naiksoftware.stomp.dto.StompHeader(key, request.withHeaders[key]));
			});
		}

		return new ua.naiksoftware.stomp.dto.StompMessage(ua.naiksoftware.stomp.dto.StompCommand.SEND, headers, request.message);
	}

	set mStompClient(stompClient: StompClient) {
		this._mStompClient = stompClient;
	}

	get mStompClient() {
		return this._mStompClient;
	}

	private _callDebug(msg: string) {
		if (this._config.debug) {
			this._config.debug(msg);
		}
	}

	private _notify(type: string, destination: string, response?: any, error?: any): void {
		const _cb = this._callbacks[type];
		if (_cb.length > 0) {
			const callBackEvent = _cb.find((cbByType) => cbByType.destination === destination);
			this._callDebug(`[STOMP_CONNECTOR_DEBUG] callback object to call: ${JSON.stringify(callBackEvent)}`);
			if (error) {
				this._callDebug(`[STOMP_CONNECTOR_DEBUG] has fail function?: ${!!callBackEvent.fail}`);
				this._callDebug(`[STOMP_CONNECTOR_DEBUG] error: ${JSON.stringify(error)}`);
				if (callBackEvent.fail) {
					callBackEvent.fail({ destination: destination, error: error });
				}
			} else {
				this._callDebug(`[STOMP_CONNECTOR_DEBUG] success callback for response: ${JSON.stringify(response)}`);
				if (response) {
					callBackEvent.callback({ destination: destination, payload: response });
				} else {
					callBackEvent.callback();
				}
			}
		}
	}

	private _removeFromCallback(type: string, destination: string): void {
		this._callDebug(`[STOMP_CONNECTOR_DEBUG] removing ${type} with destination ${destination} from callback listener`);
		const topics = this._callbacks[type];
		if (topics && topics.length > 0) {
			const index = topics.findIndex((topic) => topic.destination === destination);
			if (index >= 0) {
				this._callDebug(`[STOMP_CONNECTOR_DEBUG] removed from position ${index}`);
				this._callbacks[type].splice(index, 1);
			}
		}
	}
}
