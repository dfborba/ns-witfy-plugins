import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptRouterModule } from '@nativescript/angular';
import { StompConnectorComponent } from './stomp-connector.component';

@NgModule({
	imports: [NativeScriptCommonModule, NativeScriptRouterModule.forChild([{ path: '', component: StompConnectorComponent }])],
	declarations: [StompConnectorComponent],
	schemas: [NO_ERRORS_SCHEMA],
})
export class StompConnectorModule {}
