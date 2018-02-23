window.addEventListener('popstate', handlePopstate);
let needScroll = false;
let wait = 200;
let timestamp = Date.now();
let vueInst = null;

function onElementHeightChange(elm, callback) {
	let lastHeight = elm.clientHeight;		
	(function run() {
		let newHeight = elm.clientHeight;
		if (lastHeight !== newHeight)
			callback();
		lastHeight = newHeight;
		if (elm.onElementHeightChangeTimer)
			clearTimeout(elm.onElementHeightChangeTimer);
		elm.onElementHeightChangeTimer = setTimeout(run, wait);
	})();
}

onElementHeightChange(document.body, () => { 
	if (!needScroll)
		return;
	
	scroll();
	needScroll = false;	
})
function scroll() { 
	let pageYOffset = window.pageYOffset;
	window.scrollTo(0, window.pageYOffset + 2);
	window.scrollTo(0, window.pageYOffset - 2);
}
function handlePopstate(e) {	
	needScroll = true;
	scroll();

}

function install(vue) {
	vueInst = vue;
}
export default {
	install
}