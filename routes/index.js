const expres =require('express');
const app = expres()
const router=expres.Router();
const { ensureAuthenticated } = require('../config/auth');
const { route } = require('./user');
const User = require('../model/User');
const csvtojson = require("csvtojson");
const multer = require('multer');
const mongo = require('mongodb').MongoClient
const objectId=require('mongodb').ObjectID
const { db } = require('../model/User');
const bcrypt = require('bcryptjs');
// var upload = multer({ dest: 'model/' })
const path = require('path');
const fs = require('fs');
const csv = require('fast-csv');
const { url } = require('inspector');
const { assert } = require('console');
var xlsx = require('xlsx');

 // readsteam
//csv to json

router.use(expres.static(__dirname+"./model/"))



var storage =multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'model/')
  },
  filename: function(req,file,cb){
    cb(null,file.originalname  )
  }
});
var upload = multer({
  storage:storage
})



 router.post('/upload', upload.single('myFile'), (req, res, next) => {
 
  const file = req.file;
  if(!file){
    const error = new error('plese upload a file');
    return next(error);

  }
  // res.send('file uploded')
  db.collection('employees').insertOne(file,(err,result)=>{
    if(err) return console.log(err)
    else console.log('file uploded')
  })
  res.render('printcsv')
  
})

 router.get('/print',(req,res)=>{
    f_name=db.collection.findById()
    fs.createReadStream(f_name)
    .pipe(csv())
    .on('data',function(data){
      console.log(data)
    })
    .on('end',function(data){
      console.log('read finsihed')
    })
 })

 router.get("/getdetails", function (req, res) {   
  csvtojson().fromFile(__dirname+'/employee.csv')
  .then(user=>{
    db.collection('employees').insertMany(user,(err,result)=>{
      if(err) return console.log(err)
      else console.log('csv to json inserted to DB')
    })
    res.render('jsontable',{
      jsondata:user
  });

  }).catch(err=>{
    console.log(err)
  })
  })

// converting xlsx file to json and render to ejs 
  router.get("/xldetails",(req,res)=>{
    var wb = xlsx.readFile(__dirname+'/sample.xlsx',{cellDates:true})
    var ws = wb.Sheets["Sheet1"]
    var data = xlsx.utils.sheet_to_json(ws)
    console.log(data)
    res.render('xltable',{
      xldata:data
    });
   })

  router.post('/editdetails',(req,res)=>{
     const { name, email, password, password2} = req.body;
    // console.log(name1)
    
    let errors =[]
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
      }
    
      if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
      }
      if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
      }
      else {
        User.findOne({ email: email }).then(user => {
          if (user) {
            errors.push({ msg: 'Email already exists' });
            res.render('register', {
              errors,
              name1,
              email,
              password,
              password2
            });
          } else {
            const newUser = new User({
              name,
              email,
              password
            });
    
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                  .save()
                  .then(user => {
                    req.flash(
                      'success_msg',
                      'You are now registered and can log in'
                    );
                    // res.redirect('/users/login');
                  })
                  .catch(err => console.log(err));
              });
            });
          }
        });
      }
  
    // var item={
    //   name1:req.body.name1,
    //   email1:req.body.email1,
    //   password1:req.body.password1,
    //   password12:req.body.password12,
    //   _id:req.body._id
    // };
    res.send('data updated')
    // console.log(item._id)
    // db.collection('employees').updateOne({"_id":item._id},{$set:item},(err,result)=>{
    //   if(err) return console.log(err)
    //   else{
           
    //        console.log('data updated')
    //   } 
    // })
  
    // mongo.connect(url,function(err,db){
    //   db.collection('employees').updateOne({"_id":objectId(id)},{$set:item},function(err,result){
    //   assert.equal(null,err)
    //   })
    // })
  
  
      
  });



router.get('/csv',(req,res)=>{
   res.sendFile(__dirname+'/index.html')

});
router.get('/xl',(req,res)=>{
  res.sendFile(__dirname+'/index.html')

});
router.get('/printcsvdata',(Req,res)=>{
  res.render('/printcsvdata')
})

router.get('/',function(req,res) {
    res.render('welcome');
});

router.get('/dashboard',ensureAuthenticated,function(req,res) {
    res.render('dashboard',{
        name:req.user.name,
        id: req.user._id,
        img:req.user.img    
    });
});
// router.get('/editdetails',(req,res)=>{
//      res.render('editdetails')
// })

 

router.get('/:id',(req,res)=>{
User.findById(req.param.id,(err,doc)=>{
  if(!err){
    res.render('editdetails')
  
  }
})
});


module.exports=router;
