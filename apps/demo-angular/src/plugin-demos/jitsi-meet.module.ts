import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptRouterModule } from '@nativescript/angular';
import { JitsiMeetComponent } from './jitsi-meet.component';

@NgModule({
	imports: [NativeScriptCommonModule, NativeScriptRouterModule.forChild([{ path: '', component: JitsiMeetComponent }])],
	declarations: [JitsiMeetComponent],
	schemas: [NO_ERRORS_SCHEMA],
})
export class JitsiMeetModule {}
