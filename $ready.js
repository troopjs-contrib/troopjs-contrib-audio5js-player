define(function () {
	return function $ready(toggle) {
		return this
			.toggleClass("ready", toggle)
			.find("[data-action='play'] .glyphicon")
			.toggleClass("glyphicon-time", !toggle)
			.toggleClass("glyphicon-play", toggle);
	};
});