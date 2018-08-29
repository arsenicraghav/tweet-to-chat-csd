var isDlgOpen;

angular.module('app', ['ngMaterial', 'ngMessages', 'app.endpoints', 'angular-simple-chat'])
    .controller('AppCtrl', function ($scope, $rootScope, $mdToast, TokenService) {

        $scope.results = [];
        $scope.user = {
            email: ''
        };
        $scope.accountImage = '';
        $scope.accountName = '';
        $scope.accountId = '';
        $scope.you = {
            userId: $scope.accountId,
            avatar: $scope.accountImage,
            userName: $scope.accountName
        };

        $scope.messages = [];

        $scope.sendMessage = function (message) {
            console.log('sendMessage');
            console.log($scope.you);
        };

        $scope.$on('simple-chat-message-posted', function () {
            console.log('onMessagePosted');
            console.log($scope.you);
        });
        $scope.setYou = function (id, displayName) {
            $scope.accountId = id;
            $scope.accountName = displayName;
            $scope.accountImage = 'https://thumbs.dreamstime.com/b/social-media-avatar-user-icon-115826614.jpg';
            $scope.you = {
                userId: $scope.accountId,
                userName: $scope.accountName,
                avatar: $scope.accountImage,
            }
            $scope.$apply();
        };
        $scope.activityConnect = function (socket_host, activity_event, id) {
            var socket = io.connect(socket_host);
            socket.on(activity_event, function (data) {
                console.log(data.event);
                console.log({
                    id: data.event.tweet_create_events[0].id_str,
                    text: data.event.tweet_create_events[0].text,
                    userId: data.event.tweet_create_events[0].user.id_str,
                    userName: data.event.tweet_create_events[0].user.name,
                    avatar: data.event.tweet_create_events[0].user.profile_image_url_https,
                    date: data.event.tweet_create_events[0].created_at
                });
                $scope.messages.push({
                    id: data.event.tweet_create_events[0].id_str,
                    text: data.event.tweet_create_events[0].text,
                    userId: data.event.tweet_create_events[0].user.id_str,
                    userName: data.event.tweet_create_events[0].user.name,
                    avatar: data.event.tweet_create_events[0].user.profile_image_url_https,
                    date: data.event.tweet_create_events[0].created_at
                });
                $scope.$apply();
            });
            socket.emit('accountID', {id: id});
        };
        $scope.showAdvanced = function (ev) {
            TokenService.sendToken($scope.user.email).then(function (res) {
                console.log(res);
                if (res && res.hasOwnProperty("result") && res.result === "success") {
                    $mdToast.show({
                        hideDelay: 3000,
                        position: 'top right',
                        controller: 'ToastCtrl',
                        templateUrl: 'toast-template.html'
                    });
                }
            });
        };
    })
    .controller('ToastCtrl', function ($scope, $mdToast, $mdDialog) {

        $scope.closeToast = function () {
            if (isDlgOpen) return;

            $mdToast
                .hide()
                .then(function () {
                    isDlgOpen = false;
                });
        };

        $scope.openMoreInfo = function (e) {
            if (isDlgOpen) return;
            isDlgOpen = true;

            $mdDialog
                .show($mdDialog
                    .alert()
                    .title('Login Link Sent')
                    .textContent('Please check your inbox and click on the link provided')
                    .ariaLabel('More info')
                    .ok('Got it')
                    .targetEvent(e)
                )
                .then(function () {
                    isDlgOpen = false;
                });
        };
    });