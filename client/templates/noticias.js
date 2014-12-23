
// FUNCTIONS & VARS
///////////////////////////////////////////////////////////////////////////////
var refreshCount = 0;

var degree = 0;
var $el = null; //INICIALIZADO NO refresh();
var MIN_ROTATION_ANIMATE_TIME = 1500;

var FILTER = 'filter';
var QTY = 'qty';
var SCROLLTOP = 'scrollTop';

function stopRotate () {
	clearTimeout(rotateTimer);
	degree = 0;
	rotate();
}

function rotate() {
	$el.css({ WebkitTransform: 'rotate(' + degree + 'deg)'});
	$el.css({ '-moz-transform': 'rotate(' + degree + 'deg)'});
}

function chainRotate() {
	rotate();
	rotateTimer = setTimeout(function() {
		degree+=3; chainRotate();
	},5);
}

function refresh() {
	$el = $("#a-refresh")
	chainRotate();
	if (lastFetchTimestamp && (new Date().getTime() - lastFetchTimestamp < triggerHappyGuard)) {
		console.log('avoiding over-refreshing...');
		refreshCount++;

		if (refreshCount >= 10) {
			alert('Recarregando...');
			refreshCount = 0;
		}

		setTimeout(stopRotate, MIN_ROTATION_ANIMATE_TIME);
		return;
	}

	$.ajax({
		type: "POST",
		url: "/refresh",
		cache: false,
		complete: function() {
			setTimeout(stopRotate, MIN_ROTATION_ANIMATE_TIME);
		}
	});

	lastFetchTimestamp = new Date().getTime();
	refreshCount = 0;
}

function setScrollTopHistory(y) {
	Session.set(SCROLLTOP, y);
}

function getScrollTopHistory() {
	return Session.get(SCROLLTOP);
}

// noticias
///////////////////////////////////////////////////////////////////////////////
Template.noticias.rendered = function () {
	RB = new RubberBand(function(e) {
		refresh();
		window.setTimeout(e.close, 1500);
	});
	Session.set(FILTER, '');
	$(".content").scrollTop(getScrollTopHistory());
	setScrollTopHistory(0);
};

Template.noticias.events({
	'touchstart div.content': function (e) {
		disableMenu();
	},
	'click a#a-refresh': function (e) {
		refresh();
	},
	'keyup input#input-filter': function (e) {
		Session.set(FILTER, e.target.value);
	}
});

// noticiasList
///////////////////////////////////////////////////////////////////////////////
Template.noticiasList.helpers({
	noticias: function() {
		var filter = Session.get(FILTER);
		var qty = Session.get(QTY);
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

Template.noticiasList.events({
	'click a': function (e) {
		setScrollTopHistory($(".content").scrollTop());
	}
});

// noticiasItem
///////////////////////////////////////////////////////////////////////////////
Template.noticiasItem.helpers({
	thumbnailer: function (filename) {
		return filename ? "http://paraibatotal.com.br/static/imagens/noticias/thumbs/" + filename : "images/default.jpg";
	}
});
