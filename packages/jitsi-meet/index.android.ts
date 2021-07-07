import { Application, EventData, Observable } from '@nativescript/core';
import { JitsiMeetConferenceOptions } from './index';

export { JitsiMeetConferenceOptions };

export class JitsiMeet extends Observable {
	public events: Array<{ eventNames: string; callback: (data: EventData) => void; thisArg?: any }>;
	public serverURL: string = '';
	private _jitsiView: io.witfy.jitsiconnector.JitsiConnectorActivity;

	constructor(serverURL?: string) {
		super();
		this.events = new Array<{ eventNames: string; callback: (data: EventData) => void; thisArg?: any }>();
		this.serverURL = !!serverURL ? serverURL : 'https://meet.jit.si';
	}

	public startMeeting(options: JitsiMeetConferenceOptions) {
		const context = Application.android.context;
		this._jitsiView = new io.witfy.jitsiconnector.JitsiConnectorActivity();

		const configuration = this._buildObjectOptions(options);

		if (configuration) {
			this._jitsiView.startVideo(context, options.roomName, configuration);
		}
	}

	private _buildObjectOptions(options: JitsiMeetConferenceOptions): io.witfy.jitsiconnector.config.JitsiConnectorConfiguration {
		let configuration: io.witfy.jitsiconnector.config.JitsiConnectorConfiguration;
		let featureFlagsMap = new io.witfy.jitsiconnector.config.JitsiConnectorFeatureFlagConfiguration();

		if (!!options) {
			if (!!options.featureFlags) {
				featureFlagsMap.setCalendarEnabled(!!options.featureFlags.calendarEnabled ? options.featureFlags.calendarEnabled : false);
				featureFlagsMap.setCallIntegrationEnabled(!!options.featureFlags.callIntegration ? options.featureFlags.callIntegration : false);

				featureFlagsMap.setChatEnabled(!!options.featureFlags.chatEnabled ? options.featureFlags.chatEnabled : false);

				featureFlagsMap.setInviteEnabled(!!options.featureFlags.inviteEnabled ? options.featureFlags.inviteEnabled : false);

				featureFlagsMap.setCloseCaptionsEnabled(!!options.featureFlags.closeCaptionsEnabled ? options.featureFlags.closeCaptionsEnabled : false);

				featureFlagsMap.setIosRecordingEnabled(!!options.featureFlags.iosRecordingEnabled ? options.featureFlags.iosRecordingEnabled : false);

				featureFlagsMap.setPipEnabled(options.featureFlags.pipEnabled ? options.featureFlags.pipEnabled : false);
			}
		} else {
			featureFlagsMap.setCalendarEnabled(true);
			featureFlagsMap.setCallIntegrationEnabled(true);
			featureFlagsMap.setChatEnabled(true);
			featureFlagsMap.setInviteEnabled(true);
			featureFlagsMap.setIosRecordingEnabled(false);
			featureFlagsMap.setPipEnabled(false);
		}

		configuration = new io.witfy.jitsiconnector.config.JitsiConnectorConfiguration();
		configuration.setAudioMuted(options.audioMuted);
		configuration.setAudioOnly(options.audioOnly);
		configuration.setVideoMuted(options.videoMuted);
		configuration.setFeatureFlags(featureFlagsMap);

		return configuration;
	}

	on(eventNames: string, callback: (data: EventData) => void, thisArg?: any) {
		if (eventNames === 'conferenceWillJoin' || eventNames === 'conferenceJoined' || eventNames === 'conferenceTerminated') {
			const event = this.events.find((eventListener) => eventListener.eventNames === eventNames);
			if (!event) {
				this.events.push({ eventNames: eventNames, callback: callback });
			} else {
				this.off(eventNames);
				this.events.splice(this.events.indexOf(event), 1, { eventNames: eventNames, callback: callback });
			}

			console.log('=============================  add event');
		}
	}

	addEventListener(eventNames: string, callback: (data: EventData) => void, thisArg?: any) {
		this.on(eventNames, callback);
	}
}
