const express = require('express');
const router = express.Router();
var bodyparser = require('body-parser');
var cors = require('cors');
var passport = require('passport');
const { expressCspHeader, SELF, NONE } = require('express-csp-header');

const jsonParser = bodyparser.json();

router.use(jsonParser);

router.use(cors({
    origin: true,
    credentials: true
}));

router.use(expressCspHeader({
    directives: {
        'default-src': [NONE],
        'img-src': [SELF]
    }
}));

const Contact = require('../models/contact');

router.get('/contacts', isValidUser, (req, res, next) => {
    var userId = req.user._id;
    Contact.find({user_id: userId}, (err, contacts) => {
        res.json(contacts);
    });
});

router.post('/contact', (req, res, next) => {
    console.log(req.body);
    let newContact = new Contact({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone: req.body.phone,
        user_id: req.body.user_id
    });

    newContact.save((err, contact) => {
        if (err) {
            res.json({msg: 'Failed to add contact'});
        } else {
            res.json({msg: 'Contact added successfully'});
        }
    });
});

router.delete('/contact/:id', (req, res, next) => {
    Contact.remove({_id: req.params.id}, (err, result) => {
        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    });
});

function isValidUser(req,res,next){
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.status(401).json({message:'Unauthorized Request'});
      }
  }

module.exports = router;