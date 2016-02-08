export default function errorHandler($rootScope, $state, notification) {
    $rootScope.$on("$stateChangeError", function handleError(event, toState, toParams, fromState, fromParams, error) {
        
    });
}

errorHandler.$inject = ['$rootScope', '$state', 'notification'];
