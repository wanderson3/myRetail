# myRetail Server
Node.js api POC for myRetail. 



## Usage
supports GET and PUT at /api/products/prod_id
GET request returns product id, name, price, and currency_code
PUT updates the price and currency_code

server.js starts the Node.js POC server. The server currently runs on port 8080 on localhost.
Code was developed using Eclipse Neon.  To run locally you can use eclipse and node.js plugin and run server.js file as node.js application.
To execute test script verify mocha is available, open command prompt and default project directory, and run "mocha".  If everything is setup correctly it should start test suite. 

If everything is correct you should see output like:

  Product API - PUT
    Update price using PUT - invalid price (40ms)

  Product API - PUT
    Update price using PUT (208ms)


  15 passing (1s)
  
  
  
## Developing
Express.js framework used to create server.
Test suite based on Mocha, SuperTest, async, and should


ServerTest.js contains all test cases

You will need to create a myretail keyspace in cassandra.
cassandra.sql contains CQL to create and populate test data.



### Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

 