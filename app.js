require('./models/db')
var createError = require('http-errors');
var express = require('express');
var passport = require('passport')
var path = require('path');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');
var flash = require('connect-flash')
var session = require('express-session');
var app = express();
var MongoStore = require('connect-mongo')(session);
require('./config/passport');
var Settings = require('./models/settings')
var cart=require('./models/cart1')


var indexRouter = require('./routes/index');
const adminRoute = require('./routes/admin');
// const email=require('./routes/email')
const { settings } = require('cluster');
const category = require('./models/category');
// const ordersRoute = require('./routes/admin-order');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.engine('ejs', exphbs({ defaultLayout: 'main' }));

app.use(expressLayouts);
app.set('view engine','ejs');
app.set('lyout','main', 'backend');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser())


//session
app.use(session(
  {
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 }
  }));
// passport
app.use(passport.initialize()); // invoke serializeuser method
app.use(passport.session()); // invoke deserializuser method

// flash message
app.use(flash());


//Globals vars 
app.use((req,res,next)=>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})


//Globals vars 
app.use(function(req,res,next){
  // res.locals.message = err.message;
  res.locals.session = req.session;
  res.locals.login = req.login;
  Settings.findOne({name:'gambo'})
  .then((settings)=>{
    res.locals.settings=settings
  })

  category.find({})
  .then((cat)=>{
    res.locals.cat=cat
  })
  
  if(req.user){

    res.locals.isAuth = true;
    
    res.locals.user = req.user;
    res.locals.userId = req.session.userId;
    
    next();
  }else{
    res.locals.isAuth = false,
    next();
  }

})

app.use('/', indexRouter);
app.use('/admin', adminRoute);
// app.use('/sign_up',email);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  // res.status(err.status || 500);
  // res.render('error',{title:"404"});
});

module.exports = app;
