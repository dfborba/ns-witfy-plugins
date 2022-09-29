import { Observable, EventData, Page } from '@nativescript/core';
import { DemoSharedStompConnector } from '@demo/shared';
import { } from '@nswitfy/stomp-connector';

export function navigatingTo(args: EventData) {
	const page = <Page>args.object;
	page.bindingContext = new DemoModel();
}

export class DemoModel extends DemoSharedStompConnector {
	
}
