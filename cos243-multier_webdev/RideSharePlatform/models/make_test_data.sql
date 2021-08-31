/*
make_test_data.sql

generates test data.
*/

-- truncate table passengers;
-- truncate table authentication;
-- truncate table ride;
-- truncate table location;
-- truncate table state;
-- truncate table passenger;
-- truncate table vehicle;
-- truncate table vehicle_type;
-- truncate table driver;


insert into driver values
	(	 default,	--1
		'Kevin',
		'James',
		'555-476-8989',
		'5784'
	),( default,	--2
		'Jane',
		'Adams',
		'555-555-5555',
		'5555'
	),( default,	--3
		'Matt',
		'Smith',
		'555-992-1288',
		'3784'
	);

insert into vehicle_type values
	(	 default,	--1
		'SUV',
		'Honda',
		'CRV',
		1999,
		5,
		25
	),( default,	--2
		'Sedan',
		'Volkswagen',
		'Passat',
		2018,
		5,
		36
	);

insert into vehicle values
	(	 default,	-- 1
		'Red',
		1,
		'IN',
		'567'
	),( default,	-- 2
		'Green',
		2,
		'IN',	-- for example, driver one also owns this car
		'78'
	),( default,	-- 3
		'Blue',
		2,
		'NY',
		'626176523'
	),( default,	-- 4
		'Black',
		2,
		'CA',
		'999'
	);

insert into authentication values
	( 1,1 ),
	( 1,2 ),
	( 2,3 ),
	( 3,4 );

-- insert into passenger values
-- 	(
--
-- 	)
