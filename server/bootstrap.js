
// FUNCTIONS
///////////////////////////////////////////////////////////////////////////////
fetchNoticias = function() {
	var url = 'http://www.paraibatotal.com.br/noticias/json';

	if (lastFetchTimestamp && (new Date().getTime() - lastFetchTimestamp < triggerHappyGuard)) {
		console.log('avoiding over-refreshing...');
		return;
	}

	HTTP.get(url, function (err, result) {
		var news = _.extend([], result.data.list);

		news.forEach(function (el) {
			insertOrUpdateNoticias(el);
		});

		lastFetchTimestamp = new Date().getTime();
		console.log('fetched '+ news.length +' items from "'+url+'" ...');
	});
}

insertOrUpdateNoticias = function(n) {
	var res = Noticias.upsert({anchor: n.anchor}, {
		'$set': {
			olho: n.olho,
			corpo: n.corpo,
			titulo: n.titulo,
			pubTime: n.pubTime,
			thumb: n.thumb
		}
	});


}

// STARTUP
///////////////////////////////////////////////////////////////////////////////
Meteor.startup(function () {
	fetchNoticias();
	setTimeout(fetchNoticias, triggerHappyGuard); // 1 minuto
});
