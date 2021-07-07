import { ChangeDetectorRef, Component } from '@angular/core';
import { EventData, Switch } from '@nativescript/core';
import { JitsiMeetConferenceOptions, JitsiMeet } from '@nswitfy/jitsi-meet';

@Component({
	selector: 'demo-jitsi-meet',
	templateUrl: 'jitsi-meet.component.html',
})
export class JitsiMeetComponent {
	public message: string;
	private _roomName: string = '';
	private _serverName: string = '';
	private _jitsiCaller: JitsiMeet;
	public jitsiOptions: JitsiMeetConferenceOptions;
	public jitsiEventLog: string;

	constructor(private _changeDetectionRef: ChangeDetectorRef) {
		this.jitsiEventLog = '> Log initialized \n\n';

		this.jitsiOptions = {
			roomName: '',
			audioMuted: false,
			videoMuted: false,
			audioOnly: false,
			featureFlags: {
				closeCaptionsEnabled: false,
				calendarEnabled: false,
				callIntegration: false,
				chatEnabled: false,
				inviteEnabled: false,
				iosRecordingEnabled: false,
				pipEnabled: false,
				welcomePageEnabled: false,
			},
			userInfo: {
				displayName: 'Daniel Borba',
			},
		};

		this._jitsiCaller = new JitsiMeet(this._serverName);
	}

	ngOnInit(): void {
		// Init your component properties here.
	}

	public roomNameChange(args) {
		const textField = args.object;
		this._roomName = textField.text;
	}

	public serverNameChange(args) {
		const textField = args.object;
		this._serverName = textField.text;
	}

	public startMeet() {
		this._jitsiCaller.on('conferenceWillJoin', (args: EventData) => {
			this.jitsiEventLog += '>> *conferenceWillJoin* ';
		});

		this._jitsiCaller.on('conferenceJoined', (args: EventData) => {
			this.jitsiEventLog += '>> *conferenceJoined* ';
		});

		this._jitsiCaller.on('conferenceTerminated', (args: EventData) => {
			this.jitsiEventLog += '>> *conferenceTerminated* ';
		});

		this._jitsiCaller.on('enterPictureInPicture', (args: EventData) => {
			this.jitsiEventLog += '>> *enterPictureInPicture* ';
		});

		if (!!this._roomName) {
			this.jitsiOptions.roomName = this._roomName;
		} else {
			this.jitsiOptions.roomName = this._createUUID();
		}

		this._jitsiCaller.startMeeting(this.jitsiOptions);
	}

	public audioMuted(args: EventData) {
		let sw = args.object as Switch;
		this.jitsiOptions.audioMuted = sw.checked;
	}

	public videoMuted(args: EventData) {
		let sw = args.object as Switch;
		this.jitsiOptions.videoMuted = sw.checked;
	}

	public audioOnly(args: EventData) {
		let sw = args.object as Switch;
		this.jitsiOptions.audioOnly = sw.checked;
	}

	public inviteEnabled(args: EventData) {
		let sw = args.object as Switch;
		this.jitsiOptions.featureFlags.inviteEnabled = sw.checked;
	}

	public closeCaptionsEnabled(args: EventData) {
		let sw = args.object as Switch;
		this.jitsiOptions.featureFlags.closeCaptionsEnabled = sw.checked;
	}

	public calendarEnabled(args: EventData) {
		let sw = args.object as Switch;
		this.jitsiOptions.featureFlags.calendarEnabled = sw.checked;
	}

	public callIntegration(args: EventData) {
		let sw = args.object as Switch;
		this.jitsiOptions.featureFlags.callIntegration = sw.checked;
	}

	public chatEnabled(args: EventData) {
		let sw = args.object as Switch;
		this.jitsiOptions.featureFlags.chatEnabled = sw.checked;
	}

	public iosRecordingEnabled(args: EventData) {
		let sw = args.object as Switch;
		this.jitsiOptions.featureFlags.iosRecordingEnabled = sw.checked;
	}

	public pipEnabled(args: EventData) {
		let sw = args.object as Switch;
		this.jitsiOptions.featureFlags.pipEnabled = sw.checked;
	}

	public welcomePageEnabled(args: EventData) {
		let sw = args.object as Switch;
		this.jitsiOptions.featureFlags.welcomePageEnabled = sw.checked;
	}

	public showUserInfo(args: EventData) {
		let sw = args.object as Switch;
		if (sw.checked) {
			this.jitsiOptions.userInfo = {
				displayName: 'Person Who?',
				email: 'personwho@what.really',
				avatar: 'http://www.sfu.ca/~cqt/IAT352/a4/img/avatars/test-user.png',
			};
		} else {
			this.jitsiOptions.userInfo = undefined;
		}
	}

	private _createUUID() {
		var dt = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = (dt + Math.random() * 16) % 16 | 0;
			dt = Math.floor(dt / 16);
			return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
		});

		return uuid;
	}
}
