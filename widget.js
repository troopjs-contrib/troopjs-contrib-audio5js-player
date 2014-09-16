define([
	"troopjs-contrib-audio5js/widget",
	"jquery",
	"moment",
	"when/poll",
	"poly/array"
], function (Widget, $, moment, poll) {
	var ARRAY_SLICE = Array.prototype.slice;
	var CANPLAY = "canplay";
	var PHASE = "phase";
	var RE_PHASE = /^finalized?/;
	var $ELEMENT = "$element";
	var SRC = "src";
	var DURATION = "duration";
	var CUE_IN = "cueIn";
	var CUE_OUT = "cueOut";
	var EVENTS = [
		"audio5js/canplay",
		"audio5js/error",
		"audio5js/ended",
		"audio5js/play",
		"audio5js/pause"
	];
	var METHODS = [
		"audio5js/do/play",
		"audio5js/do/pause",
		"audio5js/do/seek"
	];

	function toggleReady(toggle) {
		return this
			.find(".glyphicon")
				.toggleClass("glyphicon-time", toggle)
				.toggleClass("glyphicon-play", !toggle);
	}

	function togglePlaying(toggle) {
		return this
			.toggleClass("paused", !toggle)
			.toggleClass("playing", toggle)
			.find("[data-action='play']")
				.toggleClass("btn-default", !toggle)
				.toggleClass("btn-primary", toggle);
	}

	return Widget.extend(function ($element, name, src) {
		this[SRC] = src;
	}, {
		"sig/initialize": function () {
			var me = this;
			var _position = 0;
			var _cued = false;

			EVENTS.forEach(function (event) {
				me.on(event, function () {
					this[$ELEMENT].trigger(event, ARRAY_SLICE.call(arguments));
				});
			});

			METHODS.forEach(function (method) {
				me.on("dom/" + method, function ($event) {
					var args = ARRAY_SLICE.call(arguments);
					args[0] = method;
					this.emit.apply(this, args);
				});
			});

			me.on("audio5js/timeupdate", function (position, duration) {
				var me = this;
				var $element = me[$ELEMENT];
				var $data = $element.data();
				var cue_in = CUE_IN in $data
					? $data[CUE_IN]
					: 0;
				var cue_out = CUE_OUT in $data
					? $data[CUE_OUT]
					: duration;

				if (_cued === true) {
					return;
				}
				else if (position !== 0 && position < cue_in) {
					_cued = true;

					return me
						.emit("audio5js/do/seek", cue_in)
						.tap(function () {
							_cued = false;
						});
				}
				else if (position !== duration && position > cue_out) {
					_cued = true;

					return me
						.emit("audio5js/do/pause")
						.then(function () {
							return me.emit("audio5js/ended");
						})
						.tap(function () {
							_cued = false;
						});
				}
			});

			poll(
				function () {
					var position = _position;

					if (!me[CANPLAY]) {
						toggleReady.call(me[$ELEMENT], true);
					}
					else if (me.prop && me.prop("playing")) {
						toggleReady.call(me[$ELEMENT], (_position = me.prop("position")) === position);
					}
					else {
						toggleReady.call(me[$ELEMENT], false);
					}

					return me[PHASE];
				},
				300,
				function (phase) {
					return RE_PHASE.test(phase);
				}
			);
		},

		"sig/start": function () {
			var me = this;

			me[CANPLAY] = false;

			if (me.hasOwnProperty(SRC)) {
				return me.emit("audio5js/do/load", me[SRC]);
			}
		},

		"sig/stop": function () {
			return this.emit("audio5js/do/pause");
		},

		"on/audio5js/progress": function () {
			var me = this;
			var $element = me[$ELEMENT];
			var $data = $element.data();
			var cue_in = CUE_IN in $data
				? $data[CUE_IN]
				: 0;
			var cue_out = CUE_OUT in $data
				? $data[CUE_OUT]
				: me.prop(DURATION);

			me[CANPLAY] = true;

			$element
				.find(".duration")
				.text(moment((cue_out - cue_in) * 1000).format("mm:ss"));
		},

		"on/audio5js/timeupdate": function (position, duration) {
			var me = this;
			var $element = me[$ELEMENT];
			var $data = $element.data();
			var cue_in = CUE_IN in $data
				? $data[CUE_IN]
				: 0;
			var cue_out = CUE_OUT in $data
				? $data[CUE_OUT]
				: duration;

			var position_cue = Math.max(cue_in, Math.min(position, cue_out)) - cue_in;
			var duration_cue = Math.max(cue_in, Math.min(duration, cue_out)) - cue_in;
			var progress_cue = (position_cue / duration_cue) * 100;

			$element
				.find(".position")
					.text(moment(position_cue * 1000).format("mm:ss"))
					.end()
				.find(".progress > .progress-bar")
					.width(progress_cue + "%")
					.attr("aria-valuenow", progress_cue)
					.find("span")
						.text(progress_cue + "%");
		},

		"on/audio5js/play": function () {
			togglePlaying.call(this[$ELEMENT], true);
		},

		"on/audio5js/pause": function () {
			togglePlaying.call(this[$ELEMENT], false);
		},

		"dom:[data-action='play']/click": function () {
			var me = this;
			var $element = me[$ELEMENT];

			if (me[CANPLAY]) {
				$element.triggerHandler("audio5js/do/seek", 0);
				$element.triggerHandler("audio5js/do/play");
			}
		}
	});
});