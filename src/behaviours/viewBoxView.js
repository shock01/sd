angular.module('sd').factory('sdViewBoxViewProvider', function() {
    return {
        build: function(element) {
            var instance = new SDViewBoxView();
            instance.attach(element);
            return instance;
        }
    }
});

angular.module('sd').directive('sdViewBoxView', ['$log', 'sdViewBoxViewProvider',
    function($log, sdViewBoxViewProvider) {
        return {
            compile: function compile(tElement, tAttrs, transclude) {

                return function postLink(scope, iElement, iAttrs, controller) {

                    var view = sdViewBoxViewProvider.build(iElement[0]);

                    scope.$on('$destroy', function() {
                        view.destroy();
                    });

                }
            }
        }
    }
]);
