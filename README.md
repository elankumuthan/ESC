# Running the HotelBooking Site 

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Instructions

Follow these step by step guide to set up the project in your own local machine.

*Note: Instruction guide is written based on a Macbook running Apple Silicon*

### Installing Packages
Run `npm i` on both client and server directory separately to install all the packages required.

### Setting up MYSQL Database locally 
1) Using *brew* to install mysql: `brew install mysql`
2) Start mysql server from the command line: `mysql.server start`
3) Enterring mysql.server from commandline: `mysql -u root -p`, just press enter with prompted pwd
4) Creating database: `create database hotelDB;`

### Running the web app

Client: `npm run`
Client React webapp running on [http://localhost:3000](http://localhost:3000)

Server: `npm run`
Server running on [http://localhost:3004](http://localhost:3004)



