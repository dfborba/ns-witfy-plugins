declare class StompClientLib extends NSObject implements SRWebSocketDelegate {
	static alloc(): StompClientLib; // inherited from NSObject

	static new(): StompClientLib; // inherited from NSObject

	certificateCheckEnabled: boolean;

	connection: boolean;

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly; // inherited from NSObjectProtocol

	abortWithTransactionId(transactionId: string): void;

	ackWithMessageId(messageId: string): void;

	ackWithMessageIdWithSubscription(messageId: string, subscription: string): void;

	autoDisconnectWithTime(time: number): void;

	beginWithTransactionId(transactionId: string): void;

	class(): typeof NSObject;

	commitWithTransactionId(transactionId: string): void;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	disconnect(): void;

	isConnected(): boolean;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	openSocketWithURLRequestWithRequestDelegateConnectionHeaders(request: NSURLRequest, delegate: StompClientLibDelegate, connectionHeaders: NSDictionary<string, string>): void;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	reconnectWithRequestDelegateConnectionHeadersTimeExponentialBackoff(request: NSURLRequest, delegate: StompClientLibDelegate, connectionHeaders: NSDictionary<string, string>, time: number, exponentialBackoff: boolean): void;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;

	sendJSONForDictWithDictToDestination(dict: any, destination: string): void;

	sendMessageWithMessageToDestinationWithHeadersWithReceipt(message: string, destination: string, headers: NSDictionary<string, string>, receipt: string): void;

	subscribeWithDestination(destination: string): void;

	subscribeWithHeaderWithDestinationWithHeader(destination: string, header: NSDictionary<string, string>): void;

	unsubscribeWithDestination(destination: string): void;

	webSocketDidCloseWithCodeReasonWasClean(webSocket: SRWebSocket, code: number, reason: string, wasClean: boolean): void;

	webSocketDidFailWithError(webSocket: SRWebSocket, error: NSError): void;

	webSocketDidOpen(webSocket: SRWebSocket): void;

	webSocketDidReceiveMessage(webSocket: SRWebSocket, message: any): void;

	webSocketDidReceivePong(webSocket: SRWebSocket, pongPayload: NSData): void;

	webSocketShouldConvertTextFrameToString(webSocket: SRWebSocket): boolean;
}

interface StompClientLibDelegate {
	serverDidSendErrorWithClientWithErrorMessageDetailedErrorMessage(client: StompClientLib, description: string, message: string): void;

	serverDidSendPing(): void;

	serverDidSendReceiptWithClientWithReceiptId(client: StompClientLib, receiptId: string): void;

	stompClientDidConnectWithClient(client: StompClientLib): void;

	stompClientDidDisconnectWithClient(client: StompClientLib): void;

	stompClientWithClientDidReceiveMessageWithJSONBodyAkaStringBodyWithHeaderWithDestination(client: StompClientLib, jsonBody: any, stringBody: string, header: NSDictionary<string, string>, destination: string): void;
}
declare var StompClientLibDelegate: {
	prototype: StompClientLibDelegate;
};

declare var StompClientLibVersionNumber: number;

declare var StompClientLibVersionString: interop.Reference<number>;
