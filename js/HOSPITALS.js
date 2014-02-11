HOSPITALS = {};
HOSPITALS.Model = (function() {
	var _settings 	= false;
	var _floors 	= false;
	var _icons 		= false;
	var _routes 	= false;
	var _floorMargin = 0;
	
	var _setData = function(data){
		_floors 	= data.floors;
		_settings 	= data.settings;
		_icons 		= data.icons;
		_routes 	= data.routes;
		_setFloors();
	}
    
    var _getData = function(){
        return _settings;
    }
	
	var _setFloors = function(){
	//	Core.debug.dir(_floors);
		if (_floors.length>0){
			for(var i=0;i<_floors.length;i++){
				_floors[i].loaded = false;
			}
		}
	}
	
	var _getFloorById = function(id){
		for(var i=0; i<_floors.length;i++){
			if (id == _floors[i].id){
				return _floors[i];
			}
		}
		return false;
	}


	
	var _public = {
		setData: function(data){_setData(data)},
		getData: function(data){return _getData()},
		settings: function(){return _settings},
		floors: function(){return _floors},
		icons: function(){return _icons},
		routes: function(){return _routes},
		floorMargin: _floorMargin,
		getFloorById: function(id){return _getFloorById(id)}
	}
	return _public;
})(); 

HOSPITALS.Controller = (function() {
	var _currentLoadedFloor = 0;
	var _currentLoadedIcon = 0;
	var _iconOffsetX = 0;//-9;
	var _iconOffsetY = 0;//-6;
	var _loadJSON = function(callback){
		_loader = Core.net.Loader();
		_loader.setType("GET");
		_loader.setUrl("json/application.json");
		_loader.execute(function(loader){
			var _data 	= eval("("+loader.getText()+")");
            Array.prototype.naturalSort= function(){
                var a, b, a1, b1, rx=/(\d+)|(\D+)/g, rd=/\d+/;
                return this.sort(function(as, bs){
                    a= String(as).toLowerCase().match(rx);
                    b= String(bs).toLowerCase().match(rx);
                    while(a.length && b.length){
                        a1= a.shift();
                        b1= b.shift();
                        if(rd.test(a1) || rd.test(b1)){
                            if(!rd.test(a1)) return 1;
                            if(!rd.test(b1)) return -1;
                            if(a1!= b1) return a1-b1;
                        }
                        else if(a1!= b1) return a1> b1? 1: -1;
                    }
                    return a.length- b.length;
                });
            }
            
            //console.log(_data.routes);
            /*
			_data.routes.sort(function(a,b){
				if(a.name<b.name) return -1;
				if(a.name>b.name) return 1;
				return 0;
			})
            */
            var dict = {};
            var nameList = [];
            var u;
            var newRoutes = [];
            for( u=0;u<_data.routes.length;u++){
            	dict[_data.routes[u].name] = _data.routes[u];
                nameList.push( _data.routes[u].name );
            }
            
            nameList.naturalSort();
            
            for( u=0;u<nameList.length;u++){
            	//console.log(nameList[u]);
                newRoutes.push(dict[nameList[u]]);
            }
            
            _data.routes = newRoutes;
            //console.log(nameList);
			
			HOSPITALS.Model.setData(_data);
			callback();
		});
	}

	var _getFLoorById = function(id){
		for(var i=0;i<HOSPITALS.Model.floors().length;i++){
			if (id == HOSPITALS.Model.floors()[i].id){
				return HOSPITALS.Model.floors()[i];
			}
		}
		return false;
	}
	
	var _loadFloors = function(callback){
		if (HOSPITALS.Model.floors()[_currentLoadedFloor] && !HOSPITALS.Model.floors()[_currentLoadedFloor].loaded && _currentLoadedFloor<HOSPITALS.Model.floors().length){
			_loadFloor(HOSPITALS.Model.floors()[_currentLoadedFloor],function(){
				_currentLoadedFloor++;
				_loadFloors(callback);
			})
		}else{
			if(callback){
				callback();
			}
		}
	}
	
	var _loadFloor = function(floor,callback){
		_currentLoadedIcon = 0;
		floor.canvas = document.createElement('canvas');
		floor.floorImg = document.createElement('img');
        
        
        
		floor.floorImg.onload = function(){
            //document.getElementById('logo').appendChild(floor.floorImg);
			var margin = HOSPITALS.Model.floorMargin;
			var floorRatio = floor.floorImg.height / floor.floorImg.width;
			var floorWidth = document.getElementById("application").offsetWidth - margin;
			
			if (floorWidth > floor.floorImg.width) {
				floorWidth = floor.floorImg.width;
			}
			var floorHeight = floorRatio * floorWidth;
            
            //console.log(floorHeight+" / "+floorWidth);
            //console.log(floor.floorImg.height+" / "+floor.floorImg.width);
            
            
			HOSPITALS.MapsContainer.setScaleRatio(floorWidth / floor.floorImg.width);
			
			floor.canvas.width = floorWidth;
			floor.canvas.height = floorHeight;
			floor.canvas.getContext("2d").drawImage(floor.floorImg,0,0,floorWidth,floorHeight);
            
            //document.getElementById('logo').appendChild(floor.canvas);
            //callback();
			_addIcon(floor,callback);
			
			/*
			floor.canvas.width = floor.floorImg.width/2;
			floor.canvas.height = floor.floorImg.height/2;
			floor.canvas.getContext("2d").drawImage(floor.floorImg,0,0);
			_addIcon(floor,callback);
			*/
		}
		floor.floorImg.src = "images/floors/"+floor.linkage+".png";
        
        
        /*
        floor.floorImg.onreadystatechange = function(){
            console.log("ready state change: "+floor.floorImg.readyState)
            if(floor.floorImg.readyState == 4 || floor.floorImg.readyState == "complete")
          {
            document.getElementById('logo').appendChild(floor.floorImg);
			var margin = HOSPITALS.Model.floorMargin;
			var floorRatio = floor.floorImg.height / floor.floorImg.width;
			var floorWidth = document.getElementById("application").offsetWidth - margin;
			
			if (floorWidth > floor.floorImg.width) {
				floorWidth = floor.floorImg.width;
			}
			var floorHeight = floorRatio * floorWidth;
            
            console.log(floorHeight+" / "+floorWidth);
            console.log(floor.floorImg.height+" / "+floor.floorImg.width);
            
            
			//HOSPITALS.MapsContainer.setScaleRatio(floorWidth / floor.floorImg.width);
			
			floor.canvas.width = floorWidth;
			floor.canvas.height = floorHeight;
			floor.canvas.getContext("2d").drawImage(floor.floorImg,0,0,floorWidth,floorHeight);
            
             document.getElementById('logo').appendChild(floor.canvas);
			_addIcon(floor,callback);
			
			
          }
		}
        * */
		/*
		_imgFloor1 = document.createElement('img');
		_imgFloor1.src = "images/floors/"+floor.floor.linkage+".png";
		
		*/
		//floor.loaded = true;
		//callback();
	}
/*
	var _loadIcon = function(){

	}
*/	
	var _addIcon = function(floor,callback){ // adds next item
		var _done = false;
        ////console.log(floor.icons)
		if (floor.icons[_currentLoadedIcon] && !floor.icons[_currentLoadedIcon].loaded && _currentLoadedIcon < floor.icons.length){
			floor.icons[_currentLoadedIcon].img = document.createElement('img');
			
			floor.icons[_currentLoadedIcon].img.onload = function(){
				////console.log(this.src+" Loaded: "+_currentLoadedIcon);
				//alert(floor.icons[_currentLoadedIcon].x+","+floor.icons[_currentLoadedIcon].y);
				/*
				floor.canvas.getContext("2d").drawImage(floor.icons[_currentLoadedIcon].img,
					floor.icons[_currentLoadedIcon].x+_iconOffsetX,
					floor.icons[_currentLoadedIcon].y+_iconOffsetY
				);
				*/
               // //console.log(floor.icons[_currentLoadedIcon].img)
				////console.log(floor.icons[_currentLoadedIcon].img.src+" / "+this.src)
				_done = _drawIcon(
					floor.canvas,
					floor.icons[_currentLoadedIcon].img,
					//floor.icons[_currentLoadedIcon].x+_iconOffsetX,
					//floor.icons[_currentLoadedIcon].y+_iconOffsetY,
					Math.round(floor.icons[_currentLoadedIcon].x - floor.icons[_currentLoadedIcon].img.width/2),
					Math.round(floor.icons[_currentLoadedIcon].y - floor.icons[_currentLoadedIcon].img.height/2),
                    //Math.round(floor.icons[_currentLoadedIcon].x - this.width/2),
					//Math.round(floor.icons[_currentLoadedIcon].y - this.height/2),
					floor.icons[_currentLoadedIcon].rotation
				);
				////console.log(_currentLoadedIcon+"/ "+floor.icons.length)
				_currentLoadedIcon++
				_addIcon(floor,callback);
			}
			floor.icons[_currentLoadedIcon].img.src = "images/icons/icon_"+floor.icons[_currentLoadedIcon].name+".png";
            //console.log("images/icons/icon_"+floor.icons[_currentLoadedIcon].name+".png LOADING "+_currentLoadedIcon);
		}else{
			floor.loaded = true;
			callback();
		}
		
	}

	var _drawIcon = function(canvas,img,x,y,angle){
		var context = canvas.getContext('2d');
		var old = false;
		if (old){
			context.drawImage(img,x,y);
		}else{
			
			var newX = x * HOSPITALS.MapsContainer.getScaleRatio();
			var newY = y * HOSPITALS.MapsContainer.getScaleRatio();
			var newWidth = img.width * HOSPITALS.MapsContainer.getScaleRatio();
			var newHeight = img.height * HOSPITALS.MapsContainer.getScaleRatio();
		
			context.save();
			context.translate(newX,newY);
			context.translate(newWidth/2,newHeight/2);
			angle = angle*Math.PI/180;
			context.rotate(angle);
			context.drawImage(img,0-(newWidth/2),0-(newHeight/2), newWidth, newHeight);
			context.rotate(0-angle);
			context.restore();
			
			/*context.save();
			context.translate(x,y);
			context.translate(img.width/2,img.height/2);
			angle = angle*Math.PI/180;
			context.rotate(angle);
			context.drawImage(img,0-(img.width/2),0-(img.height/2));
			context.rotate(0-angle);
			context.restore();*/
		}
		return true;
	}
	/*
	function drawIt(x,y,leAngle){
		//console.log("drawIt: "+leAngle)
		var context = cv.getContext('2d');
		context.save();
		// move the origin to 50, 35   
		context.translate(x, y); 
		 
		// now move across and down half the 
		// width and height of the image (which is 128 x 128)
		context.translate(imgStart.width/2, imgStart.height/2); 
		 
		var degrees = leAngle;
		var angle = degrees*Math.PI/180;//Math.PI / 4;
		// rotate around this point
		context.rotate(angle); 
		//console.info(angle);
		 
		// then draw the image back and up
		context.drawImage(imgStart, 0-(imgStart.width/2), 0-(imgStart.height/2));
		context.restore();
		//cv.getContext('2d').drawImage(imgStart,40,40);
	}
	*/
	
	var _public = {
		loadJSON: function(callback){_loadJSON(callback)},
		loadFloors: function(callback){_loadFloors(callback)},
		getFLoorById:_getFLoorById
	}
	return _public;
})(); 

HOSPITALS.MapsContainer = (function() {
	/*
	var c=document.getElementById("myCanvas");
	var ctx=c.getContext("2d");
	var img=document.getElementById("scream");
	ctx.drawImage(img,10,10);
	*/
	var _floor1 		= false;
	var _floor2 		= false;
	var _imgFloor1 		= false;
	var _imgFloor2 		= false;
	
	var _floor1Route 	= false;
	var _floor2Route 	= false;
	
	var _labelStart 	= false;
	var _labelEnd 		= false
	
	var _canvasFloor1 	= false;
	var _canvasFloor2	= false;

	var _toolTip		= false;

	var _arrow 			= false;
	var _arrowImg		= false;
	
	var _selectedRoute 	= false;

	var _timeline 		= false;
	
	var _scaleRatio		= 1;
	
	var _init = function(){
		Core.debug.info("HOSPITALS.MapsContainer._init");
		
		_floor1 		= document.getElementById("map1Image");
		_floor2 		= document.getElementById("map2Image");
		_floor1Route 	= document.createElement('canvas');//document.getElementById("map1Route");
		_floor2Route 	= document.createElement('canvas');
		_labelStart 	= document.getElementById('mapLabelStart');
		_labelEnd 		= document.getElementById('mapLabelEnd');
		_toolTip		= document.getElementById('tooltip');
		_arrow 			= document.getElementById('mapArrow');
		
		_setFloor1("fl59107f2c48f1faf3b92ec377d5b09698ac76785f4e7c64edb73beaf7d09ce013");
	}
	
	var _selectRoute = function(route){
		Core.debug.info("HOSPITALS.MapsContainer._selectRoute("+route.name+")");
		_selectedRoute = route;
		_setFloors();
		_drawRoute(route);
		_setLabels(route);
		_setToolTip(route);
		_loadArrow(route);
	}

	var _startEmpty = function(route){
		_selectedRoute = route;
		_setFloors();
	}

	var _loadArrow = function(route){
		
		var ctx = _arrow.getContext('2d');
		_arrow.width 	= 10
		_arrow.height 	= 10
		
		ctx.moveTo(0,0);
		ctx.lineTo(10,5);
		ctx.lineTo(0,10);
		//ctx.lineTo(0,0);
		ctx.fill();

		/*
		ctx.fillStyle="#FF0000";
  		ctx.fillRect(0,0,10,10);
		*/

		// sophisticunt.com

  		/*
  		var context = _floor1Route.getContext('2d');
		context.beginPath();
		context.lineWidth = 1;
		context.strokeStyle = '#ff0000';
		context.moveTo(route.points[0].x, route.points[0].y);
		for(var i=0;i<route.points.length;i++){
			context.lineTo(route.points[i].x, route.points[i].y);
			if(i<(route.points.length-2) &&  route.points[i].floorId !=route.points[i+1].floorId){
				context.stroke();
		
  		*/
  		
		_floor1.appendChild(_arrow);
		//_startAnimation(route);
		/*
		_arrowImg 			= document.createElement('img');
		_arrowImg.onload = function(){
			_arrow.getContext('2d').drawImage(_arrowImg,0,0);
			_arrow.width 	= _arrowImg.width;
			_arrow.height 	= _arrowImg.height;
			_startAnimation(route);
		}
		_arrowImg.src = "images/arrow.png";
		*/
		_startAnimation(route);
	}
	
	var _startAnimationOnComplete = function() {
		if (_timeline) {
			_timeline.restart();
			
			if (_floor1) {
				if (_arrow) {
					_floor1.appendChild(_arrow);
				}
				if (_toolTip) {
					_floor1.appendChild(_toolTip);
				}
			}
		}
	}

	var _startAnimation = function(route){
		if (_timeline) {
			_timeline.kill();
		}
		_timeline			= new TimelineLite({onComplete:_startAnimationOnComplete});
		_timeline.append(TweenLite.delayedCall(0,
				function() {
				_floor1.appendChild(_arrow);
				//alert(_toolTip)
				//alert(document.getElementById("tooltiptext"))
				//_toolTip		= document.getElementById('tooltip');
				//console.log(route)
				_floor1.appendChild(_toolTip);
				document.getElementById("tooltiptext").innerHTML = route.floors[0].label;
			})
		);
		var arrowHeight 	= 10;
		var arrowWidth 		= 10;
		var arrowSpeed		= 5;
		var offsetY 		= 0;
		var offsetX 		= 0;
		_arrow.style.top 	= ((parseInt(route.points[0].y)+offsetY)-(arrowHeight/2)) * _scaleRatio +"px";
		_arrow.style.left 	= ((parseInt(route.points[0].x)+offsetX)-(arrowWidth/2)) * _scaleRatio +"px";
		_arrow.style.width  = arrowWidth * _scaleRatio + "px";
		_arrow.style.height = arrowHeight * _scaleRatio + "px";
		_arrow.style.rotationPoint = "50% 50%";
		//timeline.to(_arrow, 1, {css:{rotation:route.points[0].angleOut}});

		var isOnSecondFloor = false;

		var totalPoints = route.points.length;

		for (i=1;i<totalPoints;i++){
			//_timeline.to(_arrow, 1, {css:{top:route.points[i].y,left:route.points[i].x}});
			var duration = 1;
			if (i > 0) {
				var x1 = route.points[i].x;
				var x2 = route.points[i-1].x;
				var y1 = route.points[i].y;
				var y2 = route.points[i-1].y;
				var distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
				duration = distance / 10 / arrowSpeed;
				
			}

			

			var rotation = 0;
			if (route.points[i-1] && route.points[i-1].angleOut) {
				rotation = route.points[i-1].angleOut;
			}

			_timeline.append(TweenLite.to(_arrow, 0.00001, {css:{rotation:(rotation + "deg")}, ease:Linear.easeNone}));
			
			/*_timeline.append(TweenLite.to(_arrow, duration, {css:{top:((parseInt(route.points[i].y)+offsetY)-(arrowHeight/2)) * _scaleRatio,left:((parseInt(route.points[i].x)+offsetX)-(arrowWidth/2)) * _scaleRatio}, ease:Linear.easeNone}));*/
			_timeline.appendMultiple([
				TweenLite.to(_arrow, duration, {css:{top:((parseInt(route.points[i].y)+offsetY)-(arrowHeight/2)) * _scaleRatio,left:((parseInt(route.points[i].x)+offsetX)-(arrowWidth/2)) * _scaleRatio}, ease:Linear.easeNone}),
				TweenLite.to(_toolTip, duration, {css:{top:((parseInt(route.points[i].y)+offsetY)-(arrowHeight/2)) * _scaleRatio,left:((parseInt(route.points[i].x)+offsetX)-(arrowWidth/2)) * _scaleRatio}, ease:Linear.easeNone})
				]);
			
			
			////console.log('tween pos: ' + route.points[i].x + ", " + route.points[i].y + ", " + route.points[i].angleOut)

			if (i<totalPoints-2){
				if (route.points[i].floorId != route.points[i+1].floorId){
					_timeline.append(TweenLite.delayedCall(0,
						function() {
							_floor2.appendChild(_arrow);
							_floor2.appendChild(_toolTip);
							document.getElementById("tooltiptext").innerHTML = route.floors[1].label;
						})
					);
					//_floor2.appendChild(_arrow);
				}
			}
			
		}
		_timeline.play();


	}
	
	var _drawRoute = function(route){
		Core.debug.info("HOSPITALS.MapsContainer._drawRoute("+route.name+")");
		//Core.debug.dir(route);
		
		var baseFloor = true;
		
		_floor1Route.width = HOSPITALS.Model.getFloorById(route.floors[0].id).canvas.width;
		_floor1Route.height = HOSPITALS.Model.getFloorById(route.floors[0].id).canvas.height;
		_floor2Route.width = HOSPITALS.Model.getFloorById(route.floors[1].id).canvas.width;
		_floor2Route.height = HOSPITALS.Model.getFloorById(route.floors[1].id).canvas.height;
        
        _floor2Route.width = _floor2Route.width;
        _floor1Route.width = _floor1Route.width;
		//console.log("HOSPITALS.Model.getData()")
		//console.log(HOSPITALS.Model.getData())
		var context = _floor1Route.getContext('2d');
      // context.clearRect ( 0 , 0 , 600 , 600 );
		context.beginPath();
        context.clearRect ( 0 , 0 , 600 , 600 );
		context.lineWidth = parseInt(HOSPITALS.Model.getData().lineThickness);
        
        //console.log("DATAAA")
        //console.log(HOSPITALS.Model.getData())
		context.strokeStyle = '#'+parseInt(HOSPITALS.Model.getData().lineColor).toString(16);
		context.moveTo(route.points[0].x * _scaleRatio, route.points[0].y * _scaleRatio);
		for(var i=0;i<route.points.length;i++){
			context.lineTo(route.points[i].x * _scaleRatio, route.points[i].y * _scaleRatio);
			if(i<(route.points.length-2) &&  route.points[i].floorId !=route.points[i+1].floorId){
				context.stroke();
				context = _floor2Route.getContext('2d');	
                context.beginPath();
                context.clearRect ( 0 , 0 , 1000 , 1000 );
				context.lineWidth = parseInt(HOSPITALS.Model.getData().lineThickness);
		          context.strokeStyle = '#'+parseInt(HOSPITALS.Model.getData().lineColor).toString(16);
				context.moveTo(route.points[i].x * _scaleRatio, route.points[i].y * _scaleRatio);
			}
		}

		context.stroke();
		_floor1.appendChild(_floor1Route);
		_floor1Route.className = "mapContent";	
		_floor2.appendChild(_floor2Route);
		_floor2Route.className = "mapContent";	
		/*
		HOSPITALS.Model.getFloorById(route.floors[0].id).canvas
		_floor1Route.width = HOSPITALS.Model.getFloorById(route.floors[0].id).canvas.width;
		_floor1Route.height = HOSPITALS.Model.getFloorById(route.floors[0].id).canvas.height;

		var context = _floor1Route.getContext('2d');
		context.beginPath();
		context.lineWidth = 1;
		context.moveTo(route.points[0].x, route.points[0].y);
		for(var i=0;i<route.points.length;i++){
			context.lineTo(route.points[i].x, route.points[i].y);
			//console.log(route.points[i].x+","+ route.points[i].y);
			////console.error(i)
		}
		context.strokeStyle = '#ff0000';
		context.stroke();
		_floor1.appendChild(_floor1Route);
		_floor1Route.className = "mapContent";	
		*/
		
		
		// Destination icon
		var destImage = document.createElement('img');		
		destImage.onload = function(){
			/*_done = _drawIcon(
				floor.canvas,
				floor.icons[_currentLoadedIcon].img,
				//floor.icons[_currentLoadedIcon].x+_iconOffsetX,
				//floor.icons[_currentLoadedIcon].y+_iconOffsetY,
				Math.round(floor.icons[_currentLoadedIcon].x - floor.icons[_currentLoadedIcon].img.width/2),
				Math.round(floor.icons[_currentLoadedIcon].y - floor.icons[_currentLoadedIcon].img.height/2),
				floor.icons[_currentLoadedIcon].rotation
			);*/
			
			
			var newX = route.points[route.points.length-1].x * _scaleRatio;
			var newY = route.points[route.points.length-1].y * _scaleRatio;
			var newWidth = destImage.width * _scaleRatio;
			var newHeight = destImage.height * _scaleRatio;
		
			context.save();
			context.translate(newX,newY);
			context.translate(newWidth/2,newHeight/2);
			//angle = angle*Math.PI/180;
			//context.rotate(angle);
			context.drawImage(destImage,-newWidth,-newHeight, newWidth, newHeight);
			//context.rotate(0-angle);
			context.restore();
		}
		
		destImage.src = "images/icons/icon_destination.png";
	}

	var _setToolTip = function(route){
		_floor1.appendChild(_toolTip);
		
		//document.getElementById("tooltiptext").innerHTML = route.floors[0].label;
		_toolTip.innerHTML = '<div class="tooltipInner"><span id="tooltiptext">'+route.floors[0].label+'</span></div>';
		var left,top;
		left = route.points[0].x * _scaleRatio;
		top = route.points[0].y * _scaleRatio;
		_toolTip.style.top = top+"px";
		_toolTip.style.left = left+"px";
		
	}

	var _setLabels = function(route){
		// do from start / end point
		////console.log("setlabel ya tu sabe!")
		////console.dir(route);
		var f1 = route.floors[0];
		var f2 = route.floors[1];

		var leOffset = 10;
		var left,top,pos;
		var pos = "left"

		if (_labelStart){
			
			pos = f1.start.pos;
			_floor1.appendChild(_labelStart)
			//alert(_labelStart);
			//alert("Before: "+_labelStart.offsetWidth)
			_labelStart.innerHTML = f1.start.label;
			//alert("After: "+_labelStart.scrollWidth)
			left = route.points[0].x * _scaleRatio;
			top = route.points[0].y * _scaleRatio;

			left 	= left - (_labelStart.scrollWidth/2);
			top 	= top - (_labelStart.scrollHeight/2);
			
			if (pos =="up"){	
				top 	= top - (_labelStart.scrollHeight/2);
				top 	= top - leOffset;
			}else if (pos =="right"){
				left 	= left + (_labelStart.scrollWidth/2);
				left 	= left + leOffset;
			}else if (pos =="down"){
				top 	= top + (_labelStart.scrollHeight/2);
				top 	= top + leOffset;
			}else{ // left
				left 	= left - (_labelStart.scrollWidth/2);
				left 	= left - leOffset;
			}
			
			_labelStart.style.top = top+"px";
			_labelStart.style.left = left+"px";
			////console.dir(_labelStart);
			////console.dir(_labelStart.style);
			//alert(_labelStart.scrollWidth+","+_labelStart.scrollHeight);
			
			////console.dirxml(_labelStart)
			Core.debug.log("_setLabels - Start: "+top);
		}

		if (_labelEnd){
			//alert("LABELEND")
			if (route.floors.length ==2 && route.floors[0].id != route.floors[1].id){
				_floor2.appendChild(_labelEnd)
			}else{
				_floor1.appendChild(_labelEnd)	
			}
			
			pos = f1.end.pos;
			_labelEnd.innerHTML = f1.end.label;

			left = route.points[route.points.length-1].x * _scaleRatio;
			top = route.points[route.points.length-1].y * _scaleRatio;

			left 	= left- (_labelEnd.scrollWidth/2);
			top 	= top - (_labelEnd.scrollHeight/2);
			
			if (pos =="up"){	
				top 	= top - (_labelEnd.scrollHeight/2);
				top 	= top - leOffset;
			}else if (pos =="right"){
				left 	= left + (_labelEnd.scrollWidth/2);
				left 	= left + leOffset;
			}else if (pos =="down"){
				top 	= top + (_labelEnd.scrollHeight/2);
				top 	= top + leOffset;
			}else{ // left
				left 	= left - (_labelEnd.scrollWidth/2);
				left 	= left - leOffset;
			}

			_labelEnd.style.top = top+"px";
			_labelEnd.style.left = left+"px";

			
			
			Core.debug.log("_setLabels - End: "+f2.end.y);
		}
	}
	
	var _setFloors = function(){
		if (!_selectedRoute){
			return false;
		}

		_floor1.innerHTML = "";
		_floor2.innerHTML = "";
		if (_selectedRoute.floors.length ==2 && _selectedRoute.floors[0].id != _selectedRoute.floors[1].id){
			//not same
			
			_setFloor1(_selectedRoute.floors[0].id);
			_setFloor2(_selectedRoute.floors[1].id);
		}else{
			//same
			_setFloor1(_selectedRoute.floors[0].id);
			_setFloor2(false);
		}
	}
	
	var _setFloor1 = function(floorId){
		Core.debug.info("HOSPITALS.MapsContainer._setFloor1("+floorId+")");
		var floor = HOSPITALS.Model.getFloorById(floorId);
		if (!floor){return}
		_floor1.innerHTML = "";
		floor.canvas.className = "mapFloor";
		_floor1.appendChild(floor.canvas);
	}
	
	var _setFloor2 = function(floorId){
		Core.debug.info("HOSPITALS.MapsContainer._setFloor2("+floorId+")");
		var floor = HOSPITALS.Model.getFloorById(floorId);
		if (!floor){return}
		_floor2.innerHTML = "";
		floor.canvas.className = "mapFloor";
		_floor2.appendChild(floor.canvas);
	}
	
	/*
	var _setFloor2 = function(floor){
		if (!floor){
			_floor2.innerHTML = "";
			return false;
		}
		Core.debug.info("HOSPITALS.MapsContainer._setFloor2 -> PENDING");
		Core.debug.dir(floor)
	
		
		_imgFloor2 = document.createElement('img');
		_imgFloor2.src = "images/floors/"+HOSPITALS.Model.getFloorById(floor.id).linkage+".png";
		
		_imgFloor1.onload = function(){
			_canvasFloor2 = document.createElement('canvas');
			_canvasFloor2.id = "jatonFloor1";
			_canvasFloor2.width = _imgFloor1.width;
			_canvasFloor2.height = _imgFloor1.height;
			_canvasFloor2.getContext("2d").drawImage(_imgFloor2,0,0);
			_floor2.innerHTML = "";
			_floor2.appendChild(_canvasFloor2);
			Core.debug.info("HOSPITALS.MapsContainer._setFloor2 -> COMPLETE: "+_imgFloor2.width+"/"+_imgFloor2.height);
		}
	}
	*/
	/*
	var _getCanvasFloor1 = function(){
		if (!Core.dom.elementExists("jatonFloor1")){
			_canvasFloor1 = document.createElement('canvas');
			_canvasFloor1.id = "jatonFloor1";
			_canvasFloor1.width = _imgFloor1.width;
			_canvasFloor1.height = _imgFloor1.height;
			_canvasFloor1.getContext("2d").drawImage(_imgFloor1,0,0);
		}
	}
	*/
	
	
	var _public = {
		init: function(){_init();},
		selectRoute: function(route){_selectRoute(route);},
		startEmpty: function(route){_startEmpty(route);},
		getScaleRatio: function() { return _scaleRatio; },
		setScaleRatio: function(value) { _scaleRatio =  value; }
	}
	return (_public);
})(); 

//HOSPITALS.MapsContainer.init();