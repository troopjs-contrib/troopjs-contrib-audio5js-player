define(function () {
	return function $ready(toggle) {
		return this.toggleClass("ready", toggle);
	};
});