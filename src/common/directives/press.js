let timer = null;
let removeDefaultEvt = function (evt) {
	evt.preventDefault();
}
let pressStart = (evt, fn) => {
	if (typeof fn !== 'function') return;
	timer = setTimeout(() => {
		fn(evt)
	}, 500);
}
let pressEnd = function (evt) {
	clearTimeout(timer);
	timer = null;
}
const press = {
	name: 'press',
	bind(el, binding) {
		el.addEventListener('touchstart', (event) => {pressStart(event, binding.value)});
		el.addEventListener('touchmove', pressEnd);
		el.addEventListener('touchend', pressEnd);
	},
	unbind: function (el, binding) {
		el.removeEventListener('touchstart', (event) => {pressStart(event, binding.value)})
		el.removeEventListener('touchmove', pressEnd)
		el.removeEventListener('touchend', pressEnd)
	}
}

export default press;