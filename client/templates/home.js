refreshCount = 0;
// FUNCTIONS & VARS
///////////////////////////////////////////////////////////////////////////////
function refresh() {

	if (lastFetchTimestamp && (new Date().getTime() - lastFetchTimestamp < triggerHappyGuard)) {
		console.log('avoiding over-refreshing...');
		refreshCount++;

		if (refreshCount >= 10) {
			alert('Recarregando...');
			refreshCount = 0;
		}

		return;
	}

	$.ajax({
		type: "POST",
		url: "/refresh",
		cache: false
	});

	lastFetchTimestamp = new Date().getTime();
	refreshCount = 0;
}

// HOME
///////////////////////////////////////////////////////////////////////////////
Template.home.rendered = function () {
	RB = new RubberBand(function(e) {
		refresh();
		window.setTimeout(e.close, 1500);
	});
	Session.set('filter', '');
};

Template.home.events({
	'click a#a-refresh': function (e) {
		refresh();
	},'keyup input#input-filter': function (e) {
		Session.set('filter', e.target.value);
	}
});


// LISTAO
///////////////////////////////////////////////////////////////////////////////
Template.listao.helpers({
	noticias: function() {
		var filter = Session.get('filter');
		var query = filter ? {$or: [{titulo: {$regex: filter}},{olho: {$regex: filter}}]} : {};
		return Noticias.find(query,{limit: 25, sort: {pubTime: -1}}).fetch();
	}
});

// NOTICIA
///////////////////////////////////////////////////////////////////////////////
Template.noticia.helpers({
	thumbnailer: function (filename) {
		return "http://paraibatotal.com.br/static/imagens/noticias/thumbs/" + filename;
	}
});
