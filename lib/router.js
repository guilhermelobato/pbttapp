
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
			Meteor.subscribe('noticiasPublicadas')
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

Router.map(function () {
	this.route('/', {
		where: 'client',
		onBeforeAction: function () {
			if (this.ready()) {
				// Handle for launch screen defined in app-body.js
				dataReadyHold.release()
			}

			this.next();
		},
		action: function() {
			Router.go('/noticias');
		}
	});

	this.route('/noticias', {
		where: 'client',
		action: function () {
			this.render('noticias');
		}
	});

	this.route('/noticia/:anchor', {
		where: 'client',
		action: function () {
			this.render('noticia', {
				data: function () {
					return groundedNoticias.findOne({anchor: this.params.anchor});
				}
			})
		}
	});

	this.route('/eventos', {
		where: 'client',
		action: function () {
			this.render('eventos');
		}
	});

	this.route('/sobre', {
		where: 'client',
		action: function () {
			this.render('sobre');
		}
	});
	this.route('/refresh', {where: 'server'})
		.post(function () {
			fetchNoticias();
			this.response.end('');
		});
});
