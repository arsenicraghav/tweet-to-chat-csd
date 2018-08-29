
angular.module( 'app.endpoints', [

    ])
    .factory('TokenService',['$http', '$q', function($http, $q){
        return {
            sendToken : function(email){
                var deferred = $q.defer();
                $http.post('/sendtoken', {user : email}, {}).then(function (resp) {
                    deferred.resolve(resp.data);
                }, function (resp) {
                    deferred.reject(resp.data);
                });
                return deferred.promise;
            }
        }
    }]);