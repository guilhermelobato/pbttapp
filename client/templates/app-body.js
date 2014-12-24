
// FUNCTIONS
///////////////////////////////////////////////////////////////////////////////
toggleMenu = function() {
	Session.set(MENU_KEY, !Session.get(MENU_KEY));
}

disableMenu = function() {
	Session.set(MENU_KEY, false)
}

// HELPERS
///////////////////////////////////////////////////////////////////////////////
Template.registerHelper('isAndroid', function() {
	return device ? false : device.platform === 'Android';
});
Template.registerHelper('isIos', function() {
	return device ? false : device.platform === 'iOS';
});
Template.registerHelper('menuOpen', function() {
	return Session.get(MENU_KEY);
});
Template.registerHelper('pathnameEquals', function(name) {
	return (Session.get('pathname') || window.location.pathname).split("#")[0] === name;
});
Template.registerHelper('connected', function() {
	if (Session.get(SHOW_CONNECTION_ISSUE_KEY)) {
		return Meteor.status().connected;
	} else {
		return true;
	}
});

var SHOW_CONNECTION_ISSUE_KEY = 'showConnectionIssue';
var CONNECTION_ISSUE_TIMEOUT = 5000;

Session.setDefault(MENU_KEY, false);
Session.setDefault(SHOW_CONNECTION_ISSUE_KEY, false);

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


//	document.addEventListener("menubutton", toggleMenu, false);
});

// appBody
///////////////////////////////////////////////////////////////////////////////
Template.appBody.events({
	'click nav.bar.bar-tab a': function(e) {
		Session.set('pathname', $(e.currentTarget).attr("href"));
	}
})