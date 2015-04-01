SCOPE=null;

angular.module('todoApp', ['AngularXmpp'])
  .controller('TodoListController', function($scope,Xmpp,PubsubFactory) {
    SCOPE=$scope;
    $scope.count=0;
    $scope.server="pubsub.localhost";
    $scope.node="test2";
    var jid='test1@localhost';
    var password='bbb';

    var xmpp = new Xmpp("http://localhost:3000/");

    xmpp.watch().then(function(data) {
        console.warn("XMPP END - should never be reached","font-size:40px");
    }, function(error) {
        console.log("error", error);
    }, function(notification) {
        console.log("xmpp update", notification);
        $scope.count++;
    });

    xmpp.send('xmpp.login',{jid:jid,password:password,resource:'pubsubtest'}).then(function(){
        $scope.pubsub= new PubsubFactory(xmpp);
        $scope.pubsub.send( 'xmpp.pubsub.retrieve', { 'to': $scope.server, 'node': $scope.node})
        xmpp.send("xmpp.presence");

    });

    $scope.add=function(text){
        var content={ 'to': $scope.server, 'node': $scope.node, 'content': text}
        console.log(content);
        $scope.pubsub.send("xmpp.pubsub.publish",content);
    }

    $scope.archive=function(){
        var items=$scope.pubsub.data.server[$scope.server][$scope.node].items;
          angular.forEach(items, function(todo) {
            if (todo.done){
                var stanza={ 'to': $scope.server, 'node': $scope.node,'id':todo.id};
                $scope.pubsub.send( 'xmpp.pubsub.item.delete',stanza);
            }
          });
    }

    $scope.remaining = function() {
      var count = 0;
      var items=$scope.pubsub.data.server[$scope.server][$scope.node].items;

      angular.forEach(items, function(todo) {
        count += todo.done ? 0 : 1;
      });
      return count;
    };


  });
