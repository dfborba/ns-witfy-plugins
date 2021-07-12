declare module io {
	export module reactivex {
		export module functions {
			export class Consumer<T> extends java.lang.Object {
				public static class: java.lang.Class<io.reactivex.functions.Consumer<any>>;
				public constructor(implementation: { accept(t: T): void });
				accept(t: T): void;
			}

			export class Action extends java.lang.Object {
				public static class: java.lang.Class<io.reactivex.functions.Action>;
				public constructor();
				public constructor(implementation: { run(): void });

				run(): void;
			}
		}

		export module android {
			export module schedulers {
				export class AndroidSchedulers extends java.lang.Object {
					public static class: java.lang.Class<io.reactivex.android.schedulers.AndroidSchedulers>;
					public constructor();
					public static mainThread(): io.reactivex.Scheduler;
				}
			}
		}

		export module schedulers {
			export class Schedulers extends java.lang.Object {
				public static class: java.lang.Class<io.reactivex.schedulers.Schedulers>;
				public constructor();
				public static io(): io.reactivex.Scheduler;
				public static newThread(): io.reactivex.Scheduler;
			}
		}

		export module disposables {
			export class CompositeDisposable extends java.lang.Object {
				public static class: java.lang.Class<io.reactivex.disposables.CompositeDisposable>;
				public add(disposable: io.reactivex.disposables.Disposable): boolean;
				public dispose(): void;
				public remove(disposable: io.reactivex.disposables.Disposable): void;
			}

			export class Disposable extends java.lang.Object {
				public static class: java.lang.Class<io.reactivex.disposables.Disposable>;
				public dispose(): void;
			}
		}

		export class Scheduler extends java.lang.Object {
			public static class: java.lang.Class<io.reactivex.Scheduler>;
		}

		export class Flowable<T> extends java.lang.Object {
			public static class: java.lang.Class<io.reactivex.Flowable<any>>;
			public subscribe(): io.reactivex.disposables.Disposable;
			public subscribe(onNext: io.reactivex.functions.Consumer<T>): io.reactivex.disposables.Disposable;
			public subscribe(onNext: io.reactivex.functions.Consumer<T>, onError: io.reactivex.functions.Consumer<T>): io.reactivex.disposables.Disposable;
			public subscribe(onNext: io.reactivex.functions.Consumer<T>, onError: io.reactivex.functions.Consumer<T>, onComplete: io.reactivex.functions.Action): io.reactivex.disposables.Disposable;
			public subscribeOn(scheduler: io.reactivex.Scheduler): io.reactivex.Flowable<T>;
			public unsubscribeOn(scheduler: io.reactivex.Scheduler): io.reactivex.Flowable<T>;
			public observeOn(scheduler: io.reactivex.Scheduler): io.reactivex.Flowable<T>;
			public doFinally(onFinally: io.reactivex.functions.Action): io.reactivex.Flowable<T>;
		}

		export class CompletableObserver extends java.lang.Object {
			public static class: java.lang.Class<io.reactivex.CompletableObserver>;
			public constructor(implementation: { onComplete(): void; onError(e: Throwable): void; onSubscribe(d: io.reactivex.disposables.Disposable): void });
			public onComplete(): void;
			public onError(e: Throwable): void;
			public onSubscribe(d: io.reactivex.disposables.Disposable): void;
		}

		export class CompletableSource extends java.lang.Object {
			public static class: java.lang.Class<io.reactivex.CompletableSource>;
			public constructor(implementation: { subscribe(co: io.reactivex.CompletableObserver): void });
			public subscribe(co: io.reactivex.CompletableObserver): void;
		}

		export class CompletableTransformer extends java.lang.Object {
			public static class: java.lang.Class<io.reactivex.CompletableTransformer>;
			public constructor(implementation: { apply(upstream: io.reactivex.Completable): io.reactivex.CompletableSource });
			public apply(upstream: io.reactivex.Completable): io.reactivex.CompletableSource;
		}

		export class Completable extends java.lang.Object {
			public static class: java.lang.Class<io.reactivex.Completable>;
			public subscribe(): io.reactivex.disposables.Disposable;
			public subscribe(onComplete: io.reactivex.functions.Action): io.reactivex.disposables.Disposable;
			public subscribe(onComplete: io.reactivex.functions.Action, onError: io.reactivex.functions.Consumer<any>): io.reactivex.disposables.Disposable;
			public onErrorComplete(): io.reactivex.Completable;
			public compose(transform: io.reactivex.CompletableTransformer): io.reactivex.Completable;
			public subscribeOn(scheduler: io.reactivex.Scheduler): io.reactivex.Completable;
			public unsubscribeOn(scheduler: io.reactivex.Scheduler): io.reactivex.Completable;
			public observeOn(scheduler: io.reactivex.Scheduler): io.reactivex.Completable;
		}
	}
}

declare module ua {
	export module naiksoftware {
		export module stomp {
			export class Stomp extends java.lang.Object {
				public static class: java.lang.Class<ua.naiksoftware.stomp.Stomp>;
				public constructor();
				public static ConnectionProvider: any;
				public static over(connectionProvider: any, uri: string): ua.naiksoftware.stomp.StompClient;
				public static over(connectionProvider: any, uri: string, connectHttpHeaders: AnalyserOptions): ua.naiksoftware.stomp.StompClient;
				public static over(connectionProvider: any, uri: string, connectHttpHeaders: any, okHttpClient: any): ua.naiksoftware.stomp.StompClient;
			}

			export class StompClient extends java.lang.Object {
				public static class: java.lang.Class<ua.naiksoftware.stomp.StompClient>;
				public constructor();
				public withServerHeartbeat(ms: number): ua.naiksoftware.stomp.StompClient;
				public withClientHeartbeat(ms: number): ua.naiksoftware.stomp.StompClient;
				public connect(): void;
				public connect(headers: java.util.List<ua.naiksoftware.stomp.dto.StompHeader>): void;
				public send(destination: string): io.reactivex.Completable;
				public send(destination: string, data: string): io.reactivex.Completable;
				public send(stompMessage: ua.naiksoftware.stomp.dto.StompMessage): io.reactivex.Completable;
				public sendHeartBeat(pingMessage: string): void;
				public lifecycle(): io.reactivex.Flowable<ua.naiksoftware.stomp.dto.LifecycleEvent>;
				public reconnect(): void;
				public disconnect(): void;
				public disconnectCompletable(): io.reactivex.Completable;
				public topic(destinationPath: string): io.reactivex.Flowable<ua.naiksoftware.stomp.dto.StompMessage>;
				public topic(destinationPath: string, stompHeaders: java.util.List<ua.naiksoftware.stomp.dto.StompHeader>): io.reactivex.Flowable<ua.naiksoftware.stomp.dto.StompMessage>;
				public isConnected(): boolean;
				public getTopicId(dest: string): any;
				public unsubscribePath(dest: string): io.reactivex.Completable;
			}

			export module dto {
				export class LifecycleEvent extends java.lang.Object {
					public static class: java.lang.Class<ua.naiksoftware.stomp.dto.LifecycleEvent>;
					public static Type: any;
					private mType: any;
					private mMessage: string;
					public constructor();
					public constructor(type: any);
					public constructor(type: any, exception: java.lang.Exception);
					public constructor(type: any, message: string);
					public getType(): any;
					public getException(): java.lang.Exception;
					public getMessage(): string;
				}

				export class StompHeader extends java.lang.Object {
					public static class: java.lang.Class<ua.naiksoftware.stomp.dto.StompHeader>;
					public constructor();
					public constructor(key: string, value: string);
					private mKey: string;
					private mValue: string;
				}

				export class StompMessage extends java.lang.Object {
					public static class: java.lang.Class<ua.naiksoftware.stomp.dto.StompMessage>;
					public constructor();
					public constructor(stompCommand: string, stompHeaders: java.util.List<ua.naiksoftware.stomp.dto.StompHeader>, payload: string);
					private mStompCommand: string;
					private mStompHeaders: java.util.List<ua.naiksoftware.stomp.dto.StompHeader>;
					private mPayload: string;
					public getStompCommand(): string;
					public getPayload(): string;
					public getStompHeaders(): java.util.List<ua.naiksoftware.stomp.dto.StompHeader>;
					public findHeader(key: string): string;
				}

				export enum StompCommand {
					CONNECT = 'CONNECT',
					CONNECTED = 'CONNECTED',
					SEND = 'SEND',
					MESSAGE = 'MESSAGE',
					SUBSCRIBE = 'SUBSCRIBE',
					UNSUBSCRIBE = 'UNSUBSCRIBE',
					UNKNOWN = 'UNKNOWN',
				}
			}
		}
	}
}
