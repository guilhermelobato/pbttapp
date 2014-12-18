
// ROUTER
///////////////////////////////////////////////////////////////////////////////
Router.configure({
	// we use the  appBody template to define the layout for the entire app
	layoutTemplate: 'appBody',

	// the appNotFound template is used for unknown routes and missing lists
	notFoundTemplate: 'appNotFound',

	// show the appLoading template whilst the subscriptions below load their data
	loadingTemplate: 'appLoading',

	// wait on the following subscriptions before rendering the page to ensure
	// the data it's expecting is present
	waitOn: function() {
		return [
//			Meteor.subscribe('noticiasPublicadas')
		];
	}
});

dataReadyHold = null;

if (Meteor.isClient) {
	// Keep showing the launch screen on mobile devices until we have loaded
	// the app's data
	dataReadyHold = LaunchScreen.hold();

	// Show the loading screen on desktop
	Router.onBeforeAction('loading');
	Router.onBeforeAction('dataNotFound');
}

//Router.route('/', function () {
//	console.log('bla');
//	this.render('home');
//});

Router.map(function () {
	this.route('/', {
			path: '/',
			where: 'client',
			onBeforeAction: function () {
				if (this.ready()) {
					// Handle for launch screen defined in app-body.js
					dataReadyHold.release()
				}

				this.next();
			}
		})
		.get(function() {
			this.render('home');
		});


	this.route('/noticias/:anchor', {where: 'client'})
		.get(function () {
			this.render('noticias', {
				data: function () {
					return Noticias.findOne({anchor: this.params.anchor});
				}
			})
		});

	this.route('/refresh', {where: 'server'})
		.post(function () {
			fetchNoticias();
			this.response.end('');
		});
});
