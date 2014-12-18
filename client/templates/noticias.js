
// FUNCTIONS & VARS
///////////////////////////////////////////////////////////////////////////////
baseUrl = "http://paraibatotal.com.br/noticias/";

function getTextNodesIn(node, includeWhitespaceNodes) {
	var textNodes = [], whitespace = /^\s*$/;

	function getTextNodes(node) {
		if (node.nodeType == 3) {
			if (includeWhitespaceNodes || !whitespace.test(node.nodeValue)) {
				textNodes.push(node);
			}
		} else {
			for (var i = 0, len = node.childNodes.length; i < len; ++i) {
				getTextNodes(node.childNodes[i]);
			}
		}
	}

	getTextNodes(node);
	return textNodes;
}

// NEWS
///////////////////////////////////////////////////////////////////////////////

// CORPODANOTICIA
///////////////////////////////////////////////////////////////////////////////
Template.corpoDaNoticia.helpers({
	externalLink: function (anchor) {
		var now = new Date();
		return baseUrl + now.getUTCFullYear() + "/" + (now.getMonth()+1) + "/" + now.getDate() + "/" + anchor;
	},
	fixedHtml: function (html) {
		if (!html) {
			return '';
		}
		//FIX NA URL RELATIVA VINDA DO SITE
		var fix = html;
		fix = fix.replace("src=\"/","src=\"http://www.paraibatotal.com.br/");
		fix = fix.replace("src=\"static/","src=\"http://www.paraibatotal.com.br/static/");
		fix = fix.replace("href=\"/","href=\"http://www.paraibatotal.com.br/");

		fix = fix.replace("src='/","src='http://www.paraibatotal.com.br/");
		fix = fix.replace("src='static/","src='http://www.paraibatotal.com.br/static/");
		fix = fix.replace("href='/","href='http://www.paraibatotal.com.br/");

		//ADICAO DA CLASSE THUMBNAIL E DO WRAPPER
		fix = $("<div id='renderedCorpo'/>").html(fix);

		//DESENCALACRANDO
		//fix = fix[0].outerHTML;
		textnodes = getTextNodesIn(fix[0]);

		for(var i=0; i < textnodes.length; i++){
			if($(textnodes[i]).parent().is("#renderedCorpo")){
				$(textnodes[i]).wrap("<p>");
			}
		}

		$(".anexo-img.FO",fix).addClass("media-object");

		//RETORNO
		return fix[0].outerHTML;
	}
});
