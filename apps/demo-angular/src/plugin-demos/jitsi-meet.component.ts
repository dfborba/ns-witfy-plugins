import { Component, NgZone } from '@angular/core';
import { DemoSharedJitsiMeet } from '@demo/shared';
import { } from '@nswitfy/jitsi-meet';

@Component({
	selector: 'demo-jitsi-meet',
	templateUrl: 'jitsi-meet.component.html',
})
export class JitsiMeetComponent {
  
  demoShared: DemoSharedJitsiMeet;
  
	constructor(private _ngZone: NgZone) {}

  ngOnInit() {
    this.demoShared = new DemoSharedJitsiMeet();
  }

}