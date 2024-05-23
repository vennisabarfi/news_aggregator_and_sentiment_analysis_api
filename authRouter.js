const express= require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const user = require("./user");

// create user (username, email, password)
router.post('/createuser', async function(req,res){
    const {name, email, password} = req.body;
    if(!name||!email||!password){
        res.status(400).json({error: `name,email and password need to be provided`});
    }
})

// user login (username, password)
router.get('/login', async function(req,res){
    const {name,password} = req.body;
})


module.exports = router;