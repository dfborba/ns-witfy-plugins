import { Observable, EventData, Page } from '@nativescript/core';
import { DemoSharedJitsiMeet } from '@demo/shared';
import {} from '@nswitfy/jitsi-meet';

export function navigatingTo(args: EventData) {
	const page = <Page>args.object;
	page.bindingContext = new DemoModel();
}

export class DemoModel extends DemoSharedJitsiMeet {}
