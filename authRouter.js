const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const {createHmac} = require('crypto');


// array of users
const users = []

// list of users
router.get('/users', function(req,res){
    try{res.send(users);

    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
})
//create user
router.post('/users', async function(req,res){
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = {name: req.body.username, password: hashedPassword}
        users.push(user)
        console.log('Users:', users);
        res.status(201).send();
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
})

//login
router.post('users/login', async function(req,res){
    const user = users.find(user => user.name === req.body.username);
    if(user == null){
        return res.status(400).send('User cannot be found');
    }
    //check for password match
    try {
        if(await bcrypt.compare(req.body.password, user.password)) {
          res.send('Success');
        } else {
          res.send('Not Allowed');
        }
      } catch {
        res.status(500).send()
      }
    })

// generate api key based on user password
router.post('/generate-api-key', function(req,res){
    
    const {username, password} = req.body; 

    // combine username and password
    const combinedString = username + ':' + password;

    // Hash combined string using HMAC-SHA256 to generate api key
    const hmac = createHmac('sha256', combinedString);
    const apiKey = hmac.digest('hex');

    // Send api key to client
    res.send({apiKey: apiKey});
})
    

module.exports = router;