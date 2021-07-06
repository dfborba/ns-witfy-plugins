import { DemoSharedBase } from '../utils';
import {} from '@nswitfy/stomp-connector';

export class DemoSharedStompConnector extends DemoSharedBase {
	testIt() {
		console.log('test stomp-connector!');
	}
}
