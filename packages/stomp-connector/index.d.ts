import { Observable } from '@nativescript/core';

export declare class StompHeaders {
	[key: string]: string;
}

export interface StompMessage {
	destination: string;
	payload: any;
}

export interface StompFailMessage {
	destination: string;
	error: any;
}

export declare class StompConfig {
	brokerURL: string;
	heartbeatIncoming?: number;
	heartbeatOutgoing?: number;
	connectHeaders?: StompHeaders;
	onConnect?: () => void;
	onDisconnect?: () => void;
	onStompError?: (error: any) => void;
	onFailedServerHeartBeat?: (error: any) => void;
	debug?: (msg: string) => void;
}

export declare class StompSendMessage {
	message: string;
	destination: string;
	withHeaders?: StompHeaders;
	withReceipt?: string;
}

export declare class StompConnector extends Observable {
	constructor();

	public connect(config: StompConfig): void;
	public disconnect(): void;
	public isConnected(): boolean;
	public topic(destination: string, callback: (payload: StompMessage) => void, fail?: (payload: StompFailMessage) => {}): void;
	public unsubscribe(destination: string, callback: () => void): void;
	public send(request: StompSendMessage, callback?: () => void, fail?: (payload: StompFailMessage) => {}): void;
}
