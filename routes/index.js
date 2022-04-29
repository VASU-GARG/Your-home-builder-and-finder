
var express = require('express');
var router = express.Router();

const bodyParser = require('body-parser');

var collectionModel = require('./mongoose');

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var crypto = require("crypto");

let secrateKey = "secrateKey";

function encrypt(text) {
    encryptalgo = crypto.createCipher('aes192', secrateKey);
    let encrypted = encryptalgo.update(text, 'utf8', 'hex');
    encrypted += encryptalgo.final('hex');
    return encrypted;
}

function decrypt(encrypted) {
    decryptalgo = crypto.createDecipher('aes192', secrateKey);
    let decrypted = decryptalgo.update(encrypted, 'hex', 'utf8');
    decrypted += decryptalgo.final('utf8');
    return decrypted;
}

var bcrypt = require('bcryptjs');


/* GET login page. */
router.get('/', function(req, res, next) {
  let userDet = req.session.userRecord;
  res.render('home',{user: userDet});
});

router.get('/home',function(req,res){
  let userDet = req.session.userRecord;
  res.render('home',{user: userDet });
})

/* GET home page. */
router.get('/signIn', function(req, res, next) {
  res.render('signIn');
});

router.get('/signUp', function(req, res, next) {
  res.render('signUp');
});


// /* GET buy page */
// router.get('/buy',function(req,res)
// {
//   res.render('buy');
// });


// /* GET sell page */
// router.get('/sell',function(req,res)
// {
//   let userDet = req.session.userRecord;
//   res.render('sell',{user: userDet});
// });


/* GET interior page */
router.get('/interior',function(req,res)
{
  res.render('interior');
});


/* GET floor_plans page */
router.get('/floor_plans',function(req,res)
{
  res.render('floor_plans');
});

/* GET build_arch_des page */
router.get('/build_arch_des',function(req,res)
{
  res.render('build_arch_des');
});

/* GET yourAccount page */
router.get('/yourAccount',function(req,res){
  let userDet = req.session.userRecord;
  res.render('your_acc',{user: userDet });
})


/* GET sell page */
router.get('/property',function(req,res){
  res.render('buy');
})

/* GET about page */
router.get('/about',function(req,res){
  res.render('about');
})


/* GET specific-property page */ 
router.get('/specific-property',function(req,res){
  res.render('specific-property');
});


/* GET decor page */ 
router.get('/decor',function(req,res){
  res.render('interior');
});



/* GET logout page */ 
router.get('/logout',function(req,res){
  req.session.destroy();
  res.redirect('/');
});


/* receiving the signIn form data */

router.post('/signIn',urlencodedParser,function(req,res)
{
  let emailEntered = req.body.email;
  let pass = req.body.pass;
  var findRecord = collectionModel.find({email:emailEntered});

  findRecord.exec(function(err,data)
  {
    if(err)
      throw err;
    
    if(data.length == 0)
      res.render('signIn',{message:"Email Id not registered"});
    else{
      // check whether password matches with the password in the database
      if(bcrypt.compareSync(pass,data[0].password))
      {
        req.session.userRecord = data[0];
        res.redirect('/home');
      }
      else{
        res.render('signIn', {message:"Password not matched"});
      }
    }
  })

})

router.post('/signUp', urlencodedParser, function(req,res)
{
  let nameEntered = req.body.name;
  let emailEntered = req.body.email;
  let pass = req.body.password;
  var findRecord = collectionModel.find({email:emailEntered});

  findRecord.exec(function(err,data)
  {
    if(err)
      throw err;
    
    if(data.length > 0 )
    {
      res.render('signIn', {message:"Email Id already registered."});
    }
    else{
        var record = new collectionModel({
          name: nameEntered,
          email: emailEntered,
          password: bcrypt.hashSync(pass,10)
        });

        record.save(function(err,ress)
        {
          if(err) throw err;

          res.render('signUp',{message: "Registered Successfullt.  Login to continue"});
        });
      }
  });
});

module.exports = router;
