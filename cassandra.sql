CREATE KEYSPACE myRetail
	WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 };

CREATE TABLE price_by_product_id (
    product_id int PRIMARY KEY,
	currency_code text,
    price decimal
);

insert into price_by_product_id (product_id, currency_code, price) values(15117729,'USD',12.78);
insert into price_by_product_id (product_id, currency_code, price) values(16483589,'USD',9.99);
insert into price_by_product_id (product_id, currency_code, price) values(16696652,'USD',105.28);
insert into price_by_product_id (product_id, currency_code, price) values(16752456,'USD',5.00);
insert into price_by_product_id (product_id, currency_code, price) values(15643793,'USD',150.00);
insert into price_by_product_id (product_id, currency_code, price) values(13860428,'USD',0.99);
insert into price_by_product_id (product_id, currency_code, price) values(4,'USD',0.99);