angular.module("angular-simple-chat.directives").run(["$templateCache", function($templateCache) {$templateCache.put("directives/chat-bubble/chat-bubble.html","<div ng-if=\"cb.localUser.userId !== cb.message.userId\">\n    <img class=\"profile-avatar left\"\n        ng-src=\"{{cb.message.avatar}}\"\n        ng-if=\"cb.options.showUserAvatar\"/>\n    <div class=\"chat-bubble-container left\"\n        ng-class=\"{\'reset-margin-left\': !cb.options.showUserAvatar}\">\n        <div class=\"message-detail\" ng-if=\"cb.options.showBubbleInfos\">\n            <b>{{cb.message.userName}}, </b>\n            <span am-time-ago=\"cb.message.date\"></span>\n        </div>\n        <div class=\"chat-bubble left\">\n            <div class=\"message\">{{cb.message.text}}</div>\n        </div>\n    </div>\n</div>\n<div ng-if=\"cb.localUser.userId === cb.message.userId\">\n    <img class=\"profile-avatar right\"\n        ng-src=\"{{cb.localUser.avatar}}\"\n        ng-if=\"cb.options.showUserAvatar\"/>\n    <div class=\"chat-bubble-container right\"\n        ng-class=\"{\'reset-margin-right\': !cb.options.showUserAvatar}\">\n        <div class=\"message-detail\" ng-if=\"cb.options.showBubbleInfos\">\n            <b>{{cb.localUser.userName}}, </b>\n            <span am-time-ago=\"cb.message.date\"></span>\n        </div>\n        <div class=\"chat-bubble right\">\n            <div class=\"message\">{{cb.message.text}}</div>\n        </div>\n    </div>\n</div>\n");
$templateCache.put("directives/message-composer/message-composer.html","<form name=\"composeForm\">\n    <textarea ng-attr-placeholder=\"{{mc.composerPlaceholderText || \'Write your message here.\'}}\"\n            ng-model=\"mc.rawmessage\"\n            name=\"message\"\n            vo-key-up\n            on-key-up=\"mc._onKeyUp()\"\n            on-enter-key=\"mc._send()\"\n            options=\"mc.options\"\n            ng-required=\"true\"></textarea>\n    <button ng-click=\"mc._send()\"\n        ng-disabled=\"composeForm.$invalid\">{{mc.sendButtonText || \'Send\'}}</button>\n</form>\n");
$templateCache.put("directives/simple-chat/simple-chat.html","<div class=\"simple-chat-container\"\n    ng-class=\"{\'full-height\': !sc.options.showComposer}\">\n    <div ng-repeat=\"message in sc.messages track by message.id\" class=\"message-wrapper\">\n        <chat-bubble\n            message=\"message\"\n            class=\"chat-bubble-main-container\"\n        ></chat-bubble>\n    </div>\n</div>\n<message-composer\n    ng-if=\"sc.options.showComposer\"\n></message-composer>\n");}]);