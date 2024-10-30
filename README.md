To find a live version of this back end project head to: https://back-end-project-ajfq.onrender.com/api it may take some time to load.

The project is a database with multiple different tables, that is queryable to show the extent of my skills in the back end. You can GET, POST, PATCH, DELETE and query GET apis as well as doing a secondary query allowing for the information to be sorted in ASC or DESC order.

To clone the repo over use this link: https://github.com/UmarI46/back-end-project 


To get this repo to function as intended you will need:
1) 2 .env files with the names;
.env.development
.env.test
they should include the line; "PGDATABASE=nc_news" and "PGDATABASE=nc_news_test", respectively.

2) Install dependencies with npm install

3) Do npm run "setup-dbs", "npm run seed". Then to get it running the tests I've made do "npm run test".

You'll need to have a minimum of Postgres 8.7.3 and Node.js 22.7.0