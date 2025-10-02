const  Sequelize= require('sequelize')
// const mysql = require('mysql2')
const Database = new Sequelize('ExpressTracker','root','suresh',{
    host:'localhost',
    dialect: 'mysql'
});

(async ()=>{try {
    await Database.authenticate()
    console.log('connect')
} catch (error) {
    console.log(error)
}})();

module.exports = Database