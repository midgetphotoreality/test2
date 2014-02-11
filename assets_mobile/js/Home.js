Sanoma.view.Home = (function() {
	var _divAsset;


	/*__FUNCTIONS_____________________________________________________________________________________________________*/

	/*__CORE_FUNCTIONS________________________________________________________________________________________________*/
	var _init = function() {
		Core.debug.log("Sanoma.view.Home -> _init()");
		_divAsset = document.getElementById("Home");
		Sanoma.AnimationManager.genContentInit(_divAsset);
		
		HOSPITALS.MapsContainer.init();
	}

	var _show = function() {
		Core.debug.log("Sanoma.view.Home1 -> _show()");
		Sanoma.AnimationManager.genContentShow(_divAsset);
	}

	var _hide = function(callback) {
		Core.debug.log("Sanoma.view.Home1 -> _hide()");
		Sanoma.AnimationManager.genContentHide(_divAsset, callback);
	}

	var _remove = function() {
		Core.debug.log("Sanoma.view.Home1 -> _remove()");
		Sanoma.Setup.content.Home.removeView(Sanoma.view.Home);
		_divAsset = null;
	}


	/*__PUBLIC_FUNCTIONS______________________________________________________________________________________________*/
	var _public = {
		init: function() { _init(); },
		show: function() { _show(); },
		hide: function(callback) { _hide(callback); },
		remove: function() { _remove(); }
	}
	return _public;
})();
Sanoma.Setup.content.Home.addView(Sanoma.view.Home);