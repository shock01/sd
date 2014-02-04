describe('SDViewBoxViewSpec', function() {

    // TODO unit test event dispatching
    // TODO unit test preventDefault on events

    var view;
    var svg;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/base/test/resources/ViewBoxView.xml', false);
    xhr.send(null);
    var xml = xhr.responseText;

    beforeEach(function() {
        view = new SDViewBoxView();
        svg = document.body.appendChild(new DOMParser().parseFromString(xml, 'text/xml').documentElement);
    });

    it('should be defined', function() {
        expect(view).toBeDefined();
    })

    afterEach(function() {
        svg.parentNode.removeChild(svg);
    })

    describe('scenario 1 (no viewBox defined)', function() {
        beforeEach(function() {
            view.attach(svg.getElementById('scenario-1'));
            view.prepare();
        })
        it('should have x set to 0', function() {
            expect(view.x).toBe(0);
        });
        it('should have y set to 0', function() {
            expect(view.y).toBe(0);
        });
        it('should have width set to 400', function() {
            expect(view.width).toBe(400);
        });
        it('should have height set to 400', function() {
            expect(view.height).toBe(400);
        });

        describe('Origin center', function() {
            beforeEach(function() {
                view.zoomOrigin = SDOrigin.CENTER;
            })
            describe('zoom in', function() {
                it('should update the viewbox', function() {
                    var result = view.zoom(2.0);
                    expect(result).toEqual({
                        width: 200,
                        height: 200,
                        x: 100,
                        y: 100
                    });
                });
            });

            describe('zoom out', function() {
                it('should update the viewBox', function() {
                    var result = view.zoom(0.5);
                    expect(result).toEqual({
                        width: 800,
                        height: 800,
                        x: -200,
                        y: -200
                    });
                });
            });
        });

        describe('Origin top left', function() {
            beforeEach(function() {
                view.zoomOrigin = SDOrigin.TOPLEFT;
            })
            describe('zoom in', function() {
                it('should update the viewbox', function() {
                    var result = view.zoom(2.0);
                    expect(result).toEqual({
                        width: 200,
                        height: 200,
                        x: 0,
                        y: 0
                    });
                });
            });

            describe('zoom out', function() {
                it('should update the viewBox', function() {
                    var result = view.zoom(0.5);
                    expect(result).toEqual({
                        width: 800,
                        height: 800,
                        x: 0,
                        y: 0
                    });
                });
            });
        })

        describe('Origin top', function() {
            beforeEach(function() {
                view.zoomOrigin = SDOrigin.TOP;
            })
            describe('zoom in', function() {
                it('should update the viewbox', function() {
                    var result = view.zoom(2.0);
                    expect(result).toEqual({
                        width: 200,
                        height: 200,
                        x: 100,
                        y: 0
                    });
                });
            });

            describe('zoom out', function() {
                it('should update the viewBox', function() {
                    var result = view.zoom(0.5);
                    expect(result).toEqual({
                        width: 800,
                        height: 800,
                        x: -200,
                        y: 0
                    });
                });
            });
        })

        describe('Origin top right', function() {
            beforeEach(function() {
                view.zoomOrigin = SDOrigin.TOPRIGHT;
            })
            describe('zoom in', function() {
                it('should update the viewbox', function() {
                    var result = view.zoom(2.0);
                    expect(result).toEqual({
                        width: 200,
                        height: 200,
                        x: 200,
                        y: 0
                    });
                });
            });

            describe('zoom out', function() {
                it('should update the viewBox', function() {
                    var result = view.zoom(0.5);
                    expect(result).toEqual({
                        width: 800,
                        height: 800,
                        x: -400,
                        y: 0
                    });
                });
            });
        })

        describe('Origin right', function() {
            beforeEach(function() {
                view.zoomOrigin = SDOrigin.RIGHT;
            })
            describe('zoom in', function() {
                it('should update the viewbox', function() {
                    var result = view.zoom(2.0);
                    expect(result).toEqual({
                        width: 200,
                        height: 200,
                        x: 200,
                        y: 100
                    });
                });
            });

            describe('zoom out', function() {
                it('should update the viewBox', function() {
                    var result = view.zoom(0.5);
                    expect(result).toEqual({
                        width: 800,
                        height: 800,
                        x: -400,
                        y: -200
                    });
                });
            });
        })

        describe('Origin bottom right', function() {
            beforeEach(function() {
                view.zoomOrigin = SDOrigin.BOTTOMRIGHT;
            })
            describe('zoom in', function() {
                it('should update the viewbox', function() {
                    var result = view.zoom(2.0);
                    expect(result).toEqual({
                        width: 200,
                        height: 200,
                        x: 200,
                        y: 200
                    });
                });
            });

            describe('zoom out', function() {
                it('should update the viewBox', function() {
                    var result = view.zoom(0.5);
                    expect(result).toEqual({
                        width: 800,
                        height: 800,
                        x: -400,
                        y: -400
                    });
                });
            });
        })

        describe('Origin bottom', function() {
            beforeEach(function() {
                view.zoomOrigin = SDOrigin.BOTTOM;
            })
            describe('zoom in', function() {
                it('should update the viewbox', function() {
                    var result = view.zoom(2.0);
                    expect(result).toEqual({
                        width: 200,
                        height: 200,
                        x: 100,
                        y: 200
                    });
                });
            });

            describe('zoom out', function() {

                it('should update the viewBox', function() {
                    var result = view.zoom(0.5);
                    expect(result).toEqual({
                        width: 800,
                        height: 800,
                        x: -200,
                        y: -400
                    });
                });
            });
        })

        describe('Origin bottom left', function() {
            beforeEach(function() {
                view.zoomOrigin = SDOrigin.BOTTOMLEFT;
            })
            describe('zoom in', function() {
                it('should update the viewbox', function() {
                    var result = view.zoom(2.0);
                    expect(result).toEqual({
                        width: 200,
                        height: 200,
                        x: 0,
                        y: 200
                    });
                });
            });

            describe('zoom out', function() {
                it('should update the viewBox', function() {
                    var result = view.zoom(0.5);
                    expect(result).toEqual({
                        width: 800,
                        height: 800,
                        x: 0,
                        y: -400
                    });
                });
            });
        })

        describe('Origin left', function() {
            beforeEach(function() {
                view.zoomOrigin = SDOrigin.LEFT;
            })
            describe('zoom in', function() {
                it('should update the viewbox', function() {
                    var result = view.zoom(2.0);
                    expect(result).toEqual({
                        width: 200,
                        height: 200,
                        x: 0,
                        y: 100
                    });
                });
            });

            describe('zoom out', function() {
                it('should update the viewBox', function() {
                    var result = view.zoom(0.5);
                    expect(result).toEqual({
                        width: 800,
                        height: 800,
                        x: 0,
                        y: -200
                    });
                });
            });
        })
        describe('pan horizontal', function() {
            var result;
            it('should have the x property set to -10', function() {
                result = view.pan(-10, 0);
                expect(result.x).toBe(-10);
            });
            it('should have the x property set to 10', function() {
                result = view.pan(10, 0);
                expect(result.x).toBe(10);
            });
        })
        describe('pan vertical', function() {
            var result;
            it('should have the y property set to -10', function() {
                result = view.pan(0, -10);
                expect(result.y).toBe(-10);
            });
            it('should have the y property set to 10', function() {
                result = view.pan(0, 10);
                expect(result.y).toBe(10);
            });
        })
    });

    describe('scenario 2 (viewBox defined)', function() {
        beforeEach(function() {
            view.attach(svg.getElementById('scenario-2'));
            view.prepare();
        })
        it('should have x set to 50', function() {
            expect(view.x).toBe(50);
        });
        it('should have y set to 50', function() {
            expect(view.y).toBe(50);
        });
        it('should have width set to 500', function() {
            expect(view.width).toBe(500);
        });
        it('should have height set to 500', function() {
            expect(view.height).toBe(500);
        });
    });
})
