
// PUBLISH
///////////////////////////////////////////////////////////////////////////////
Meteor.publish('noticiasPublicadas', function(page) {
	//TODO: SANITIZE
	page = page || 1;

	var p = page < noticiasMaxPages ? page : noticiasMaxPages;
	return Noticias.find({}, {limit: p * noticiasItemsPerPage, sort: {pubTime: -1}});
});
