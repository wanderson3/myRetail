/**
 * myRetail POC
 * 
 * Server will handle Pricing API GET and POST requests
 * 
 * Server based on Node.js 
 * Cassandra is the datastore
 * Express (https://expressjs.com/) application framework used to create server
 * 
 * Base URL is /api/products
 */

var http = require('http');
var https = require('https');
var express = require('express');
var bodyParser = require('body-parser');
var cassandra = require('cassandra-driver');
var async = require('async');

const PORT=8080;
const PROD_SELECT_SQL = "SELECT product_id,currency_code, price FROM price_by_product_id WHERE product_id=?";
const PROD_UPDATE_SQL = "UPDATE price_by_product_id SET price = ?, currency_code=? WHERE product_id=?";

const API_HOST_URL="https://api.target.com"
const API_PATH="/products/v3/";
const API_PATH_PARAMS="?fields=descriptions&id_type=TCIN&key=43cJWpLjH8Z8oR18KdrZDBKAgLLQKJjz";

	
var app = express(); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var client = new cassandra.Client({contactPoints: ['127.0.0.1'], keyspace: 'myretail'});

var router = express.Router(); 
app.use('/api', router);


router.route('/products/:prod_id')
.get(function(req, res) {	
	// Check to see if the prod_id passed in is valid
	if(!isNaN(req.params.prod_id) && parseInt(Number(req.params.prod_id)) == req.params.prod_id){
		//Retrieve the price from Cassandra
		client.execute(PROD_SELECT_SQL,[req.params.prod_id], { prepare : true },function (err, result) {
			if (!err){
	            if ( result.rows.length > 0 ) {
	                var product = result.rows[0];
	                // Retrieve product name from Target API
	                https.get(API_HOST_URL+API_PATH+req.params.prod_id+API_PATH_PARAMS, (apiRes) => {
	                    var data = "";
	                    apiRes.on('data', function(chunk) {
	                        data += chunk;
	                    });
   
	                    apiRes.on('end', (d) => {
	                    	//parse the data as JSON and find the "general description" field in the response
	                    	var jsonContent = JSON.parse(data);
		              	  	res.statusCode = 200;
		              	  	res.json({ id: req.params.prod_id,name:jsonContent.product_composite_response.items[0].general_description,current_price:{value:product.price,currency_code:product.currency_code}});
	              	  	});
	              	
	              	  }).on('error', (e) => {
	              	  console.log('Got error: ${e.message}');
	              	});
	                
	            } else {
	            	res.statusCode = 404;
	            	res.json({ message: "no results found"});
	            }
	        } else {
	        	res.statusCode = 500;
	    		res.json({ message: "get failed due to internal server error"});
	        	console.log("error: get product failed\n" + err);
	        }
		});
		
	} else {
		// error condition - invalid product id
		res.statusCode = 400;
		res.json({ message: "get failed due to invalid product id"});
	}	
})
.put(function(req, res){
	// Grab the ID from the request and verify it's valid
	if(req.body.hasOwnProperty("id") && 
			req.body.hasOwnProperty("name") && 
			req.body.hasOwnProperty("current_price") && 
			req.body.current_price.hasOwnProperty("value") && 
			!isNaN(req.body.current_price.value) && 
			req.body.current_price.hasOwnProperty("currency_code")){
		// Update the price
		client.execute(PROD_UPDATE_SQL,[parseFloat(req.body.current_price.value), req.body.current_price.currency_code,req.params.prod_id], { prepare : true },function (err, result) {
			if (!err){
				res.statusCode = 200;
          	  	res.json({ id: req.params.prod_id,name:req.body.name,current_price:{value:req.body.current_price.price,currency_code:req.body.current_price.currency_code}});
			} else {
	        	res.statusCode = 500;
	    		res.json({ message: "put failed due to internal server error"});
	        	console.log("error: put product failed\n" + err);				
			}
		});
	} else {
		res.statusCode = 400;
		res.json({ message: "invalid request - json body missing values"});	
	}
}).post(function(req, res) {
	res.statusCode = 405;
	res.json({ message: "method not allowed"});
}).delete(function(req, res) {
	res.statusCode = 405;
	res.json({ message: "method not allowed"});
});


// API Base - not yet implemented
router.route('/products/').get(function(req, res) {
	res.statusCode = 501;
	res.json({ message: "not yet implemented in POC"});
}).put(function(req, res) {
	res.statusCode = 405;
	res.json({ message: "method not allowed"});
}).post(function(req, res) {
	res.statusCode = 405;
	res.json({ message: "method not allowed"});
}).delete(function(req, res) {
	res.statusCode = 405;
	res.json({ message: "method not allowed"});
});

router.get('/', function(req, res) {
    res.json({ message: '' });   
});

app.listen(PORT);
console.log("server open for e-business!");
