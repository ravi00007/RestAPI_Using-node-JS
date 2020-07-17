const express =require('express');
const expressLayouts=require('express-ejs-layouts');
const app = express();
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session= require('express-session');
const passport = require('passport');

//passport config
require('./config/passport')(passport)


mongoose.connect('mongodb://localhost:27017/EmployeeDB', { useNewUrlParser: true }, (err) => {
    if (!err) { console.log('MongoDB Connection Succeeded.') }
    else { console.log('Error in DB connection : ' + err) }
})

//EJS

app.use(expressLayouts);
app.set('view engine','ejs');

//Bodyparser

app.use(express.urlencoded({extended:false}));

// express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// pasport middleware
app.use(passport.initialize());
app.use(passport.session());
// connect flash 
app.use(flash());

// globle variable 

app.use((req,res,next)=>{
    res.locals.success_msg= req.flash('success_msg');
    res.locals.error_msg =req.flash('error_msg');
    res.locals.error =req.flash('error');
    next();
}); 

//routes
// app.use('/getdetails',(req,res)=>{
// res.sendFile(__dirname+'/displaycsv.html')
// });
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/user'))
const PORT =process.env.PORT || 7000;
app.listen(PORT, console.log(`server started at port ${PORT}`));

