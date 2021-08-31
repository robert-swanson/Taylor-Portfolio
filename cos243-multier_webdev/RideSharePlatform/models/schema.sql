/*
-----------------------------------------------------------------------------
schema.sql

This file generates the various tables and their relationships to each other for the ride share application.
-----------------------------------------------------------------------------
*/

-- we must delete tables after the tables that look at it are deleted first
drop table if exists passengers;		--
-- drop table if exists drivers;	-- no longer exists
drop table if exists authentication;--
drop table if exists ride;				-- required by passengers
drop table if exists location;		-- required by ride
drop table if exists state;			-- required by location
drop table if exists passenger;		-- required by passengers
drop table if exists vehicle;			-- required by authentication, ride
drop table if exists vehicle_type;	-- required by vehicle
drop table if exists driver;			--	required by ride, authentication


create table driver (		--	required by ride, authentication
	id serial primary key,	-- requires
	first_name varchar(50),
	last_name varchar(50),
	phone varchar(20),
	license_number varchar(20)
);

create table vehicle_type (	-- required by vehicle
	id serial primary key,		-- requires
	type varchar(50),
	make varchar(20),
	model varchar(20),
	year	int,
	total_seats int,
	mpg float
);

create table vehicle (		-- required by authentication, ride
	id serial primary key,	-- requires		vehicle_type
	color varchar(20),
	vehicle_type_id int references vehicle_type(id),
	license_state varchar(20),
	license_number varchar(20)
);

create table passenger (	-- required by passengers
	id serial primary key,	-- requires
	first_name varchar(50),
	last_name varchar(50),
	phone varchar(20)
);

create table state (								-- required by location
	abbreviation varchar(4) primary key,	-- requires
	name varchar(20)
);

create table location (		-- required by ride
	id serial primary key,	-- requires		state
	name varchar(50),
	address varchar(100),
	city varchar(20),
	state varchar(4) references state(abbreviation),
	zip_code varchar(10)
);

create table ride (			-- required by passengers
	id serial primary key,	-- requires		vehicle, location, driver
	driver_id int references driver(id),
	date date,
	time time,
	distance float,
	fuel_price float,
	fee float,
	vehicle_id int references vehicle(id),
	avalable_seats int,
	from_location_id int references location(id),
	to_location_id int references location(id)
);


/* many to many tables */

create table authentication (					-- required by
	driver_id int references driver(id),	-- requires		driver, vehicle
	vehicle_id int references vehicle(id),
	primary key (driver_id, vehicle_id)
);

create table passengers (								-- required by
	passenger_id int references passenger(id),	-- requires		passenger, ride
	ride_id int references ride(id),
	primary key (passenger_id, ride_id)
);
