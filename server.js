const express = require('express');
const app = express();
const port = 3000;
const news_database = require('./news_database');
// const authRouter = require('./authRouter'); //will fix bugs and then integrate

app.get('/', function(req,res){
    res.send("Welcome to the News Aggregator API");
})

//user authentication
// app.use(authRouter); //will fix bugs and then integrate

//view database(json format)(get('/database'))
app.use(news_database);

app.listen(port, function(){
    try{
    console.log(`Server is listening on port ${port}`);
}catch(error){
    console.log(`Oops! Seems like the server is down. Error message: ${error}`);
}
})