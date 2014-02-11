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
			html: "assets_mobile/html/Home.html",
			js: "assets_mobile/js/Home.js",
			css: "assets_mobile/css/Home.css"
		}),
		Area: Core.display.Asset("About", "NORMAL", {
			preload: true,
			level: _level.content,
			html: "assets_mobile/html/About.html",
			js: "assets_mobile/js/About.js",
			css: "assets_mobile/css/About.css"
		}),
		Menu: Core.display.Asset("Menu", "NORMAL", {
			preload: true,
			level: _level.menu,
			html: "assets_mobile/html/Menu.html",
			js: "assets_mobile/js/Menu.js",
			css: "assets_mobile/css/Menu.css"
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
			html: "assets_mobile/html/Overzichtsplattegrond.html",
			js: "assets_mobile/js/Overzichtsplattegrond.js",
			css: "assets_mobile/css/Overzichtsplattegrond.css"
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

	var _initMenu = function (routes) {

		_menuCar = routes; //new Array();
		_menuTrain = routes; // new Array();
		_menuBus = routes; //new Array();


		//_buildMenu();
		/*
		Core.debug.groupCollapsed("Sanoma menu:");
		
		Core.debug.info("_menuCar");
		Core.debug.dir(_menuCar);
		
		Core.debug.info("_menuTrain");
		Core.debug.dir(_menuTrain);
		
		Core.debug.info("_menuBus");
		Core.debug.dir(_menuBus);
		
		Core.debug.groupEnd();
		*/
		//Sanoma.Menu.selectTransportMode('transport_car');
	}

	var _selectTransportMode = function (transVar) {
		//alert(document.getElementById("departments").value);

		if (transVar == _transVarTrain || transVar == _transVarCar || transVar == _transVarBus) {
			_selectedTransportation = transVar;
			Core.debug.log("Sanoma.Menu.selectTransportMode(" + transVar + ")")
			_buildMenu(_selectedRouteName);
			Core.dom.removeClass(document.getElementById('menuBtnReisAuto'), "menuButtonSelected");
			Core.dom.removeClass(document.getElementById('menuBtnReisAutoDiv'), "menuButtonSelected");
			Core.dom.removeClass(document.getElementById('menuBtnReisTrein'), "menuButtonSelected");
			Core.dom.removeClass(document.getElementById('menuBtnReisTreinDiv'), "menuButtonSelected");
			Core.dom.removeClass(document.getElementById('menuBtnReisBusTaxi'), "menuButtonSelected");
			Core.dom.removeClass(document.getElementById('menuBtnReisBusTaxiDiv'), "menuButtonSelected");

			if (_selectedTransportation == _transVarTrain) {
				Core.dom.addClass(document.getElementById('menuBtnReisTreinDiv'), "menuButtonSelected");
				Core.dom.addClass(document.getElementById('menuBtnReisTrein'), "menuButtonSelected");
			} else if (_selectedTransportation == _transVarBus) {
				Core.dom.addClass(document.getElementById('menuBtnReisBusTaxiDiv'), "menuButtonSelected");
				Core.dom.addClass(document.getElementById('menuBtnReisBusTaxi'), "menuButtonSelected");
			} else if (_selectedTransportation == _transVarCar) {
				Core.dom.addClass(document.getElementById('menuBtnReisAutoDiv'), "menuButtonSelected");
				Core.dom.addClass(document.getElementById('menuBtnReisAuto'), "menuButtonSelected");
			} else {
				//return false;

			}
			return true;
		}
		return false;
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

	var _curHash;
	var _buildMenu = function (selectedRoute) {
		Core.debug.log("Sanoma.Menu._buildMenu(): " + _selectedTransportation);

console.log("build")
		_currentMenu = false;
		if (_selectedTransportation == _transVarTrain) {
			_currentMenu = _menuTrain;
		} else if (_selectedTransportation == _transVarBus) {
			_currentMenu = _menuBus;
		} else if (_selectedTransportation == _transVarCar) {
			_currentMenu = _menuCar;
		} else {
			return false;
		}

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

		if (("onhashchange" in window)) { // && !($.browser.msie)) { only for oldy ies
			window.onhashchange = function () {
				_routeSelected(window.location.hash.replace("#", ""));
			}
		} else {
			var prevHash = window.location.hash;
			window.setInterval(function () {
				if (window.location.hash != _curHash) {
					_curHash = window.location.hash;
					_routeSelected(window.location.hash.replace("#", ""));
				}
			}, 100);
		}

		var startRoute = false;
		var selectedRoute = window.location.hash.replace("#", "");

		var htmlVergaderzalen, htmlVerdiepingen, htmlVerdiepingenInnerNum = "",
			htmlVerdiepingenInnerBG = "";
		var sel = "";
		var routeIndex = 0;
		var selDropbox = false;
		htmlVergaderzalen = '<select name="departments" id="select_vergaderzalen" class="menuRouteList" onchange="Sanoma.Menu.selectRoute(this)" value=""><option value="">Vergaderzalen</option>';

		htmlVerdiepingen = '<select name="departmentsTop" id="select_verdiepingen" class="menuRouteList" onchange="Sanoma.Menu.selectRoute(this)" value=""><option value="">Verdiepingen</option>';
		for (i = 0; i < _currentMenu.length; i++) {
			_currentMenu[i].cleanName = getCleanName(_currentMenu[i].name);
			_currentMenu[i].routeIndex = i;
			sel = "";
			routeLetter = _currentMenu[i].name.substr(0, 1).toUpperCase();
			if (selectedRoute && selectedRoute == getCleanName(_currentMenu[i].name)) { //== _formatName(_currentMenu[i].name)){
				//alert(selectedRoute)
				sel = " selected ";
				startRoute = true;
				routeIndex = i
				if (specials[routeLetter]) {
					selDropbox = "select_verdiepingen";
				} else if (specials[_currentMenu[i].name.substr(0, 2).toUpperCase()]) {
					selDropbox = "select_verdiepingen";
				} else {
					selDropbox = "select_vergaderzalen";
				}
			}


			if (specials[routeLetter]) {
				htmlVerdiepingenInnerNum = htmlVerdiepingenInnerNum + '<option value="' + i + '" ' + sel + '>' + _formatName(_currentMenu[i].name) + '</option>';
				_currentMenu[i].special = true;
			} else if (specials[_currentMenu[i].name.substr(0, 2).toUpperCase()]) {
				htmlVerdiepingenInnerBG = htmlVerdiepingenInnerBG + '<option value="' + i + '" ' + sel + '>' + _formatName(_currentMenu[i].name) + '</option>';
				_currentMenu[i].special = true;
			} else {
				htmlVergaderzalen = htmlVergaderzalen + '<option value="' + i + '" ' + sel + '>' + _formatName(_currentMenu[i].name) + '</option>';
				_currentMenu[i].special = false;
			}
		}
		htmlVerdiepingen = htmlVerdiepingen + htmlVerdiepingenInnerBG + htmlVerdiepingenInnerNum + "</select>";

		htmlVergaderzalen = htmlVergaderzalen + "</select>";
		document.getElementById("menuRouteContainerInner").innerHTML = htmlVergaderzalen;
		document.getElementById("menuRouteContainerTopInner").innerHTML = htmlVerdiepingen;
		console.log(document.getElementById("menuRouteContainerTopInner"));
		if (startRoute) {
			//alert("startroute" + routeIndex);
			_doSelect(document.getElementById(selDropbox));
		}
		Core.debug.log("Sanoma.Menu._buildMenu(), END");
	}

	var _formatName = function (str) {
		if (String(str).lastIndexOf("_") > -1) {
			str = String(str).substr(0, String(str).lastIndexOf("_"));
		}
		return str;
	}

	var _routeSelected = function(name){
		console.log("_routeSelected: "+name);
		for (i = 0; i < _currentMenu.length; i++) {
			if (name && name == getCleanName(_currentMenu[i].name)) {
				var special = false;
				if(_currentMenu[i].special){
					document.getElementById("select_verdiepingen").value = i;
					_doSelect(document.getElementById("select_verdiepingen"));
					
				}else{
					document.getElementById("select_vergaderzalen").value = i;
					_doSelect(document.getElementById("select_vergaderzalen"));
				}
				break;
			}
		}
	}
	
	var _selectRoute = function (dropdown) {
		//alert(dropdown.value);//getCleanName(_currentMenu[dropdown.value]))
		if(_currentMenu[dropdown.value]){
			window.location.hash = getCleanName(_currentMenu[dropdown.value].name);
		}
		/*
		for (i = 0; i < _currentMenu.length; i++) {
			if (name && name == getCleanName(_currentMenu[i].name)) {
				var special = false;
				if(_currentMenu[i].special){
					document.getElementById("select_verdiepingen").value = i;
					_doSelect(document.getElementById("select_verdiepingen").value);
				}
			}
		}
		*/
		/*
		var index = dropdown.value;
		console.log("Sanoma.Menu._selectRoute(" + dropdown.id + ")"+index);
		if (index) {
			_selectedRoute = _currentMenu[index];
			_selectedRouteName = _formatName(_currentMenu[index].name);
			HOSPITALS.MapsContainer.selectRoute(_selectedRoute);

		}

		if (dropdown.id == "select_vergaderzalen") {
			document.getElementById("select_verdiepingen").selectedIndex = 0;
		} else {
			document.getElementById("select_vergaderzalen").selectedIndex = 0;
		}
		*/
		//Core.debug.dir(_selectedRoute);
	}
	
	var _doSelect = function (dropdown) {
		
		var index = dropdown.value;
		console.log("Sanoma.Menu._doSelect(" + dropdown.id + ")"+index);
		if (index) {
			_selectedRoute = _currentMenu[index];
			_selectedRouteName = _formatName(_currentMenu[index].name);
			HOSPITALS.MapsContainer.selectRoute(_selectedRoute);

		}

		if (dropdown.id == "select_vergaderzalen") {
			document.getElementById("select_verdiepingen").selectedIndex = 0;
		} else {
			document.getElementById("select_vergaderzalen").selectedIndex = 0;
		}
		
		//Core.debug.dir(_selectedRoute);
	}
	

	var _public = {
		initMenu: function (routes) {
			_initMenu(routes)
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
		// Preloader
		// CanvasLoader
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
		HOSPITALS.Model.floorMargin = 5;
		//TweenLite.from(document.getElementById("logo"), 0.5, {css:{autoAlpha:0, right:"0px"}});
		HOSPITALS.MapsContainer.init();

		HOSPITALS.Controller.loadJSON(function () {
			Sanoma.Menu.initMenu(HOSPITALS.Model.routes())

			HOSPITALS.Controller.loadFloors(function () {
				//Sanoma.Menu.initMenu(HOSPITALS.Model.routes())
				Core.debug.info("Floors Loaded");
				_initComplete();
			})
		});
	}


	var _initComplete = function () {
		//	
		var preloader = document.getElementById("preloaderSpinner");
		document.getElementById('application').removeChild(preloader);
		//document.getElementById('Core31415926535897932384626433832preload').innerHTML="";
		Core.managers.NavigationManager.showAsset(Sanoma.Setup.content.Home);
		Core.managers.NavigationManager.showAsset(Sanoma.Setup.content.Menu);

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