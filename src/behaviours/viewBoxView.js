angular.module('sd').factory('sdViewBoxViewFactory', function() {
    return {
        build: function(element) {
            var instance = new SDViewBoxView();
            instance.attach(element);
            return instance;
        }
    }
});

angular.module('sd').directive('sdViewBoxView', ['$log', 'sdViewBoxViewFactory',
    function($log, sdViewBoxViewFactory) {
        return {
            restrict: 'A',

            scope: {
                zoomable: '=sdZoomable',
                pannable: '=sdPannable',
                origin: '=sdOrigin'
            },

            compile: function compile(tElement, tAttrs, transclude) {

                return function postLink(scope, iElement, iAttrs, controller) {

                    var view = sdViewBoxViewProvider.build(iElement[0]);

                    scope.$watch('zoomable', function(newValue, oldValue) {
                        $log.debug('Enabling zoom', newValue);
                        view.enableZoom(newValue);
                    });

                    scope.$watch('pannable', function(newValue, oldValue) {
                        $log.debug('Enabling pan', newValue);
                        view.enablePan(newValue);
                    })

                    scope.$watch('origin', function(newValue, oldValue) {
                        $log.debug('Setting zoom origin', newValue);
                        view.zoomOrigin = SDOrigin[newValue];
                    })

                    scope.$on('$destroy', function() {
                        view.destroy();
                    });

                }
            }
        }
    }
]);
