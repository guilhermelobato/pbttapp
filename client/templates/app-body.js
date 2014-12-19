
// HELPERS
///////////////////////////////////////////////////////////////////////////////
toggleMenu = function() {
	Session.set(MENU_KEY, !Session.get(MENU_KEY));
}

disableMenu = function() {
	Session.set(MENU_KEY, false)
}

// HELPERS
///////////////////////////////////////////////////////////////////////////////
Template.registerHelper('menuOpen', function() {
	return Session.get(MENU_KEY);
});
Template.registerHelper('pathName', function(name) {
	return window.location.pathname === name;
});
Template.registerHelper('connected', function() {
	if (Session.get(SHOW_CONNECTION_ISSUE_KEY)) {
		return Meteor.status().connected;
	} else {
		return true;
	}
});

//GLOBAL FOR INTEROPERABILITY
MENU_KEY = 'menuOpen';
Session.setDefault(MENU_KEY, false);

var SHOW_CONNECTION_ISSUE_KEY = 'showConnectionIssue';
Session.setDefault(SHOW_CONNECTION_ISSUE_KEY, false);

var CONNECTION_ISSUE_TIMEOUT = 5000;

// STARTUP
///////////////////////////////////////////////////////////////////////////////
Meteor.startup(function () {
	groundedNoticias = new Ground.Collection(Noticias);

	// Only show the connection error box if it has been 5 seconds since
	// the app started
	setTimeout(function () {
		// Launch screen handle created in /lib/router.js
		dataReadyHold.release();

		// Show the connection error box
		Session.set(SHOW_CONNECTION_ISSUE_KEY, true);
	}, CONNECTION_ISSUE_TIMEOUT);
});