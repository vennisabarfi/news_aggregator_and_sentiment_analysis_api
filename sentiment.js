const express = require('express');
const router = express.Router();
const {Sequelize, DataTypes } = require('sequelize');
// connect to mysql database
const sequelize = new Sequelize('user_database', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql'
  });
const fs = require('node:fs');



//Read JSON data 
const file_path = './sentiment_results.json';
fs.readFile(file_path, 'utf8', function(err,data){
    if (err) throw err;
    const sentiment_data = JSON.parse(data)
});

// Database Schema
class sentimentData extends Model{}
sentimentData.init(

    {
        Headline:{ 
            type: DataTypes.STRING, 
            allowNull: false,
        },
        Sentiment:{ 
            type: DataTypes.STRING, 
            allowNull: false,
        },
        Confidence:{ 
            type: DataTypes.FLOAT, 
        },
        

    },
    {
        sequelize, // passing the connection instance
        modelName: 'sentimentData'
    }
)

//defined model is the class itself
console.log(sentimentData == sequelize.models.newsData); //true


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
        await newsData.bulkcreate(sentiment_data);
        console.log('Data added to database successfully');


    }catch(error){
        console.log(`Oops. Having trouble connecting to the database. Error message here: ${error}`);
    }finally{
        await sequelize.close();
    }
}

syncAndInsertData();


// Queries on database
//get headline,sentiment, confidence information by clicking headline
router.get('/sentiment/headline', async function(req, res) {
    try {
        const { headline } = req.query; // Correctly extract the headline query parameter
        if (!headline) {
            return res.status(400).send('Headline query parameter is required.');
        }

        const response = await sentimentData.findOne({
            where: { headline }
        });

        if (response) {
            res.json(response);
        } else {
            res.status(404).send('Headline not found.');
        }
    } catch (error) {
        res.status(500).send(`An error occurred while loading results. Error message: ${error.message}`);
        console.log(error);
    }
});


module.exports = router;