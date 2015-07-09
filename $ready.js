define(function () {
	return function $ready(toggle) {
		return this.toggleClass("loading", !toggle).toggleClass("ready", toggle);
	};
});