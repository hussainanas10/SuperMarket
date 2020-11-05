var express = require('express');
var router = express.Router();
// var contact = require('../models/conatctus')
var signin = require('../models/signup')
var product = require('../models/addproduct')
const offer = require('../models/offer');
const category = require('../models/category');
const Settings = require('../models/settings')
const Cart = require('../models/cart1')
var posts = require('../models/posts')
const Orders = require('../models/order');
const banner = require('../models/banner')
var async = require('async');
const smtpEmail = require('../config/verifyEmail');
var bcrypt = require('bcryptjs')
var crypto = require('crypto')
var nodemailer = require('nodemailer')
var passport = require('passport')
const { render } = require('ejs');
var multer = require('multer');
const checksum_lib = require('../paytm/checksum.js');
// const addarea = require('../models/addarea');
// const orders = require('../models/order');

const { post } = require('./admin');
const order = require('../models/order');
const { settings } = require('../app');
// const { sign } = require('crypto');
// const cart = require('../models/cart');


function isLoggedIn(req, res, next) {
  // console.log("hello" + req.isAuthenticated())
  if (req.isAuthenticated())
    return next()
  else
    res.redirect('/sign_in');

}

function notLoggedIn(req, res, next) {
  // console.log("hello" + req.isAuthenticated())
  if (!req.isAuthenticated())
    return next();
  else
    res.redirect('/');

}

var storage = multer.diskStorage({
  destination: process.cwd() + '/public/uploads/',
  filename: (req, file, cb) => {
    cb(null,  Date.now() + file.originalname);
  }
});
const upload = multer({
  storage: storage,
})


router.get('/logout', isLoggedIn, (req, res, next) => {
  req.logout();
  req.flash('success_msg', "You are logged Out");
  // req.destroy();
  res.redirect('/');
})


// SIGNUP
router.get('/sign_up',notLoggedIn, (req, res) => {
  Settings.findOne({ name: 'gambo' })
    .then((settings) => {
      res.render('user/signup', { login: true, layout: 'main' });
    })
});


router.post('/sign_up', (req, res) => {
  
  const { username, fullname, emailaddress, password, phone } = req.body;
  signin.findOne({username:username},(err,data)=>{
    if(err)console.log("error coming",err);
    else if(data){
      // console.log("already username");
      req.flash('error', 'Username already taken.')
      res.redirect('/sign_up')
    }
    else{
      [rand, status] = smtpEmail.verifyEmail(req.get('host'), req.body.emailaddress);
      const newUser = new signin({
        username,
        fullname,
        emailaddress,
        phone,
        password
      })
    
      //Hash Password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          //Set Password to hashed
          newUser.password = hash;
          newUser.save()
            .then(user => {
              Cart.create({ userId: user.id })
                .then((cart) => {
                  
                  Orders.create({ userId: user.id })
                    .then((user) => {
                      
                      req.flash('success_msg', 'An e-mail has been sent to ' + req.body.emailaddress + ' with further instructions.')
                      // res.send('sent')
                       res.redirect(req.get('referer'))
                    })
                })
            })
            .catch(err => console.log(err));
        })
      })
    }
  })
  
})


//Signin Handler
router.get('/sign_in',notLoggedIn, function (req, res, next) {
  Settings.findOne({ name: 'gambo' })
    .then((settings) => {
      res.render('user/sign', { login: true, layout: 'main' });
    })
});

router.post('/sign_in',notLoggedIn, passport.authenticate('local.userlogin', {

  successRedirect: '/',
  failureRedirect: '/sign_in',
  failureFlash: true
}));

router.get(('/sign_in/verify'), (req, res) => {
  let user_id = req.query.id;
  if (user_id == rand) {
    console.log(rand);
    signin.findOneAndUpdate({ registerToken: user_id }, { $set: { isVerified: true } }, (err, doc) => {
      if (err) console.log("Something wrong when updating data!");
      else {
        res.redirect('/sign_in');
      }
    });
  } else {
    res.end('Error');
  }
})

/* GET home page. */

router.get('/', function (req, res, next) {
  product.find({})
    .then((products) => {
      category.find({})
        .then((category) => {
          banner.find({})
            .then((banner) => {
              res.render('user/home', { list: products, category: category, banner: banner, layout: 'main' });
            })
        })
    })
});



router.get('/dashboard', notLoggedIn, function (req, res, next) {
  product.find({})
    .then((products) => {
      category.find({})
        .then((category) => {
          res.render('user/dashboard', { list: products, category: category, layout: 'main' });

        })
    })
});

router.post('/', function (req, res, next) {
  res.redirect('/')
})


router.get('/shopgrids', function (req, res, next) {
  product.find({})
    .then((products) => {
      res.render('user/shop_grid', { category: "ALL", products: products, layout: 'main' });

    })
});


router.get('/shopgrid', function (req, res, next) {
  product.find({ category: (req.query.category).toString().split('+').join(' ') })
    .then((products) => {
      res.render('user/shop_grid', { category: (req.query.category).toString().split('+').join(' '), products: products, layout: 'main' });

    })
});

router.get('/contact', function (req, res) {
  Settings.findOne({ name: 'gambo' })
    .then((settings) => {
      // console.log("hello coming")
      res.render('user/contactus', { layout: 'main' })
      // res.send("hello I am working well");
    })
})
router.post('/contact', function (req, res) {
  Settings.findOne({ name: 'gambo' })
    .then((setting) => {
      // console.log(setting);
      var smtpTransport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: setting.emailEmail,
          pass: setting.emailPassword

        }

      });

      var mailOptions;
      mailOptions = {
        from: req.body.email,
        to: setting.emailEmail,
        subject: "Hi, " + req.body.email + " wants to contact u",
        html: "<html><p>Hi i am, " + req.body.sendername + "," + req.body.message + ".<br> Best regards," + req.body.sendername + "</p></html>"
      }
      smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
          // console.log(error);
          res.end("error");
        } else {
          res.redirect(req.get('referer'))
          // console.log("Message sent: " + response.message);
        }
      });
    })

})


router.get('/ourblog', function (req, res, next) {
  posts.find({})
    .then((post) => {
      res.render('user/blog', { post: post, layout: 'main' });
    })


});


router.get('/blog_details/:id', function (req, res, next) {
  posts.findById(req.params.id)
    .then((post) => {
      res.render('user/blog_detail', { list: post, layout: 'main' });


    })

});



router.get('/edit-profile', isLoggedIn, function (req, res, next) {
  signin.findById(req.user.id)
    .then((profile) => {
      res.render('user/edit-profile', { list: profile, layout: 'main' });
    })
});


router.post('/edit-profile', upload.single('images'), function (req, res, next) {

  signin.findByIdAndUpdate(req.user.id, { $set: { images: req.file.filename, username: req.body.username, phone: req.body.phone, fullname: req.body.fullname } }, { new: true, useFindAndModify: false })
    .then((profile) => {
      res.redirect(req.get('referer'));
      next;
    })
});



router.get('/about_us', function (req, res, next) {
  Settings.find({})
    .then((settings) => {
      res.render('user/aboutus', { layout: 'main' });
    })

});


router.get('/single_product/:id', function (req, res, next) {
  product.findById(req.params.id)
    .then((pro) => {
      product.find({ category: pro.category })
        .then((related) => {
          product.find({})
          .then((doc)=>{
            res.render('user/singleproduct', { list: pro, related: related,doc:doc, layout: 'main' });
          })
          

        })
    })

});


// router.get('/edit-offer/:id', function (req, res, next) {
//   offer.findById(req.params.id)
//     .then((location) => {
//       res.render('admin/edit-offer', { list: location, layout: 'backend' });

//     })
// });


router.get('/dashboard_my_wishlist', isLoggedIn, (req, res) => {
  signin.findById(req.user.id)
    .populate(
      {
        path: 'favorites',
        model: 'addproduct'
      }
    )
    .exec()
    .then((user) => {
      res.render('user/dashboard_wishlist', { favorites: user.favorites, layout: 'main' })
    })
})

router.get('/delete/:favno', isLoggedIn, function (req, res, next) {
  signin.findByIdAndUpdate(req.user.id, { $pull: { favorites: req.params.favno } }, { new: true })
    .then((customer) => {
      res.redirect(req.get('referer'));

    })
});
// User.findByIdAndUpdate(req.user.id,{$pull:{favorites:req.params.listId}},{new:true})
// .then((user)=>{
//   res.redirect('/favorites')
//   next
// })

router.get('/dashboard_my_wishlist/:wishId', isLoggedIn, (req, res, next) => {
  signin.findByIdAndUpdate(req.user.id, { $push: { favorites: req.params.wishId } }, { new: true })
    .then((user) => {
      res.redirect(req.get('referer'))
      // res.redirect('/dashboard_my_wishlist')
      next
    })
})

router.get('/dashboard_overview', isLoggedIn, function (req, res, next) {
  signin.findById(req.user.id)
    .then((user) => {
      res.render('user/dashboard_overview', { layout: 'main', user: user });
    })
});

router.get('/dashboard_my_orders', isLoggedIn, function (req, res, next) {
  signin.findById(req.user.id)
    .then((user) => {
      order.findOne({ userId: req.user.id })
        .populate({
          path: 'items',
          populate: {
            path: 'productId',
            model: 'addproduct'
          }
        })
        .exec()
        .then((order) => {
          res.render('user/dashboardmyorder', { order: order, user: user, layout: 'main' });
        })
    })
});

router.get('/dashboard_my_address', isLoggedIn, function (req, res, next) {
  signin.findById(req.user.id)
    .then((user) => {
      res.render('user/dashboardmyaddress', { user: user, layout: 'main' });
    })
});
router.get('/delete/address/:addressno', isLoggedIn, function (req, res, next) {
  signin.findByIdAndUpdate(req.user.id, { $pull: { address: {id:req.params.addressno} } }, { new: true })
    .then((customer) => {
      res.redirect(req.get('referer'));
    })
});


router.get('/address', isLoggedIn, function (req, res, next) {
  Settings.find({})
  .then(()=>{
    res.render('user/address', { layout: 'main' });

  })
  });
router.post('/address', function (req, res, next) {
  signin.findById(req.user.id)
    .then((cart) => {
      signin.findByIdAndUpdate(req.user.id, { $push: { address: { country: req.body.country, addressfullname: req.body.addressfullname, addressphone: req.body.addressphone, pin: req.body.pin, flatnumber: req.body.flatnumber, colony: req.body.colony, landmark: req.body.landmark, city: req.body.city, state: req.body.state } } }, { new: true, useFindAndModify: false })
        .then((results) => {
          res.redirect('/dashboard_my_address')
          next
        })
    })
});

router.get('/edit-address/:addressNo', isLoggedIn, function (req, res, next) {
  signin.findById(req.user.id)
    .then((user) => {
      res.render('user/edit-address', { user: user, address: user.address[req.params.addressNo], layout: 'main' });
    })
});
router.post('/edit-address/:addressNo', function (req, res, next) {
  // res.json(req.body)
  signin.findByIdAndUpdate(req.user.id, { $set: { address: req.body } })
    .then((customer) => {
      res.redirect('/dashboard_my_address');
      next

    })
});


router.get('/dashboard_my_rewards', isLoggedIn, function (req, res, next) {
  res.render('user/dashboardmyrecord', { layout: 'main' });
});

router.get('/dashboard_my_wallet', isLoggedIn, function (req, res, next) {
  res.render('user/dashboard_wallet', { layout: 'main' });
});





router.get('/checkout', isLoggedIn, function (req, res, next) {
  signin.findById(req.user.id)
    .then((user) => {
      Cart.findOne({ userId: req.user.id })
        .populate({
          path: 'items',
          populate: {
            path: 'productId',
            model: 'addproduct'
          }
        })
        .exec()
        .then((cart) => {
          res.render('user/checkout', { user: user, cart: cart, layout: 'main' });
        })
    })
});

router.get('/request_product', isLoggedIn, function (req, res, next) {
  Settings.find({})
    .then(() => {
      res.render('user/request_product', { layout: 'main' });
    })
});

router.get('/order_placed', function (req, res, next) {
  // signin.findById(req.user.id)
  // .then((user) => {
  //   order.findOne({ userId: req.user.id })
  //   .populate({
  //     path: 'items',
  //     populate: {
  //       path: 'productId',
  //       model: 'addproduct'
  //     }
  //   })
  //   .populate('userId')
  //   .exec()
  //   .then((cart)=>{
  //     res.render('user/checkout', { user: user,cart:cart,layout: 'main' });

  //   })

  // })

  res.render('user/order_place', { layout: 'main' });
});
router.post('/order_placed', function (req, res, next) {
  signin.findById(req.user.id)
    .then((user) => {
      order.findOne({ userId: req.user.id })
        .populate({
          path: 'items',
          populate: {
            path: 'productId',
            model: 'addproduct'
          }
        })
        .populate('userId')
        .exec()
        .then((cart) => {
          res.render('user/checkout', { user: user, cart: cart, layout: 'main' });

        })

    })

  res.render('user/order_place', { layout: 'main' });
});

router.get('/bill', isLoggedIn, function (req, res, next) {
  Settings.find({})
    .then(() => {
      res.render('user/bill', { layout: 'main' });
    })
});



router.get('/forgot_password',notLoggedIn, function (req, res, next) {
  Settings.find({})
    .then((setting) => {
      res.render('user/forgot_pas', { login: true, layout: 'main' });
    })
});

router.post('/forgot_password', function (req, res, next) {

  async.waterfall([
    function (done) {
      crypto.randomBytes(20, function (err, buf) {
        var token = buf.toString('hex');
        // console.log("hello");
        done(err, token);
      });
    },
    function (token, done) {
      signin.findOne({ emailaddress: req.body.email }, function (err, user) {
        if (!user) {

          req.flash('error', 'No account with that email address exists.');
          return res.redirect(req.get('referer'));
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function (err) {
          done(err, token, user);
        });
      });
    },
    function (token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: "seo@psyber.co",
          pass: "seo123#@!"
        }
      });
      var mailOptions = {
        to: req.body.email,
        from: 'seo@psyber.co',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        req.flash('success_msg', 'An e-mail has been sent to ' + req.body.email + ' with further instructions.');
        console.log('done');
        // done(err, 'done');
        res.redirect(req.get('referer'));
      });
    }
  ], function (err) {
    if (err) return next(err);
    res.res.redirect(req.get('referer'));
  });
  
});

router.get('/reset/:token',notLoggedIn, function (req, res) {
  signin.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
    if (!user) {
      // req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot_password');
    }
    res.render('user/confirmpass', {
      layout: "main", login: true,
      user: user
    });
  });
});
var hasp;
var toki;
router.post('/reset/:token', function (req, res) {

  async.waterfall([
    function (done) {
      signin.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('/sign_in');
        }
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        // console.log("pass", user.password);
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) throw err;
            //Set Password to hashed
            user.password = hash;
            user.save()
              .then(() => {
                // console.log(user);
                var smtpTransport = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    user: "seo@psyber.co",
                    pass: "seo123#@!"
                  }
                });
                var mailOptions = {
                  to: user.emailaddress,
                  from: 'seo@psyber.co',
                  subject: 'Your password has been changed',
                  text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.emailaddress + ' has just been changed.\n'
                };
                smtpTransport.sendMail(mailOptions, function (err) {
                  req.flash('success_msg', 'Success! Your password has been changed.');
                  //   done(err);

                  res.redirect('/sign_in');
                });
              })

          })
        })
      });
    },

  ], function (err) {
    res.redirect('/');
  });
});


router.get('/faq', function (req, res, next) {
  Settings.find({})
    .then(() => {
      res.render('user/faq', { layout: 'main' });

    })
});

router.get('/offers', isLoggedIn, function (req, res, next) {
  offer.find({})
    .then((offer) => {
      res.render('user/offer', { list: offer, layout: 'main' });

    })
});

router.get('/cart', isLoggedIn, function (req, res, next) {
  //  Orders.create({userId:req.user.id})
  //  .then(()=>{
  Cart.findOne({ userId: req.user.id })
    .populate({
      path: 'items',
      populate: {
        path: 'productId',
        model: 'addproduct'
      }
    })
    .exec()
    .then((cart) => {
      var tot = 0;
      for (var i = 0; i <= cart.items.length - 1; i++) {
        tot += cart.items[i].qty * cart.items[i].productId.discountmrp;
      }
      cart.total = tot;
      cart.save()
        .then(() => {
          // req.flash('success_msg', 'This is cart')
          res.render('user/cart', { cart: cart, layout: 'main' });
        })
      // .then((cart)=>{
      //   res.render('user/cart', { cart: cart, layout: 'main' });
      // })
    })
});

// cartRouter.route('/coupon')
// .post((req,res,next)=>{
//     Coupons.findOne({code:req.body.coupon})
//     .then((coupon)=>{
//         if(coupon){
//             if(coupon.status == "Active"){
//                 if(coupon.type=="Fixed"){
//                     Cart.findOneAndUpdate({userId:req.user.id},{$set:{discount:coupon.value}})
//                     .then(()=>{
//                         res.redirect('/cart')
//                         next 
//                     })
//                 }else{
//                     Cart.findOne({userId:req.user.id})
//                     .then((cart)=>{
//                         cart.discount = (coupon.value*cart.total)/100;
//                         cart.save()
//                         .then(()=>{
//                             res.redirect('/cart')
//                             next
//                         })
//                     })
//                 }
//             }else{
//                 req.flash('success_msg',"Invalid Coupon");
//                 res.locals.redirect = "/cart";
//                 next();
//             }
//         }else{
//             req.flash('success_msg',"Invalid Coupon");
//             res.locals.redirect = "/cart";
//             next();
//         }
//     })
// })

router.get(('/add/:productId'), isLoggedIn, (req, res, next) => {
  if (req.user) {
    Cart.findOne({ userId: req.user.id })
      .then((cart) => {
        Cart.findOneAndUpdate({ userId: req.user.id }, { $push: { items: { productId: req.params.productId, qty: 1 } } }, { new: true, useFindAndModify: false })
          .then((results) => {
            res.redirect('/cart')
            next
          })
      })
  } else {
    // req.toastr.error('You are not Logged in')
    res.redirect('/')
  }
})


router.get(('/increase/:productId'), isLoggedIn, (req, res) => {
  Cart.findOne({ userId: req.user.id })
    .then((cart) => {
      for (var i = 0; i <= cart.items.length - 1; i++) {
        if (cart.items[i].productId == req.params.productId) {
          cart.items[i].qty++;
        }
      }
      cart.save()
        .then(() => {
          res.redirect(req.get('referer'))
          next
        })

    })
})

router.get(('/decrease/:productId'), isLoggedIn, (req, res) => {
  Cart.findOne({ userId: req.user.id })
    .then((cart) => {
      for (var i = 0; i <= cart.items.length - 1; i++) {
        if (cart.items[i].productId == req.params.productId) {
          cart.items[i].qty--;
        }
      }
      cart.save()
        .then(() => {
          res.redirect(req.get('referer'))
          next
        })

    })
})


router.get(('/remove/:productId'), isLoggedIn, (req, res, next) => {
  if (req.user) {
    Cart.findOne({ userId: req.user.id })
      .then((cart) => {
        for (var i = 0; i <= cart.items.length - 1; i++) {
          if (cart.items[i].productId == req.params.productId) {
            cart.items[i].remove();
          }
        }
        cart.save()
          .then(() => {
            res.redirect(req.get('referer'))
            next
          })
      })
  } else {
    req.toastr.error('You are not Logged in')
    res.redirect('/')
  }
})

function makeid(length) {
  var result = '';
  var characters = '0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


router.get(('/paytm'), isLoggedIn, (req, res, next) => {
  if (req.user) {
    var price = req.query.price;
    var address = req.query.address;
    Cart.findOne({ userId: req.user.id })
      .then((cart) => {
        var arr = [];
        var orderId = "ORDER" + makeid(5);
        for (var i = 0; i <= cart.items.length - 1; i++) {
          arr.push({ productId: cart.items[i].productId, qty: cart.items[i].qty, date: Date.now(), orderId: orderId, address: address })
        }
        var date = new Date()
        Orders.findOneAndUpdate({ userId: req.user.id }, { $push: { items: arr }, $set: { updateDate: date } }, { new: true, useFindAndModify: false })
          .then((orders) => {
            for (var i = 0; i <= cart.items.length - 1; i++) {
              cart.items[i].remove();
            }
            cart.save()
              .then(() => {
                // console.log(price);
                Settings.findOne({ name: 'gambo' })
                  .then((setting) => {
                    // console.log(setting);
                    var paytmParams = {
                      "MID": setting.merchantId,
                      "WEBSITE": setting.website,
                      "INDUSTRY_TYPE_ID": setting.industryType,
                      "CHANNEL_ID": setting.channelId,
                      "ORDER_ID": 'TEST_' + new Date().getTime(),
                      "CUST_ID": req.user.id.toString(),
                      "MOBILE_NO": req.user.phone,
                      "EMAIL": req.user.emailaddress,
                      "TXN_AMOUNT": price,
                      "CALLBACK_URL": setting.callbackUrl,
                    };
                    // console.log(paytmParams);

                    checksum_lib.genchecksum(paytmParams, setting.merchantKey, function (err, checksum) {
                      var url = setting.transactionUrl;
                      res.writeHead(200, { 'Content-Type': 'text/html' });
                      res.write('<html>');
                      res.write('<head>');
                      res.write('<title>Merchant Checkout Page</title>');
                      res.write('</head>');
                      res.write('<body>');
                      res.write('<center><h1>Please do not refresh this page...</h1></center>');
                      res.write('<form method="post" action="' + url + '" name="paytm_form">');
                      for (var x in paytmParams) {
                        res.write('<input type="hidden" name="' + x + '" value="' + paytmParams[x] + '">');
                      }
                      res.write('<input type="hidden" name="CHECKSUMHASH" value="' + checksum + '">');
                      res.write('</form>');
                      res.write('<script type="text/javascript">');
                      res.write('document.paytm_form.submit();');
                      res.write('</script>');
                      res.write('</body>');
                      res.write('</html>');
                      res.end();
                    });
                  })
              })

          })
      })
  }
  else {

  }
})



module.exports = router;
