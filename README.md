TodoMVC
----------

UI Based on 
https://jsfiddle.net/api/post/library/pure/

Technic
-----------
* A websockets is opened to xmpp-ftw
* todo items are stored in pubsub

Defaults:
-----------
* xmpp-ftw host: http://localhost:3000
* Login to xmpp server with jid:"test1@localhost" and password:"bbb"
* pubsub server:"pubsub.localhost" node:"test2"

Install
---------
* You need xmpp-ftw running
* The jabber server must have pubsub implemented
* Tested with ejabberd

Test
----
Open page in two browser windows, they should be in sync.
