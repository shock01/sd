describe('SDViewBoxViewSpec', function () {
  
  // TODO unit test event dispatching
  // TODO unit test preventDefault on events
  
  var view;
  var svg;
  
  var xhr = new XMLHttpRequest();	
  xhr.open('GET', '/base/test/resources/ViewBoxView.xml', false);
  xhr.send(null);
  var xml = xhr.responseText;
  
  beforeEach(function () {
	view = new SDViewBoxView();
	svg = document.body.appendChild(new DOMParser().parseFromString(xml, 'text/xml').documentElement);
  });

  it('should be defined', function () {
	expect(view).toBeDefined();
  })  
  
  afterEach(function () {
	svg.parentNode.removeChild(svg);
  })

  describe('scenario 1 (no viewBox defined)', function () {
	  beforeEach(function () {
		view.attach(svg.getElementById('scenario-1'));
		view.prepare();
	  })
	  it('should have x set to 0', function () {
		expect(view.x).toBe(0);
	  });
	  it('should have y set to 0', function () {
		expect(view.y).toBe(0);
	  });
	  it('should have width set to 400', function () {
		expect(view.width).toBe(400);
	  });	
	  it('should have height set to 400', function () {
		expect(view.height).toBe(400);
	  });	 	  
	  
	  describe('zoom in', function () {
		var result;
		beforeEach(function () {
		  result = view.zoom(2.0);
		})
		it('should have width of viewbox set to 200', function () {
		  expect(result.width).toBe(200);
		});
		it('should have height of viewbox set to 200', function () {
		  expect(result.height).toBe(200);
		});
		it('should have x set to 100', function () {
		  expect(result.x).toBe(100);
		});
		it('should have y set to 100', function () {
		  expect(result.x).toBe(100);
		})
	  });
	  
	  describe('zoom out', function () {
		var result;
		beforeEach(function () {
		  result = view.zoom(0.5);
		})
		it('should have width of viewbox set to 200', function () {
		  expect(result.width).toBe(800);
		});
		it('should have height of viewbox set to 200', function () {
		  expect(result.height).toBe(800);
		});
		it('should have x set to 100', function () {
		  expect(result.x).toBe(-200);
		});
		it('should have y set to 100', function () {
		  expect(result.x).toBe(-200);
		})
	  });
	  
	  describe('pan horizontal', function () {
		var result;
		it('should have the x property set to -10', function () {
		  result = view.pan(-10,0);
		  expect(result.x).toBe(-10);
		});
		it('should have the x property set to 10', function () {
		  result = view.pan(10,0);
		  expect(result.x).toBe(10);
		});
	  })
	  describe('pan vertical', function () {
		var result;
		it('should have the y property set to -10', function () {
		  result = view.pan(0,-10);
		  expect(result.y).toBe(-10);
		});
		it('should have the y property set to 10', function () {
		  result = view.pan(0,10);
		  expect(result.y).toBe(10);
		});		
	  })
  });
  
  describe('scenario 2 (viewBox defined)', function () {
	  beforeEach(function () {
		view.attach(svg.getElementById('scenario-2'));
		view.prepare();
	  })
	  it('should have x set to 50', function () {
		expect(view.x).toBe(50);
	  });
	  it('should have y set to 50', function () {
		expect(view.y).toBe(50);
	  });
	  it('should have width set to 500', function () {
		expect(view.width).toBe(500);
	  });	
	  it('should have height set to 500', function () {
		expect(view.height).toBe(500);
	  });	 	  
  });  
})