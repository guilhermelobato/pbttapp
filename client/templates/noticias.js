
// FUNCTIONS & VARS
///////////////////////////////////////////////////////////////////////////////
refreshCount = 0;

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

// noticias
///////////////////////////////////////////////////////////////////////////////
Template.noticias.rendered = function () {
	RB = new RubberBand(function(e) {
		refresh();
		window.setTimeout(e.close, 1500);
	});
	Session.set('filter', '');
};

Template.noticias.events({
	'touchstart div.content': function (e) {
		disableMenu();
	},
	'click a#a-refresh': function (e) {
		refresh();
	}
	,'keyup input#input-filter': function (e) {
		Session.set('filter', e.target.value);
	}
});

// noticiasList
///////////////////////////////////////////////////////////////////////////////
Template.noticiasList.helpers({
	noticias: function() {
		var filter = Session.get('filter');
		var qty = Session.get('qty');
		var limit = qty ? qty : 25;
		var sortAndLimit = {limit: limit, sort: {pubTime: -1}};

		if (filter) {
			var rxp = new RegExp(filter, 'i');
			var aux = {$regex: rxp};
			var query = {$or: [{titulo: aux},{olho: aux}]};
			return groundedNoticias.find(query,sortAndLimit);
		}

		return groundedNoticias.find({},sortAndLimit);
	}
});

// noticiasItem
///////////////////////////////////////////////////////////////////////////////
Template.noticiasItem.helpers({
	thumbnailer: function (filename) {
		return "http://paraibatotal.com.br/static/imagens/noticias/thumbs/" + filename;
	}
});
