import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from '@nativescript/angular';

import { HomeComponent } from './home.component';

const routes: Routes = [
   { path: '', redirectTo: '/home', pathMatch: 'full' },
   { path: 'home', component: HomeComponent },
	{ path: 'jitsi-meet', loadChildren: () => import('./plugin-demos/jitsi-meet.module').then(m => m.JitsiMeetModule) },
	{ path: 'stomp-connector', loadChildren: () => import('./plugin-demos/stomp-connector.module').then(m => m.StompConnectorModule) }
];

@NgModule({
	imports: [NativeScriptRouterModule.forRoot(routes)],
	exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
