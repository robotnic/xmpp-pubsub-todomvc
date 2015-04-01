"use strict";
var SCOPE = null; //debug only

angular.module('todoApp', ['AngularXmpp','XmppForm'])
    .controller('TodoListController', function($scope, Xmpp, PubsubFactory) {
        //for debug
        SCOPE = $scope; 
        $scope.count = 0;

        //settings
        $scope.server = "pubsub.localhost";
        $scope.node = "test2";
        var jid = 'test1@localhost';
        var password = 'bbb';
        var resource=Math.random();
        var xmpp = new Xmpp("http://localhost:3000/");

        //angular promise
        xmpp.watch().then(function(data) {
            console.warn("XMPP END - should never be reached", "font-size:40px");
        }, function(error) {
            console.log("error", error);
        }, function(notification) {
            console.log("xmpp update", notification);
            $scope.count++;
        });

        //login -> get todo list from pubsub -> set presence for 
        xmpp.send('xmpp.login', {
            jid: jid,
            password: password,
            resource: resource
        }).then(function() {
            $scope.pubsub = new PubsubFactory(xmpp);
            $scope.pubsub.send('xmpp.pubsub.retrieve', {
                'to': $scope.server,
                'node': $scope.node
            })

            //todo: check if already subscribed
            $scope.pubsub.send( 'xmpp.pubsub.subscribe', { 'to': $scope.server, 'node': $scope.node,'jid':jid+"/"+resource})
            $scope.pubsub.send( 'xmpp.pubsub.config.get', { 'to': $scope.server, 'node': $scope.node})

            xmpp.send("xmpp.presence");

        });

        $scope.add = function(text) {
            var content = {
                'to': $scope.server,
                'node': $scope.node,
                'content': text
            }
            console.log(content);
            $scope.pubsub.send("xmpp.pubsub.publish", content);
        }

        $scope.archive = function() {
            var items = $scope.pubsub.data.server[$scope.server][$scope.node].items;
            angular.forEach(items, function(todo) {
                if (todo.done) {
                    var stanza = {
                        'to': $scope.server,
                        'node': $scope.node,
                        'id': todo.id
                    };
                    $scope.pubsub.send('xmpp.pubsub.item.delete', stanza);
                }
            });
        }

        $scope.remaining = function() {
            var count = 0;
            try {
                var items = $scope.pubsub.data.server[$scope.server][$scope.node].items;

                angular.forEach(items, function(todo) {
                    count += todo.done ? 0 : 1;
                });
                return count;
            } catch (e) {
                return 0;
            }
        };


        //pubsub config
         $scope.saveconfig=function(formdata){
                console.log("save config",$scope.pubsub.data.server[$scope.server][$scope.node].config.fields);
                $scope.pubsub.send( 'xmpp.pubsub.config.set', { "to": $scope.server, "node":  $scope.node,"form":formdata });
        }

    });
