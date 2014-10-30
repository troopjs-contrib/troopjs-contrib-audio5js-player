require({
	"waitSeconds": 15,
	"packages": [
		{
			"name": "bootstrap",
			"location": "bower_components/bootstrap/dist"
		},
		{
			"name": "jquery",
			"location": "bower_components/jquery/dist",
			"main": "jquery"
		},
		{
			"name": "poly",
			"location": "bower_components/poly",
			"main": "es5"
		},
		{
			"name": "when",
			"location": "bower_components/when",
			"main": "when"
		},
		{
			"name": "requirejs-text",
			"location": "bower_components/requirejs-text"
		},
		{
			"name": "require-css",
			"location": "bower_components/require-css"
		},
		{
			"name": "moment",
			"location": "bower_components/moment",
			"main": "min/moment.min"
		},
		{
			"name": "audio5js",
			"location": "bower_components/audio5js",
			"main": "audio5.min"
		},
		{
			"name": "troopjs",
			"location": "bower_components/troopjs",
			"main": "maxi"
		},
		{
			"name": "troopjs-contrib-audio5js",
			"location": "bower_components/troopjs-contrib-audio5js",
			"main": "widget"
		},
		{
			"name": "troopjs-contrib-audio5js-player",
			"location": "."
		}
	],

	"shim": {
		"bootstrap/js/bootstrap": {
			"deps": [ "jquery" ]
		}
	},

	"map": {
		"*": {
			"json": "troopjs-requirejs/json",
			"shadow": "troopjs-requirejs/shadow",
			"text": "requirejs-text/text",
			"css": "require-css/css.min",
			"mu": "mu-template/plugin"
		}
	},

	"deps": [
		"require",
		"jquery",
		"troopjs",
		"css!bootstrap/css/bootstrap",
		"bootstrap/js/bootstrap"
	],

	"callback": function (localRequire, jQuery) {
		// Require additional modules and start TroopJS
		localRequire([
			"troopjs-dom/application/widget"
		], function (Application) {
			jQuery(function ($) {
				Application($("html"), "bootstrap").start();
			});
		});

		jQuery(function ($) {
			// Chrome allows you to click `forbidden` elements inside buttons
			$(document.body).on("click", "button > span", function ($event) {
				return $($event.target)
					.parent()
					.click();
			});
		});
	}
});