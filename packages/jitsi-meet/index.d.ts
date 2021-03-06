import { EventData, Observable } from '@nativescript/core';

export declare interface JitsiMeetConferenceOptions {
	roomName: string;
	presentInRootVewController?: boolean;
	fullScreen?: boolean;
	audioMuted?: boolean;
	videoMuted?: boolean;
	audioOnly?: boolean;
	featureFlags?: {
		calendarEnabled?: boolean;
		callIntegration?: boolean;
		closeCaptionsEnabled?: boolean;
		chatEnabled?: boolean;
		inviteEnabled?: boolean;
		iosRecordingEnabled?: boolean;
		pipEnabled?: boolean;
		welcomePageEnabled?: boolean;
	};
	userInfo?: {
		displayName?: string;
		email?: string;
		avatar?: string;
	};
}

export declare class JitsiMeet extends Observable {
	constructor();
	constructor(serverName: string);
	public events: Array<{ eventNames: string; callback: (data: EventData) => void; thisArg?: any }>;
	public startMeeting(options: JitsiMeetConferenceOptions): void;
	public stopMeeting(): void;
}
