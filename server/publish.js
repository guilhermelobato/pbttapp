
// PUBLISH
///////////////////////////////////////////////////////////////////////////////
Meteor.publish('noticiasPublicadas', function() {
	return Noticias.find();
});
