const express = require('express');
const router = express.Router();

//read data from json dataset
const fs = require('node:fs');


//Read JSON data 
const file_path = './news_dataset.json';
fs.readFile(file_path, 'utf8', function(err,data){
    if (err) throw err;
    const obj = JSON.parse(data)
});



// Schema for accessing database
const {Sequelize, DataTypes, Model} = require('sequelize');
// initialize database without password / with blank password
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql'
});


class newsData extends Model{}
newsData.init(

    {
        Category:{ 
            type: DataTypes.STRING, 
            allowNull: false,
        },
        Headline:{ 
            type: DataTypes.STRING, 
            allowNull: false,
        },
        Authors:{ 
            type: DataTypes.STRING, 
        },
        Link:{ 
            type: DataTypes.STRING, 
        },
        Short_Description:{ 
            type: DataTypes.STRING, 
        },
        Date:{ 
            type: DataTypes.DATEONLY, //date without time 
            allowNull: false,
        },


    },
    {
        sequelize, // passing the connection instance
        modelName: 'newsData'
    }
)

//defined model is the class itself
console.log(newsData == sequelize.models.newsData); //true


//Connect to database and bulk insert data 
//data= obj
async function syncAndInsertData(){
    try{
        //authenticate
        await sequelize.authenticate();
        console.log('Connected to the database');
        //sync database
        await sequelize.sync({force:true});
        console.log('All models were synchronized successfully');
        // insert data into database
        await newsData.bulkcreate(obj);
        console.log('Data added to database successfully');


    }catch(error){
        console.log(`Oops. Having trouble connecting to the database. Error message here: ${error}`);
    }finally{
        await sequelize.close();
    }
}

syncAndInsertData();

//Queries on database

// view the whole database
router.get('/database', async function(req,res){
    try{
        const database_results = await newsData.findAll();
        res.json(database_results);
     }catch(err){
        res.status(500).send(error);
    }
});

// view a specific column from database
router.get('/database/column', function(req,res){
    try{
        const column_name = req.query.column;
        const response = newsData.findAll({
            attributes: `$column_name`,
        });
        res.send(response);
    }catch(error){
        res.status(500).send(error);
    }
})

// add the one where this one is generalized,then do update and delete, ordering and grouping
// filter/group by category(tech, world news, us news, culture and arts etc.)
router.get('database/column/category', function(req,res){
    try{
    const category_name = req.query.category;
    const response = newsData.findAll({
        group: `${category_name}`
    });
    res.send(response);
    }catch(error){
        res.status(500).send(error);
    }
})
// get back to selecting notifications for users and how they can order using a job scheduler

// User can look up headlines
router.get('database/headline', async function(req,res){
    try{
        const headline_name = req.query.headline;
    response = await  newsData.findAll({
        where: {
            content: {
                [Op.like] : `%${headline_name}%`
            }
        }
    });
    }catch(error){
        res.status(500).send(error);
    }

})

module.exports = router;

// Fix these issues later
// async function sync(){
//     await sequelize.sync({force:true});
// console.log('All models were synchronized successfully');

// } 


// modules.default.export = {newsData};

