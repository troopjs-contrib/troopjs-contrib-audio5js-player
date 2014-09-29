define(function () {
	return function $playing(toggle) {
		return this
			.toggleClass("paused", !toggle)
			.toggleClass("playing", toggle)
			.find("[data-action='play']")
			.toggleClass("btn-default", !toggle)
			.toggleClass("btn-primary", toggle);
	};
});