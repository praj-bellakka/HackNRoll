const dbHelpers = require('../models/dbHelpers');
const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.post('/login', (req,res) => {
    const {username, password} = req.body;

    if(!(username && password)){
        res.status(400).json({message: "Username and password required"});
    }

    dbHelpers.findUserByUsername(username)
    .then(user => {
        if (user && bcrypt.compareSync(password, user.password)){
            req.session.user = {
                id: user.id,
                username: user.username
            };
            res.redirect('/homepage');
        }else {
            res.status(401).json({message: "invalid credentials"});
        }
    })
    .catch(error => {
        res.status(500).json(error);
    });
});

router.post('/register', (req, res) => {
    const credentials = req.body;
    const {username, password} = credentials;

    if(!(username && password)){
        res.status(400).json({message: "Username and password required"});
    }

    const hash = bcrypt.hashSync(credentials.password, 12);
    credentials.password = hash; 

    dbHelpers.addUser(credentials)
    .then(user => {
        res.render('index');        
    })
    .catch(error => {
        if (error.errno == 19){ //error of error number 19: constraint violation, eg record already exists 
            res.status(400).json({message: "Username already taken"});
        }else {
            res.status(500).json(error);
        }
    });
});

router.get('/logout', (req, res) => {
    if(req.session){
        req.session.destroy(error => {
            if(error) {
                res.status(500).json(error);
            }else {
                res.redirect('/');
            }
        });
    }else {
        res.status(200).json({message: 'Not logged in'});
    }
});

module.exports = router;
