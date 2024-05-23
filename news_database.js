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
router.get('/database/column', async function(req,res){
    try{
        const column_name = req.query.column;
        const response = await newsData.findAll({
            attributes: `$column_name`,
        });
        res.send(response);
    }catch(error){
        res.status(500).send(error);
    }
})


// filter/group by category(tech, world news, us news, culture and arts etc.)
router.get('database/column/category', async function(req,res){
    try{
    const category_name = req.query.category;
    const response = await newsData.findAll({
        group: `${category_name}`
    });
    res.send(response);
    }catch(error){
        res.status(500).send(error);
    }
})

// User can look up headlines
router.get('database/headline', async function(req,res){
    try{
        const headline_name = req.query.keyword;
    response = await  newsData.findAll({
        where: {
            content: {
                [Op.like] : `%${headline_name}%`
            }
        }
    });
    res.json(response); //send response on json 
    }catch(error){
        res.status(500).send(`An error occurred while searching for headlines. Error message here: ${error}`);
    }
})

// User can look up author
router.get('database/author', async function(req,res){
    try{
        const author_name = req.query.keyword;
    response = await  newsData.findAll({
        where: {
            content: {
                [Op.like] : `%${author_name}%`
            }
        }
    });
    res.json(response); //send response on json 
    }catch(error){
        res.status(500).send(`An error occurred while searching for headlines. Error message here: ${error}`);
    }
})

// Filter news according to date (format: YYY-M-D)
router.get('/database/date', async function(req,res){
    const {startDate, endDate} = req.query; //receive dates from user

    // Validate user date inputs
    if (!startDate || !endDate){
        return res.status(500).json({message: `Please provide both a start date and end date. Error: ${error}`});

    }
    try{
        const response = await newsData.findAll({
            where:{
                createdAt:{
                    [Sequelize.Op.between]: [new Date(startDate), new Date(endDate)]
                }
            }
        });
        res.json(response)
    }catch(error){
        res.status(500).send(error);
    }
}) 

module.exports = router;




