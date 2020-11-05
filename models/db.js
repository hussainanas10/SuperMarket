const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Gambo', { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) throw err;
    console.log("Connection setup successfully");
});

require('./banner')
require('./conatctus')
require('./signup')
require('./addproduct')
require('./addarea')
require('./addlocation')
require('./category')
require('./addshop')
require('./offer')
require('./order')
require('./cart1')
require('./settings')
require('./posts')
require('./postcategory')
require('./post_tags')
require('./reports')

// mongodb://103.86.177.201:32768/Gambo