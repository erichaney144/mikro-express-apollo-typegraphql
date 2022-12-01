# mikro-express-apollo-typegraphql

## Setup:
* Create database:
```
$ psql
root=# create role mikro with password 'mikrotest';
root=# alter role mikro with login;
root=# create database mikrotest;
root=# grant all on database mikrotest to mikro;
```

* Create .env file:
```
$ cp .env.example .env
```

* Run initial migration:
```
$ yarn mig:run
```