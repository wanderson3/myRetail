/**
 * Test suite for myRetail POC
 * Uses Mocha (http://mochajs.org/) for easy test case creation - also makes running them easy
 * SuperTest (https://github.com/visionmedia/supertest) for assertions
 * async (https://github.com/caolan/async) used in test cases that chain multiple http calls
 * should (https://shouldjs.github.io/) extends assertions to make code more readable
 * 
 */
var supertest = require("supertest");
var should = require("should");
var async = require("async");

var server = supertest.agent("http://localhost:8080");

/*
 * Verify base api/products path returns unimplemented 
 */
describe("Base API - GET",function(){
	it("return not implemented",function(done){
		server.get("/api/products/")
		.expect("Content-type",/text/)
		.expect(501)
		.end(function(err,res){
			done();
		});
	});
});

/*
 * Verify PUT is not allowed on api/products path
 */
describe("Base API - PUT",function(){
	it("return not allowed",function(done){
		server.put("/api/products/")
		.expect("Content-type",/text/)
		.expect(405)
		.end(function(err,res){
			done();
		});
	});
});

/*
 * Verify POST is not allowed on api/products path
 */
describe("Base API - POST",function(){
	it("return not allowed",function(done){
		server.post("/api/products/")
		.expect("Content-type",/text/)
		.expect(405)
		.end(function(err,res){
			done();
		});
	});
});

/*
 * Verify DELETE is not allowed on api/products path
 */
describe("Base API - DELETE",function(){
	it("return not allowed",function(done){
		server.delete("/api/products/")
		.expect("Content-type",/text/)
		.expect(405)
		.end(function(err,res){
			done();
		});
	});
});

/*
 * Verify GET with invalid product ID returns Bad Request
 */
describe("Product API - GET invalid id",function(){
	it("invalid id - should be a number",function(done){
		server.get("/api/products/invalid")
		.expect("Content-type",/json/)
		.expect(400)
		.end(function(err,res){
			done();
		});
	});
});

/*
 * Verify GET with a product id that doesn't exist returns Not Found
 */
describe("Product API - GET id not found",function(){
	it("id does not exist",function(done){
		server.get("/api/products/1")
		.expect("Content-type",/json/)
		.expect(404)
		.end(function(err,res){
			done();
		});
	});
});

/*
 * Verify GET with valid product id is successful
 */
describe("Product API - GET id found",function(){
	it("id exists",function(done){
		server.get("/api/products/15117729")
		.expect("Content-type",/json/)
		.expect(200)
		.end(function(err,res){
			done();
		});
	});
});

/*
 * Verify GET with valid product id is successful and price data is in json response
 */
describe("Product API - GET id found - price in response",function(){
	it("id exists",function(done){
		server.get("/api/products/15117729")
		.expect("Content-type",/json/)
		.expect(200)
		.end(function(err,res){
			if (err) done(err);
			res.body.should.have.property('current_price');
			res.body.current_price.should.have.property('value', '12.78');
			res.body.current_price.should.have.property('currency_code', 'USD');
			done();
		});
	});
});

/*
 * Verify GET with valid product id is successful and name is in json response
 */
describe("Product API - GET id found - name in response",function(){
	it("id exists",function(done){
		server.get("/api/products/15117729")
		.expect("Content-type",/json/)
		.expect(200)
		.end(function(err,res){
			if (err) done(err);
			res.body.should.have.property('name');
			done();
		});
	});
});

/*
 * Verify GET with valid product id is successful and id is in json response
 */
describe("Product API - GET id found - id in response",function(){
	it("id exists",function(done){
		server.get("/api/products/15117729")
		.expect("Content-type",/json/)
		.expect(200)
		.end(function(err,res){
			if (err) done(err);
			res.body.should.have.property('id','15117729');
			done();
		});
	});
});

/*
 * Verify POST at api/products/prod_id is not allowed
 */
describe("Product API - POST",function(){
	it("return not allowed",function(done){
		server.post("/api/products/15117729")
		.expect("Content-type",/text/)
		.expect(405)
		.end(function(err,res){
			done();
		});
	});
});

/*
 * Verify DELETE at api/products/prod_id is not allowed
 */
describe("Product API - DELETE",function(){
	it("return not allowed",function(done){
		server.delete("/api/products/15117729")
		.expect("Content-type",/text/)
		.expect(405)
		.end(function(err,res){
			done();
		});
	});
});

/*
 * Verify PUT at api/products/prod_id with no body content returns Bad Request
 */
describe("Product API - PUT",function(){
	it("invalid put - no json body",function(done){
		server.put("/api/products/15117729")
		.expect("Content-type",/text/)
		.expect(400)
		.end(function(err,res){
			done();
		});
	});
});

/*
 * Verify PUT at api/products/prod_id with an invalid price returns Bad Request
 */
describe("Product API - PUT",function(){
	it("Update price using PUT - invalid price",function(done){
		server.put("/api/products/4")
		.send({id:"4", name: "test name", current_price: {value:"asdf", currency_code:"USD"}})
		.expect("Content-type",/text/)
		.expect(400)
		.end(function(err,res){
			done();
		});
	});
});

/*
 * Verify PUT at api/products/prod_id with valid data returns Success and data is accurately updated
 * at end of test reset price
 */
describe("Product API - PUT",function(){
	it("Update price using PUT",function(done){
		async.series([
		function(cb) { 
			//Update the price
			server.put("/api/products/4")
			.send({id:"4", name: "test name", current_price: {value:"99.99", currency_code:"USD"}})
			.expect("Content-type",/json/)
			.expect(200)
			.end(cb);
		},
		function(cb) {
			//Verify price was updated
			server.get("/api/products/4")
			.expect("Content-type",/json/)
			.expect(200)
			.expect(function(res){
				//verify the price has changed
				res.body.should.have.property('current_price');
				res.body.current_price.should.have.property('value', '99.99');
				res.body.current_price.should.have.property('currency_code', 'USD');
			})
			.end(cb);
		},
		function(cb) { 
			//Reset the price
			server.put("/api/products/4")
			.send({id:"4", name: "test name", current_price: {value:"1.23", currency_code:"USD"}})
			.expect("Content-type",/json/)
			.expect(200)
			.end(cb);
		}],done)
	});
});

