/** myRetail POC

Server will handle Pricing API GET and POST requests

 Base URL is /api/products
*/

var http = require('http');
var https = require('https');
var express = require('express');
var bodyParser = require('body-parser');
var cassandra = require('cassandra-driver');
var async = require('async');

const PORT=8080;
const PROD_SELECT_SQL = "SELECT product_id,currency_code, price FROM price_by_product_id WHERE product_id=?";
const PROD_UPDATE_SQL = "UDPATED price_by_product_id SET price = ?, currency_code=? WHERE product_id=?";

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
		client.execute(PROD_SELECT_SQL,[req.params.prod_id], { prepare : true },function (err, result) {
			if (!err){
	            if ( result.rows.length > 0 ) {
	                var product = result.rows[0];
	                
	                https.get(API_HOST_URL+API_PATH+req.params.prod_id+API_PATH_PARAMS, (apiRes) => {
		                	
	                    var data = "";
	                    apiRes.on('data', function(chunk) {
	                        data += chunk;
	                    });
	
		                    
		              	 apiRes.on('end', (d) => {
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
.post(function(req, res){
	res.json({ message: "post " + req.params.prod_id });
});


//API Base - currently does nothing
router.route('/products/').get(function(req, res) {
	res.statusCode = 200;
	res.json({ message: "not yet implemented in POC"});

});

router.get('/', function(req, res) {
    res.json({ message: '' });   
});

app.listen(PORT);
console.log("server open for e-business!");
