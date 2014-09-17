define([ "moment" ], function (moment) {
	return function $position(position, duration, format) {
		var progress = (position / duration) * 100;

		return this
			.find(".position")
			.text(moment(position * 1000).format(format || "mm:ss"))
			.end()
			.find(".progress > .progress-bar")
			.width(progress + "%")
			.attr("aria-valuenow", progress)
			.find("span")
			.text(progress + "%");
	};
});