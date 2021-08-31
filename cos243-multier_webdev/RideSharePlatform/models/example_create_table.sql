 drop table if exists delete_me;

create table delete_me (
	fish varchar(255),
	num_cow int
);

insert into delete_me (fish, num_cow) values ('Kyle',5);
insert into delete_me (fish, num_cow) values ('Jen',7);
insert into delete_me (fish, num_cow) values ('Dave',0);

select * from delete_me;
