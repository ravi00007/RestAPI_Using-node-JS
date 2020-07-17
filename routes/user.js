const expres =require('express');
const router=expres.Router();
const bcrypt = require('bcryptjs');
const User = require('../model/User');
const passport = require('passport');
const mongo = require('mongodb').MongoClient
const objectId=require('mongodb').ObjectID
const { db } = require('../model/User');
const multer = require('multer')

router.get('/login',(req,res)=> {
    res.render('login');
});

router.get('/register',(req,res)=> {
    res.render('register');
});
router.get('/editdetails',(req,res)=>{
  res.render('editdetails',{
    // uid:req.user._id                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
  })
})
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

router.post('/register',upload.single('img'),(req,res)=>{
const { name, email, password, password2} = req.body;
const img = req.file.filename
console.log(img)
let errors = [];

  if (!name || !email || !password || !password2 || img) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }
  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }
  
  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2,
      img,
    });
  } 
  else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2,
          img,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
          img,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            console.log(newUser);
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

//editdetails handle 


router.get('/:id',(req,res)=>{
User.findById(req.param.id,(err,doc)=>{
  if(!err){
    res.render('editdetails')
  
  }
})
});
// login hadle 

router.post('/login',(res,req,next)=>{
passport.authenticate('local',{
  successRedirect: '/dashboard',
  failureRedirect: '/users/login',
  failureFlash: true
})(res,req,next);
});

//logout handle

router.get('/logout',(req,res)=>{
req.logout();
req.flash('success_msg','you are logged out');
res.redirect('/users/login')
})

// edit details


module.exports=router;
