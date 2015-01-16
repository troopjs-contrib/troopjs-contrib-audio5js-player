define([ "moment" ], function (moment) {
	return function $duration(duration, format) {
		return this
			.find(".duration")
			.text(moment(duration * 1000).utc().format(format || "mm:ss"));
	};
});