const npsUtils = require('nps-utils');

module.exports = {
	message: 'NativeScript Plugins ~ made with โค๏ธ  Choose a command to start...',
	pageSize: 32,
	scripts: {
		default: 'nps-i',
		nx: {
			script: 'nx',
			description: 'Execute any command with the @nrwl/cli',
		},
		format: {
			script: 'nx format:write',
			description: 'Format source code of the entire workspace (auto-run on precommit hook)',
		},
		'๐ง': {
			script: `npx cowsay "NativeScript plugin demos make developers ๐"`,
			description: '_____________  Apps to demo plugins with  _____________',
		},
		// demos
		apps: {
			'...Vanilla...': {
				script: `npx cowsay "Nothing wrong with vanilla ๐ฆ"`,
				description: ` ๐ป Vanilla`,
			},
			demo: {
				clean: {
					script: 'nx run demo:clean',
					description: 'โ  Clean  ๐งน',
				},
				ios: {
					script: 'nx run demo:ios',
					description: 'โ  Run iOS  ๏ฃฟ',
				},
				android: {
					script: 'nx run demo:android',
					description: 'โ  Run Android  ๐ค',
				},
			},
			'...Angular...': {
				script: `npx cowsay "Test all the Angles!"`,
				description: ` ๐ป Angular`,
			},
			'demo-angular': {
				clean: {
					script: 'nx run demo-angular:clean',
					description: 'โ  Clean  ๐งน',
				},
				ios: {
					script: 'nx run demo-angular:ios',
					description: 'โ  Run iOS  ๏ฃฟ',
				},
				android: {
					script: 'nx run demo-angular:android',
					description: 'โ  Run Android  ๐ค',
				},
			},
		},
		'โ๏ธ': {
			script: `npx cowsay "@nswitfy/* packages will keep your โ๏ธ cranking"`,
			description: '_____________  @nswitfy/*  _____________',
		},
		// packages
		// build output is always in dist/packages
		'@nswitfy': {
			// @nswitfy/jitsi-meet
			'jitsi-meet': {
				build: {
					script: 'nx run jitsi-meet:build.all',
					description: '@nswitfy/jitsi-meet: Build',
				},
			},
			// @nswitfy/stomp-connector
			'stomp-connector': {
				build: {
					script: 'nx run stomp-connector:build.all',
					description: '@nswitfy/stomp-connector: Build',
				},
			},
			'build-all': {
				script: 'nx run all:build',
				description: 'Build all packages',
			},
		},
		'โก': {
			script: `npx cowsay "Focus only on source you care about for efficiency โก"`,
			description: '_____________  Focus (VS Code supported)  _____________',
		},
		focus: {
			'jitsi-meet': {
				script: 'nx run jitsi-meet:focus',
				description: 'Focus on @nswitfy/jitsi-meet',
			},
			'stomp-connector': {
				script: 'nx run stomp-connector:focus',
				description: 'Focus on @nswitfy/stomp-connector',
			},
			reset: {
				script: 'nx run all:focus',
				description: 'Reset Focus',
			},
		},
		'.....................': {
			script: `npx cowsay "That's all for now folks ~"`,
			description: '.....................',
		},
	},
};
