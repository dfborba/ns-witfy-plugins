import { Component } from '@angular/core';

@Component({
	selector: 'demo-home',
	templateUrl: 'home.component.html',
})
export class HomeComponent {
	demos = [
	{
		name: 'jitsi-meet'
	},
	{
		name: 'stomp-connector'
	}
];
}