var express = require('express');
var router = express.Router();
var product = require('../models/addproduct')
var area = require('../models/addarea')
var location = require('../models/addlocation')
var customer = require('../models/signup')
var category = require('../models/category')
var shop = require('../models/addshop')
var offer = require('../models/offer')
var Settings = require('../models/settings')
var User = require('../models/signup')
var posts = require('../models/posts')
var post_tags = require('../models/post_tags')
var postcategory = require('../models/postcategory')
const Orders = require('../models/order');
const banner = require('../models/banner')
// const report = require('../models/reports');
var multer = require('multer');
var path = require('path')
var passport = require('passport');
const { render } = require('ejs');
const { start } = require('repl');
const { use } = require('passport');
const { settings } = require('../app');


var storage = multer.diskStorage({

  destination: process.cwd() + '/public/uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  }
});

const upload = multer({
  storage: storage,
})

//Checking function login or not
function isLoggedIn(req, res, next) {
  // console.log("hello"+req.isAuthenticated())
  if (req.isAuthenticated())
    return next()
  else
    res.redirect('/admin');
}

function notLoggedIn(req, res, next) {
  // console.log("hello"+i+req.isAuthenticated())
  if (!req.isAuthenticated())
    return next();
  else
    res.redirect('/admin/home');
}


router.get('/', notLoggedIn, function (req, res, next) {
  // req.session.destroy();
  Settings.find({})
    .then(() => {
      res.render('admin/login', { login: true, layout: 'backend' });

    })
});
router.post('/', passport.authenticate('local.userlogin'), (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (user.admin == true) {
        // req.session.loggedin = true;
        // req.session.userId = user.id;
        // req.failureFlash=true
        res.redirect('/admin/home');

        next
      } else {
        req.flash('success_msg', 'Not authorized');
        res.redirect('/admin');
        next
      }
    })

});


router.get('/logout', isLoggedIn, (req, res, next) => {
  req.logout();
  req.flash('success_msg', "You are logged Out");
  // req.destroy();
  res.redirect('/admin');
})

router.get('/home', isLoggedIn, function (req, res, next) {
  Settings.find({})
    .then(() => {
      shop.find({})
        .then((shop) => {
          product.find({})
            .then((product) => {
              User.find({})
                .then((user) => {
                  Orders.find({})
                    .populate({
                      path: 'items',
                      populate: {
                        path: 'productId',
                        model: 'addproduct'
                      }
                    })
                    .exec()
                    .then((order) => {
                      res.render('admin/adminhome', { product: product, shop: shop, order: order, user: user, layout: 'backend' });
                    })
                })

            })

        })

    })
});

router.get('/add-area', isLoggedIn, function (req, res, next) {
  Settings.find({})
    .then(() => {
      location.find({})
        .then((locations) => {
          res.render('admin/add-area', { layout: 'backend', locations: locations });
        })
    })
});

router.post('/add-area', isLoggedIn, function (req, res, next) {
  area.create({ areas, locations, status } = req.body)
    .then(() => {
      res.redirect('/admin/areas');

    })
});
router.get('/edit-area/:areaid', isLoggedIn, function (req, res, next) {
  Settings.find({})
    .then(() => {

      area.findById(req.params.areaid)
        .then((area) => {
          location.find({})
            .then((locations) => {
              res.render('admin/edit-area', { list: area, layout: 'backend', locations: locations });
            })
        })
    })
});

router.post('/edit-area/:areaid', isLoggedIn, function (req, res, next) {
  // res.json(req.body)
  area.findByIdAndUpdate(req.params.areaid, { $set: req.body }, { new: true })
    .then((customer) => {
      res.redirect('/admin/areas');

    })
});


router.get('/areas', isLoggedIn, function (req, res, next) {
  Settings.find({})
    .then(() => {
      area.find({})
        .then((area) => {
          res.render('admin/area', { list: area, layout: 'backend' });
        })
    })
});


router.get('/add-category', isLoggedIn, function (req, res, next) {
  Settings.find({})
    .then(() => {

      res.render('admin/add-category', { layout: 'backend' });
    })

});

router.post('/add-category', upload.single('cimage'), function (req, res, next) {
  // var filepath=req.file.filename
  category.create({
    cname: req.body.cname,
    status: req.body.status,
    description: req.body.description,
    cimage: req.file.filename,
  })

    .then((categorys) => {
      res.redirect('/admin/category');
    })
});

router.get('/edit-category/:id', isLoggedIn, function (req, res, next) {

  category.findById(req.params.id)
    .then((category) => {
      res.render('admin/edit-category', { list: category, layout: 'backend' });

    })
});

router.post('/edit-category/:id', upload.single('cimage'), function (req, res, next) {
  // res.json(req.body)
  category.findByIdAndUpdate(req.params.id, {
    $set: {
      cname: req.body.cname,
      status: req.body.status,
      description: req.body.description,
      cimage: req.file.filename,
    }
  }, { new: true })
    .then((customer) => {
      res.redirect('/admin/category');
      next

    })
});


router.get('/category', isLoggedIn, function (req, res, next) {
  category.find({})
    .then((categories) => {
      res.render('admin/category', { list: categories, layout: 'backend' });

    })
});



router.get('/add-location', isLoggedIn, function (req, res, next) {
  res.render('admin/add-location', { layout: 'backend' });
});
router.post('/add-location', function (req, res, next) {
  location.create({ locations, status } = req.body)
    .then(() => {
      res.redirect('/admin/locations');

    })
});


router.get('/edit-location/:locationid', isLoggedIn, function (req, res, next) {
  location.findById(req.params.locationid)
    .then((location) => {
      res.render('admin/edit-location', { list: location, layout: 'backend' });

    })
});

router.post('/edit-location/:locationid', function (req, res, next) {
  // res.json(req.body)
  location.findByIdAndUpdate(req.params.locationid, { $set: req.body }, { new: true })
    .then((customer) => {
      res.redirect('/admin/locations');
      next

    })
});

router.get('/locations', isLoggedIn, function (req, res, next) {
  location.find({})
    .then((location) => {
      res.render('admin/location', { list: location, layout: 'backend' });

    })
});



// router.get('/add-menu', function (req, res, next) {
//   res.render('admin/add-menu', { layout: 'backend' });
// });

router.get('/add-offer', isLoggedIn, function (req, res, next) {
  res.render('admin/add-offers', { layout: 'backend' });
});
router.post('/add-offer', upload.single('offerimage'), function (req, res, next) {
  offer.create({
    title: req.body.title,
    discount: req.body.discount,
    addproduct: req.body.addproduct,
    status: req.body.status,
    offerimage: req.file.filename,
    description: req.body.description
  })
    .then(() => {
      res.redirect('/admin/offers');

    })
});

router.get('/edit-offer/:offerid', isLoggedIn, function (req, res, next) {
  offer.findById(req.params.offerid)
    .then((location) => {
      res.render('admin/edit-offer', { list: location, layout: 'backend' });

    })
});

router.post('/edit-offer/:offerid', upload.single('offerimage'), function (req, res, next) {
  // res.json(req.body)
  offer.findByIdAndUpdate(req.params.offerid, {
    $set: {
      title: req.body.title,
      discount: req.body.discount,
      addproduct: req.body.addproduct,
      status: req.body.status,
      offerimage: req.file.filename,
      description: req.body.description
    }
  }, { new: true })
    .then((customer) => {
      res.redirect('/admin/offers');
      next

    })
});



router.get('/offers', isLoggedIn, function (req, res, next) {
  offer.find({})
    .then((offer) => {
      res.render('admin/offers', { list: offer, layout: 'backend' });

    })
});

router.get('/post-categories', isLoggedIn, function (req, res, next) {
  postcategory.find({})
    .then((categories) => {
      res.render('admin/post-category', { categories: categories, layout: 'backend' });

    })
});
router.post('/post-categories', function (req, res, next) {
  // posts.findById({userId:req.user.id})
  postcategory.create({
    postcategory: req.body.postcategory,
    postslug: req.body.postslug,
  })
    .then((shop) => {
      // res.json(req.body);
      res.redirect('/admin/post-categories')

    })

});



router.get('/posts-tags', isLoggedIn, function (req, res, next) {
  post_tags.find({})
    .then((tags) => {
      res.render('admin/posts-tags', { tags: tags, layout: 'backend' });

    })
});

router.post('/posts-tags', function (req, res, next) {
  // posts.findById({userId:req.user.id})
  post_tags.create({
    tagname: req.body.tagname,
    slugs: req.body.slugs,
  })
    .then((shop) => {
      // res.json(req.body);
      res.redirect('/admin/posts-tags')

    })

});


router.get('/posts', isLoggedIn, function (req, res, next) {
  posts.find({})
    .then((post) => {
      res.render('admin/posts', { post: post, layout: 'backend' });
    })

});


router.get('/add-post', isLoggedIn, function (req, res, next) {
  postcategory.find({})
    .then((categorys) => {
      res.render('admin/add-posts', { categorys: categorys, layout: 'backend' });
    })
});
router.post('/add-post', upload.single('images'), function (req, res, next) {
  // posts.findById({userId:req.user.id})
  posts.create({
    title: req.body.title,
    content: req.body.content,
    publish: req.body.publish,
    draft: req.body.draft,
    category: req.body.category,
    tags: req.body.tags,
    images: req.file.filename
  })
    .then((shop) => {
      // res.json(req.body);
      res.redirect('/admin/posts')

    })

});

router.get('/edit-posts/:id', isLoggedIn, function (req, res, next) {
  posts.findById(req.params.id)
    .then((posts) => {
      postcategory.find({})
        .then((categorys) => {
          res.render('admin/edit-posts', { list: posts, categorys: categorys, layout: 'backend' });

        })

    })
});

router.post('/edit-posts/:id', upload.single('images'), function (req, res, next) {
  // res.json(req.body)
  posts.findByIdAndUpdate(req.params.id, {
    $set: {

      title: req.body.title,
      content: req.body.content,
      publish: req.body.publish,
      draft: req.body.draft,
      category: req.body.category,
      tags: req.body.tags,
      images: req.file.filename
    }
  }, { new: true })
    .then((customer) => {
      res.redirect('/admin/posts');
      next

    })
});


// PRODUCT ADDING
router.get('/add-product', isLoggedIn, function (req, res, next) {
  category.find({})
    .then((categorys) => {
      Settings.find({})
      .then(()=>{
        res.render('admin/add-products', { categorys: categorys, layout: 'backend' });

      })
    })

});


// adding product
router.post('/add-product', upload.array('images', 5), (req, res) => {
  // res.json({body:req.body,files:req.files})

  product.create({
    productname: req.body.productname,
    category: req.body.category,
    price: req.body.price,
    discountmrp: req.body.discountmrp,
    status: req.body.status,
    description: req.body.description,
    discount: req.body.discount,
    description: req.body.description,
    benefits: req.body.benefits,
    seller: req.body.seller,
    howtouse: req.body.howtouse,
    disclaimer: req.body.disclaimer

    // images:req.files.originalname
  })
    .then((product) => {
      for (var i = 0; i <= req.files.length - 1; i++) {
        product.images.push(req.files[i].filename)

      } product.save().then(() => {
        res.redirect('/admin/products')

      })
    })

});

router.get('/edit-products/:userid', isLoggedIn, function (req, res, next) {
  product.findById(req.params.userid)
    .then((product) => {
      category.find({})
        .then((categorys) => {
          res.render('admin/edit-products', { list: product, categorys: categorys, layout: 'backend' });

        })

    })
});
router.post('/edit-products/:userid', upload.array('images', 5), function (req, res, next) {
  // res.json(req.body)
  product.findByIdAndUpdate(req.params.userid, {
    $set: {
      productname: req.body.productname,
      category: req.body.category,
      price: req.body.price,
      discountmrp: req.body.discountmrp,
      status: req.body.status,
      description: req.body.description,
      discount: req.body.discount,
      description: req.body.description,
      benefits: req.body.benefits,
      seller: req.body.seller,
      howtouse: req.body.howtouse,
      disclaimer: req.body.disclaimer
    }
  }, { new: true })
    .then((product) => {
      for (var i = 0; i <= req.files.length - 1; i++) {
        product.images.push(req.files[i].filename)

      } product.save().then(() => {
        res.redirect('/admin/products')

      })
    })
});

router.get('/product/delete/:userid', isLoggedIn, function (req, res, next) {
  product.findByIdAndDelete(req.params.userid)
    .then((customer) => {
      res.redirect(req.get('referer'));

    })
});


router.get('/products-view/:id', isLoggedIn, function (req, res, next) {
  product.findById(req.params.id)
    .then((product) => {
      res.render('admin/products-view', { list: product, layout: 'backend' });

    })
});


// product pages
router.get('/products', isLoggedIn, function (req, res, next) {
  product.find({})
    .then((products) => {
      // console.log(products);

      res.render('admin/products', { list: products, layout: 'backend' });

    })
});


router.get('/add-banner', isLoggedIn, function (req, res, next) {
  category.find({})
    .then((categorys) => {
      // console.log(products);
      res.render('admin/add-banner', { categorys: categorys, layout: 'backend' });
    })
});

router.post('/add-banner', upload.single('bannerimage'), function (req, res, next) {
  banner.create({
    bannertitle: req.body.bannertitle,
    discount: req.body.discount,
    bannerimage: req.file.filename,
    category: req.body.category
  })

    .then((categorys) => {
      // console.log(products);
      res.redirect('/admin/banner');
    })
});

router.get('/banner', isLoggedIn, function (req, res, next) {
  banner.find({})
    .then((banner) => {
      // console.log(products);
      res.render('admin/banner', { banner: banner, layout: 'backend' });
    })
});

router.get('/banner/delete/:bannerid', isLoggedIn, function (req, res, next) {
  banner.findByIdAndDelete(req.params.bannerid)
    .then((banner) => {
      res.redirect(req.get('referer'));
    })
});


router.get('/add-shop', isLoggedIn, function (req, res, next) {
  location.find({})
    .then((locations) => {
      category.find({})
        .then((categories) => {
          area.find({})
            .then((areas) => {
              res.render('admin/add-shop', { layout: 'backend', areas: areas, locations: locations, categories: categories });
            })
        })
    })
});

router.post('/add-shop', upload.single('image'), function (req, res, next) {
  // res.json(req.body)
  shop.create({
    shopname: req.body.shopname,
    locations: req.body.location,
    areas: req.body.areas,
    categorys: req.body.categorys,
    deliverycharge: req.body.deliverycharge,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    currentstatus: req.body.currentstatus,
    status: req.body.status,
    address: req.body.address,
    description: req.body.description,
    image: req.file.filename,
    openingtime: req.body.openingtime,
    closingtime: req.body.closingtime,
    fullname: req.body.fullname,
    username: req.body.username,
    email: req.body.email,
    phone: req.body.phone,
    owenraddress: req.body.owenraddress
  })
    .then((shop) => {
      res.redirect('/admin/shops');

    })
});

router.get('/shop-products/', isLoggedIn, function (req, res, next) {
  res.render('admin/shop-products', { layout: 'backend' });
});

router.get('/shop-view/:id', isLoggedIn, function (req, res, next) {
  shop.findById(req.params.id)
    .then((shop) => {
      // console.log(shop);

      res.render('admin/shop-view', { list: shop, layout: 'backend' });

    })
});

router.get('/edit-shop/:id', isLoggedIn, function (req, res, next) {
  shop.findById(req.params.id)
    .then((shop) => {
      location.find({})
        .then((locations) => {
          category.find({})
            .then((categories) => {
              area.find({})
                .then((areas) => {
                  res.render('admin/edit-shop', { layout: 'backend', list: shop, areas: areas, locations: locations, categories: categories });
                })
            })
        })
    })
});

router.post('/edit-shop/:id', upload.single('image'), function (req, res, next) {
  // res.json(req.body)
  shop.findByIdAndUpdate(req.params.id, {
    $set: {
      shopname: req.body.shopname,
      locations: req.body.locations,
      areas: req.body.areas,
      categorys: req.body.categorys,
      deliverycharge: req.body.deliverycharge,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      currentstatus: req.body.currentstatus,
      status: req.body.status,
      address: req.body.address,
      description: req.body.description,
      image: req.file.filename,
      openingtime: req.body.openingtime,
      closingtime: req.body.closingtime,
      fullname: req.body.fullname,
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      owenraddress: req.body.owenraddress
    }
  })
    .then((customer) => {
      res.redirect('/admin/shops');
      next

    })
});

router.get('/shops', isLoggedIn, function (req, res, next) {
  shop.find({})
    .then((shop) => {
      res.render('admin/shops', { list: shop, layout: 'backend' });

    })
});




router.get('/customer-edit/:userid', isLoggedIn, function (req, res, next) {
  customer.findById(req.params.userid)
    .then((customer) => {
      res.render('admin/customer-edit', { list: customer, layout: 'backend' });

    })
});
router.post('/customer-edit/:userid', function (req, res, next) {
  // res.json(req.body)
  customer.findByIdAndUpdate(req.params.userid, { $set: req.body }, { new: true })
    .then((customer) => {
      res.redirect('/admin/customers');
      next
    })
});

router.get('/customers/delete/:userid', isLoggedIn, function (req, res, next) {
  customer.findByIdAndDelete(req.params.userid)
    .then((customer) => {
      res.redirect(req.get('referer'));

    })
});


router.get('/customer-view/:userid', isLoggedIn, function (req, res, next) {
  customer.findById(req.params.userid)
    .then((customer) => {
      res.render('admin/customer-view', { layout: 'backend', list: customer });
    })
});

router.get('/customers', isLoggedIn, function (req, res, next) {
  customer.find({})
    .then((customers) => {
      // console.log(customers);
      res.render('admin/customer', { list: customers, layout: 'backend' });
    })
});

router.get('/edit-profile', isLoggedIn, function (req, res, next) {
  User.findById(req.user.id)
    .then((profile) => {
      res.render('admin/edit-profile', { layout: 'backend', profile: profile });
    })
});

router.post('/edit-profile', upload.single('images'), isLoggedIn, function (req, res, next) {
  User.findByIdAndUpdate(req.user.id, { $set: { images: req.file.filename, username: req.body.username, phone: req.body.phone, fullname: req.body.fullname } }, { new: true, useFindAndModify: false })
    .then((profile) => {
      res.render('admin/edit-profile', { layout: 'backend', profile: profile });
    })
});

router.get('/general-setting', isLoggedIn, function (req, res, next) {
  Settings.findOne({ name: 'gambo' })
    .then((setting) => {
      res.render('admin/general-setting', { layout: 'backend', setting: setting })
    })
})

router.post('/general-setting', function (req, res, next) {
  Settings.findOneAndUpdate({ name: 'gambo' }, { $set: { siteName: req.body.siteName, siteTitle: req.body.siteTitle, siteDescription: req.body.siteDescription } })
    .then((settings) => {
      res.redirect('/admin/general-setting')
      next
    })
});

router.get('/general-setting-analysis', isLoggedIn, function (req, res, next) {
  Settings.findOne({ name: 'gambo' })
    .then((setting) => {
      res.render('admin/general-setting-analysis', { layout: 'backend', setting: setting })
    });
})

router.post('/general-setting-analysis', function (req, res, next) {
  Settings.findOneAndUpdate({ name: 'gambo' }, { $set: { analyticsId: req.body.analyticsId } })
    .then(() => {
      res.redirect('/admin/general-setting-analysis')
      next
    })
});


router.get('/general-setting-contact', isLoggedIn, function (req, res, next) {
  Settings.findOne({ name: 'gambo' })
    .then((setting) => {
      res.render('admin/general-setting-contact', { layout: 'backend', setting: setting })
    });
})
router.post('/general-setting-contact', function (req, res, next) {
  Settings.findOneAndUpdate({ name: 'gambo' }, { $set: { contactEmail: req.body.contactEmail, contactPhone: req.body.contactPhone, contactLocation: req.body.contactLocation } })
    .then(() => {
      res.redirect('/admin/general-setting-contact')
      next
    })
});

router.get('/general-setting-favicon', isLoggedIn, function (req, res, next) {
  Settings.findOne({ name: 'gambo' })
    .then((setting) => {
      res.render('admin/general-setting-fav', { layout: 'backend', setting: setting })
    });
})

router.post('/general-setting-favicon', upload.single('favicon'), function (req, res, next) {
  Settings.findOneAndUpdate({ name: 'gambo' }, { $set: { favicon: req.file.filename } })
    .then(() => {
      res.redirect('/admin/general-setting-fav')
      next
    })
});

router.get('/general-setting-logo', isLoggedIn, function (req, res, next) {
  Settings.findOne({ name: 'gambo' })
    .then((setting) => {
      res.render('admin/general-setting-logo', { layout: 'backend', setting: setting })
    });
})
router.post('/general-setting-logo', upload.single('logo'), function (req, res, next) {

  Settings.findOneAndUpdate({ name: 'gambo' }, { $set: { logo: req.file.filename } })
    .then(() => {
      res.redirect('/admin/general-setting-logo')
      next
    })
});


router.get('/email-setting', isLoggedIn, function (req, res, next) {
  Settings.findOne({ name: 'gambo' })
    .then((setting) => {
      res.render('admin/email-setting', { layout: 'backend', setting: setting })
    });
})
router.post('/email-setting', (req, res, next) => {
  Settings.findOneAndUpdate({ name: 'gambo' }, {
    $set: {
      emailEmail: req.body.emailEmail,
      emailUsername: req.body.emailUsername, emailPassword: req.body.emailPassword
    }
  })
    .then(() => {
      res.redirect('/admin/email-setting')
      next
    })
});



// router.get('/menu', function (req, res, next) {

//   res.render('admin/menu', { hello: 'hello', layout: 'backend' });
// });


router.get('/order-view/:orderId/:itemNo', isLoggedIn, function (req, res, next) {
  Orders.findById(req.params.orderId)
    .populate({
      path: 'items',
      populate: {
        path: 'productId',
        model: 'addproduct'
      }
    })
    .exec()
    .then((order) => {
      res.render('admin/order-view', { item: order.items[req.params.itemNo], layout: 'backend' });

    })
});

router.get('/orders', isLoggedIn, function (req, res) {
  Orders.find({})
    .populate({
      path: 'items',
      populate: {
        path: 'productId',
        model: 'addproduct'
      }
    })
    .exec()
    .then((order) => {
      res.render('admin/order', { order: order, layout: 'backend' });

    })
});


router.get('/payment-setting', isLoggedIn, function (req, res, next) {
  Settings.findOne({ name: 'gambo' })
    .then((setting) => {
      res.render('admin/payment-setting', { setting: setting, layout: 'backend' });

    })
});
router.post('/payment-setting', isLoggedIn, function (req, res, next) {
  Settings.findOneAndUpdate({ name: 'gambo' }, { $set: req.body })
    .then(() => {
      res.redirect(req.get('referer'))

    })
});

router.get('/reports', isLoggedIn, function (req, res, next) {
  var date = new Date();
  var compMonth = date.getMonth() - 1;
  var compYear = date.getFullYear();
  Orders.find({})
    .populate({
      path: 'items',
      populate: {
        path: 'productId',
        model: 'addproduct'
      }
    })
    .populate('userId')
    .exec()
    .then((order) => {
      // console.log(order);

      res.render('admin/reports', { compMonth: compMonth, compYear: compYear, order: order, layout: 'backend' })

    })
})


router.get('/updater', isLoggedIn, function (req, res, next) {
  res.render('admin/updates', { layout: 'backend' });
});


module.exports = router;