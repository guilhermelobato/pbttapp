
// HELPERS
///////////////////////////////////////////////////////////////////////////////
Template.registerHelper('menuOpen', function() {
	return Session.get(MENU_KEY);
});
Template.registerHelper('connected', function() {
	if (Session.get(SHOW_CONNECTION_ISSUE_KEY)) {
		return Meteor.status().connected;
	} else {
		return true;
	}
});

var MENU_KEY = 'menuOpen';
Session.setDefault(MENU_KEY, false);

var SHOW_CONNECTION_ISSUE_KEY = 'showConnectionIssue';
Session.setDefault(SHOW_CONNECTION_ISSUE_KEY, false);

var CONNECTION_ISSUE_TIMEOUT = 5000;

Meteor.startup(function () {
	// Only show the connection error box if it has been 5 seconds since
	// the app started
	setTimeout(function () {
		// Launch screen handle created in /lib/router.js
		dataReadyHold.release();

		// Show the connection error box
		Session.set(SHOW_CONNECTION_ISSUE_KEY, true);
	}, CONNECTION_ISSUE_TIMEOUT);
});