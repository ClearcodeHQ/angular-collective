'use strict';

module.exports = {
	db: 'mongodb://localhost/mean-dev',
	url: 'http://localhost:3000',
	app: {
		title: 'AngularJS Collective - Development'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'cc68ab8f756126b5a132',
		clientSecret: process.env.GITHUB_SECRET || 'f02323b088bf7e8dc420a6374e4c35a1e49ea991',
		callbackURL: 'http://localhost:3000/auth/github/callback'
	},

	token:'b5229e61d6a18e6a3a5c7b3168c8943d3e77572a',
	gitUser:'clearcodeangularjs',

	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};
