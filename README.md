# myRetail Server
Node.js api POC for myRetail. 

This POC is an end to end RESTful api for product and pricing data for a fictitious company.  It utilizes a NoSQL datastore (Cassandra) as the backend and Node.js for the server.  All interaction with the app is via the API.  

## Usage
This application supports GET and PUT at /api/products/prod_id. 
GET request returns product id, name, price, and currency_code as json.
PUT updates the price and currency_code and returns the product data as json. 
  
  
To run this on a stand alone server you will need node.js and cassandra installed.  Use Node to run server.js. The default port is 8080. Cassandra is assumed to be available at 127.0.0.1. 
See developing if you want to run this in a development environment like Eclipse.

## Developing
Express.js framework used to create server.
Test suite based on Mocha, SuperTest, async, and should


ServerTest.js contains all test cases

Code was developed using Eclipse Neon.  To run locally you can use eclipse and node.js plugin and run server.js file as a node.js application.
To execute test script verify mocha is available, open command prompt and default project directory, and run "mocha".  If everything is setup correctly it should start test suite. 

You should see output like:

  Product API - PUT
    Update price using PUT - invalid price (40ms)

  Product API - PUT
    Update price using PUT (208ms)


  15 passing (1s)


### Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

 