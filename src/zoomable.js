angular.module('sd').directive('sdZoomable', ['$log', function ($log) {
	function Zoomable(x, y, width, height) {
	  this.x = x;
	  this.y = y;
	  this.width = width;
	  this.height = height;
	  
	  this.svgSvgElement = null;
	  this.currentViewBox = null;
	}
	
	Zoomable.prototype = {
		prepare: function () {
		  this.currentViewBox = {
			  x: parseFloat(this.x),
			  y: parseFloat(this.y),
			  width: parseFloat(this.width),
			  height: parseFloat(this.height)
		  }
		},
		zoom: function (factor) {
		  
		  var width = this.width / factor,
		  	height = this.height / factor,
		  	x = parseFloat(this.x),
		  	y = parseFloat(this.y),
		  	viewBox;
		  
		  $log.debug('Zoomable factor', factor);
		  
		  if(this.width > this.currentViewBox.width) {
			x = 0;
		  } else {
			x = this.x + (this.width - width) /2;
		  }
		  
		  if(this.height > this.currentViewBox.height) {
			y = 0;
		  } else {
			y = this.y + (this.height - height) /2 	
		  }
		  
		  viewBox = {
			x: x,
			y: y,
			width: width,
			height: height
		  };
		  
		  this.currentViewBox = viewBox;
		  return viewBox;
		},
	
		commit: function () {
		  this.x = this.currentViewBox.x;
		  this.y = this.currentViewBox.y;
		  this.width = this.currentViewBox.width;
		  this.height = this.currentViewBox.height;
		}
	}
  return {
	compile: function compile(tElement, tAttrs, transclude) {
	  
	  var zoomable = new Zoomable(),
	  		eventHandler = {
			'handleEvent': function (event) {
			  switch(event.type) {
			  case 'pinch':
				 var scale = event.gesture.scale,
				 	viewBox = zoomable.zoom(scale);
				 
				zoomable.svgSvgElement.setAttributeNS(null, 'viewBox', [viewBox.x, viewBox.y, viewBox.width, viewBox.height].join(' '));
				break;
			  case 'transformstart':
				zoomable.prepare();
				break;
			  case 'transformend':
				zoomable.commit();
				break;
			  	default:
			  }
			}
	  };
	  
	  return function postLink(scope, iElement, iAttrs, controller) {
		
		var element = iElement[0],
			viewBox;
		if(!(element instanceof SVGSVGElement)) {
		  throw 'Hey you, please use an svg element for zoomable!';
		}
		
		Hammer(element);
		
		viewBox = element.viewBox.baseVal;
		zoomable.svgSvgElement = element;
		zoomable.x = viewBox.x;
		zoomable.y = viewBox.y;
		zoomable.width = viewBox.width || element.width.baseVal.value;
		zoomable.height = viewBox.height || element.height.baseVal.value;
		
		element.addEventListener('pinch', eventHandler,false);
		element.addEventListener('transformstart', eventHandler, false);
		element.addEventListener('transformend', eventHandler, false);
		
		scope.$on('$destroy', function () {
		  element.removeEventListener('pinch', eventHandler, false);
		  element.removeEventListener('transformstart', eventHandler, false);
		  element.removeEventListener('transformend', eventHandler, false);
		});
		
	  }
	}
  }
}]);