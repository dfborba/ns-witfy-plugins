import { Component, NgZone } from '@angular/core';
import { DemoSharedStompConnector } from '@demo/shared';

@Component({
	selector: 'demo-stomp-connector',
	templateUrl: 'stomp-connector.component.html',
})
export class StompConnectorComponent {
	demoShared: DemoSharedStompConnector;

	constructor(private _ngZone: NgZone) {}

	ngOnInit() {
		this.demoShared = new DemoSharedStompConnector();
	}
}
