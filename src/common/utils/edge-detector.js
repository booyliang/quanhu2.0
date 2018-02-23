class EdgeDetector {
	constructor(config = {}) {
		this._config = Object.assign({}, this._defaultConfig, config)
		this._target = this._config.target;
		this._listenScroll();
		// console.log('this._targetsf', this._target)
	}

	_listenScroll() {
		window.addEventListener('scroll', this._handleScroll.bind(this));
	}
	unlistenScroll() {
		window.removeEventListener('scroll', this._handleScroll.bind(this));
	}

	_handleScroll = () => {
		// console.log("this._target", this._target)
		let bottom = this._target.getBoundingClientRect().bottom;

		if (this._isLocked() || !bottom) {
			return;
		}

		let atEdge = bottom <= window.innerHeight + this._config.offset;


		if (atEdge && this._config.callback) {
			this._config.callback();
		}
	}

	_lock() {
		this._locked = true;
	}

	_unlock() {
		this._locked = false;
	}

	_isLocked() {
		return this._locked;
	}

	lock() {
		return this._lock();
	}

	unlock() {
		return this._unlock();
	}

	get _defaultConfig() {
		return {
			offset: 0
		};
	}

	_locked = false;
}

export default EdgeDetector;