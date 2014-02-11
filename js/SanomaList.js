Sanoma = {};
Sanoma.view = {};
Sanoma.Setup = (function () {

	var _level = {
		content: Core.display.Level("content", "levelContent"),
		menu: Core.display.Level("menu", "levelMenu"),
		overlay: Core.display.Level("overlay", "levelOverlay")
	}

	var _content = {
		Home: Core.display.Asset("Home", "NORMAL", {
			preload: true,
			level: _level.content,
			html: "assets/html/Home.html",
			js: "assets/js/Home.js",
			css: "assets/css/Home.css"
		}),
		Area: Core.display.Asset("About", "NORMAL", {
			preload: true,
			level: _level.content,
			html: "assets/html/About.html",
			js: "assets/js/About.js",
			css: "assets/css/About.css"
		}),
		/*Print: Core.display.Asset("Contact","NORMAL",{
			preload:	true,
			level:		_level.overlay,
			html:		"assets/html/Contact.html",
			js:			"assets/js/Contact.js",
			css:		"assets/css/Contact.css"
		}),*/
		Overzichtsplattegrond: Core.display.Asset("Overzichtsplattegrond", "NORMAL", {
			preload: true,
			level: _level.overlay,
			html: "assets/html/Overzichtsplattegrond.html",
			js: "assets/js/Overzichtsplattegrond.js",
			css: "assets/css/Overzichtsplattegrond.css"
		})
	}

	return {
		level: _level,
		content: _content
	}
})();

Sanoma.Menu = (function () {
	var _menuCar = false;
	var _menuTrain = false;
	var _menuBus = false;

	var _transVarTrain = "transport_train";
	var _transVarCar = "transport_car";
	var _transVarBus = "transport_bus";

	var _selectedTransportation = false;
	var _selectedRoute = false;
	var _currentMenu = false;

	var _selectedRouteName = "";

	var _selectedMenuElement = false;
	var _clickedMenuElement = false;

	var _initMenu = function (routes) {

		_currentMenu = routes;
		_buildDesktopMenu();
	}

	var getUrlVars = function () {
		var vars = {};
		var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
			vars[key] = value;
		});
		return vars;
	}

	var _buildDesktopMenu1 = function () {
		//alert("building menu")
	}

	var _initialButtonOnMouseOver = function () {
		if (_selectedMenuElement) {
			if (Core.dom.hasClass(_selectedMenuElement, "initialSpecialButtonInnerMenuItem")) {
				Core.dom.removeClass(_selectedMenuElement, "initialTopButtonSelected");
				Core.dom.removeClass(_selectedMenuElement.parentNode.parentNode, "initialTopButtonSelected2");
			} else {
				Core.dom.removeClass(_selectedMenuElement, "initialButtonSelected");
				Core.dom.removeClass(_selectedMenuElement.parentNode.parentNode, "initialButtonSelected2");
			}
		}
	}


	var _getPos = function (el) {
		for (var lx = 0, ly = 0; el != null; lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
		return {
			x: lx,
			y: ly
		};
	}

	var _curHash = "";

	var _startRoute = function (starts) {
		for (var i = 0; i < _currentMenu.length; i++) {
			if (starts && starts == _currentMenu[i].cleanName) { //(decodeURIComponent(starts) == decodeURIComponent(_currentMenu[i].name))) {
				//alert("got one "+starts);
				_menuClick(_clickedMenuElement, i);
				_startRoute();
				_selectRoute(i);
			}
		}
	}

	var _menuClick = function (that, id) {
		Sanoma.Menu.selectRoute(id);
		if (_selectedMenuElement) {
			if (Core.dom.hasClass(_selectedMenuElement, "initialSpecialButtonInnerMenuItem")) {
				Core.dom.removeClass(_selectedMenuElement, "initialTopButtonSelected");
				Core.dom.removeClass(_selectedMenuElement.parentNode.parentNode, "initialTopButtonSelected2");
			} else {
				Core.dom.removeClass(_selectedMenuElement, "initialButtonSelected");
				Core.dom.removeClass(_selectedMenuElement.parentNode.parentNode, "initialButtonSelected2");
			}
		}
		_selectedMenuElement = that;
		//console.log(this.innerHTML);
		if (Core.dom.hasClass(_selectedMenuElement, "initialSpecialButtonInnerMenuItem")) {
			Core.dom.addClass(_selectedMenuElement, "initialTopButtonSelected");
			Core.dom.addClass(_selectedMenuElement.parentNode.parentNode, "initialTopButtonSelected2");
		} else {
			Core.dom.addClass(_selectedMenuElement, "initialButtonSelected");
			Core.dom.addClass(_selectedMenuElement.parentNode.parentNode, "initialButtonSelected2");
		}
	}


	var getCleanName = function (str) {
		var prevVal = "";
		while (prevVal != str) {
			prevVal = str;
			str = String(str).replace(" ", "_");
		}
		while (prevVal != str) {
			prevVal = str;
			str = String(str).replace("%20", "_");
		}
		/*while(prevVal!=str){
				prevVal = str;
				str = String(str).replace("&","|");
			}*/
		return str;
	}

	var _buildDesktopMenu = function () {
		try {
			document.getElementById("Core31415926535897932384626433832preload").innerHTML = "";
		} catch (e) {

		}
		var initialButtons = document.getElementsByClassName('initialButtonInnerMenu');

		var i = 0;
		for (i = 0; i < initialButtons.length; i++) {
			initialButtons[i].innerHTML = "";
		}

		if (("onhashchange" in window)) { // && !($.browser.msie)) { only for oldy ies
			window.onhashchange = function () {
				_startRoute(window.location.hash.replace("#", ""));
			}
		} else {
			var prevHash = window.location.hash;
			window.setInterval(function () {
				if (window.location.hash != _curHash) {
					_curHash = window.location.hash;
					_startRoute(window.location.hash.replace("#", ""));
				}
			}, 100);
		}

		var startRoute = false;

		var starts = window.location.hash.replace("#", "");
		if (starts == "") {
			starts = false;
		}

		var html;
		var sel = "";

		var routeIndex = 0;
		var currLetter = "a";
		var routeLetter = "a";
		var div = false;

		var specials = {
			"1": true,
			"2": true,
			"3": true,
			"4": true,
			"5": true,
			"6": true,
			"7": true,
			"BG": true
		}

		var special = false


		var leUrl;
		for (i = 0; i < _currentMenu.length; i++) {
			//console.log("lelele");
			leUrl = '<a href="http://www.plattegrondsanoma.nl/#'+getCleanName(_currentMenu[i].name)+'" target="_blank">'+_currentMenu[i].name+'</a> - http://www.plattegrondsanoma.nl/#'+getCleanName(_currentMenu[i].name)+' <br/>'
			document.getElementById('preloaderSpinner').innerHTML=document.getElementById('preloaderSpinner').innerHTML + ""+ leUrl;
			
			/*
			special = false

			routeLetter = _currentMenu[i].name.substr(0, 1).toUpperCase();
			if (specials[routeLetter] || specials[_currentMenu[i].name.substr(0, 2).toUpperCase()]) {
				special = true;
			}
			_currentMenu[i].cleanName = getCleanName(_currentMenu[i].name);
			_currentMenu[i].routeIndex = i;
			if (starts && starts == _currentMenu[i].cleanName) { //(decodeURIComponent(starts) == decodeURIComponent(_currentMenu[i].name))) {
				//alert(starts)
				startRoute = true;
				routeIndex = i
				//_selectRoute(i);
			}


			div = document.createElement('div');
			if (special) {
				div.className = "initialSpecialButtonInnerMenuItem";
			} else {
				div.className = "initialButtonInnerMenuItem";
			}

			_currentMenu[i].menuDiv = div;

			div.innerHTML = _formatName(_currentMenu[i].name);
			div.id = "r_" + i;
			div.onclick = function () {
				_clickedMenuElement = this;

				window.location.hash = _currentMenu[(this.id.replace("r_", ""))].cleanName;
			}

			if (_currentMenu[i].name.substr(0, 2).toUpperCase() == "BG") {
				document.getElementById("inner_BG").appendChild(div);
			} else {
				document.getElementById("inner_" + routeLetter).appendChild(div);
			}

			if (routeIndex == i && startRoute) {
				//console.log(div.innerHTML);
				div.click();
				//alert(i)
				_menuClick(div, i);
			}
*/

		}

		
	}

	var _formatName = function (str) {
		if (String(str).lastIndexOf("_") > -1) {
			str = String(str).substr(0, String(str).lastIndexOf("_"));
		}
		return str;
	}

	var _selectRoute = function (index) {
		Core.debug.log("Sanoma.Menu._selectRoute(" + index + ")");
		_selectedRoute = _currentMenu[index];
		_selectedRouteName = _formatName(_currentMenu[index].name);

		var f1 = HOSPITALS.Controller.getFLoorById(_selectedRoute.floors[0].id);
		var f2 = HOSPITALS.Controller.getFLoorById(_selectedRoute.floors[1].id);

		document.getElementById('labelMap1').innerHTML = f1.name;
		document.getElementById('labelMap2').innerHTML = "";
		if (_selectedRoute.floors[0].id != _selectedRoute.floors[1].id) {
			document.getElementById('labelMap2').innerHTML = f2.name;
		}

		document.getElementById('topLabel').innerHTML = "route naar " + _selectedRouteName
		HOSPITALS.MapsContainer.selectRoute(_selectedRoute);
	}

	var _initDesktopMenu = function () {

	}

	var _public = {
		initMenu: function (routes) {
			_initMenu(routes)
		},
		initDesktopMenu: function () {
			_initDesktopMenu();
		},
		buildDesktopMenu: function () {
			_buildDesktopMenu()
		},
		initialButtonOnMouseOver: function () {
			_initialButtonOnMouseOver();
		},
		selectTransportMode: function (transVar) {
			_selectTransportMode(transVar)
		},
		selectedTransportation: function () {
			return _selectedTransportation
		},
		selectRoute: function (index) {
			_selectRoute(index)
		},
		TRANSPORT_TRAIN: function () {
			return _transVarTrain
		},
		TRANSPORT_CAR: function () {
			return _transVarCar
		},
		TRANSPORT_BUS: function () {
			return _transVarBus
		}
	}
	return _public;
})();

Sanoma.SiteManager = (function () {

	var _init = function () {
		//console.log("Sanoma.SiteManager INIT")
		// Preloader
		// CanvasLoader
		/*
		var cl = new CanvasLoader('preloaderSpinner');
		cl.setColor('#008fd0'); // default is '#000000'
		cl.setShape('spiral'); // default is 'oval'
		cl.setDiameter(35); // default is 40
		cl.setDensity(16); // default is 40
		cl.setRange(1.1); // default is 1.3
		cl.setSpeed(1); // default is 2
		cl.setFPS(25); // default is 24
		cl.show(); // Hidden by default
		var loaderObj = document.getElementById("canvasLoader");
		loaderObj.style.position = "absolute";
		loaderObj.style["top"] = cl.getDiameter() * -0.5 + "px";
		loaderObj.style["left"] = cl.getDiameter() * -0.5 + "px";
*/
		//TweenLite.from(document.getElementById("logo"), 0.5, {css:{autoAlpha:0, right:"0px"}});
		HOSPITALS.MapsContainer.init();

		HOSPITALS.Controller.loadJSON(function () {
			Sanoma.Menu.initMenu(HOSPITALS.Model.routes())
		//	console.log("Sanoma.SiteManager -> Loading Floors")
			//_initComplete();
			/*
			
			HOSPITALS.Controller.loadFloors(function () {
				//Sanoma.Menu.initMenu(HOSPITALS.Model.routes())
				Core.debug.info("Floors Loaded");
				_initComplete();
			})
			*/
		});


	}




	var _initComplete = function () {
		//	
		var preloader = document.getElementById("preloaderSpinner");
		document.getElementById('application').removeChild(preloader);
		//document.getElementById('Core31415926535897932384626433832preload').innerHTML="";
		Core.managers.NavigationManager.showAsset(Sanoma.Setup.content.Home);
		//Core.managers.NavigationManager.showAsset(Sanoma.Setup.content.Menu);

		//alert("Sanoma.SiteManager -> _initComplete ")
	}

	var _public = {
		init: function () {
			_init()
		}
	}
	return _public;
})();

//Sanoma.SiteManager.init();




Sanoma.AnimationManager = (function () {

	var _genContentInit = function (div) {
		TweenLite.set(div, {
			css: {
				autoAlpha: 0
			}
		});
	}

	var _genContentShow = function (div) {
		TweenLite.to(div, 0.5, {
			css: {
				autoAlpha: 1
			}
		});
	}

	var _genContentHide = function (div, callback) {
		TweenLite.to(div, 0.5, {
			css: {
				autoAlpha: 0
			},
			onComplete: callback
		});
	}

	var _public = {
		genContentHide: _genContentHide,
		genContentInit: _genContentInit,
		genContentShow: _genContentShow
	}
	return _public;
})();

Core.dom.addLoadEvent(function () {
	Sanoma.SiteManager.init();
});