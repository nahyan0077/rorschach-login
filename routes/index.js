var express = require("express");
var router = express.Router();
const collection = require("./mongodb");
const prodCollection = require('./productModel')
const passport = require('passport');

//home page
router.get("/", function (req, res, next) {
  if (req.session.user) {
    res.redirect("/products");
  } else if (req.session.admin) {
    res.redirect("/admin_home");
  } else {
    res.render("login");
  }
});

//admin login route
router.post("/login", async (req, res) => {

  const check = await collection.findOne({ email: req.body.email });
  req.session.user = req.body.email;
  if (req.body.email === "" || req.body.password === "") {
    res.render("login", {
      data: "Please input email and password",
      user: req.session.user,
    });
  }

  if (check.password === req.body.password) {
    res.redirect("/products");
  } else {
    res.render("login", { data: "Invalid Username or Password" });
  }
});

//sign up route
router.get("/signup", (req, res) => {
  res.render("signup");
});

//user signup
router.post("/signup", async (req, res) => {
  const data = {
    name: req.body.name,
    password: req.body.password,
    email: req.body.email,
  };

  await collection.create(data);
  var signup = true;
  res.render("login", { signup });
});

router.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

router.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure'
}));

function isLogged (req,res,next){
  if(req.user){
    next()
  }else{
    res.sendStatus(401)
  }
}

router.get('/auth/google/success',isLogged,(req,res)=>{
  let name = req.user.displayName
  res.redirect(`hi ${name}`)
})

router.get('/auth/google/faliure',(req,res)=>{
  res.send('google auth failed')
})


//route for dashboard
router.get("/dashboard", (req, res) => {
  if (req.session.user) {
    res.render("dashboard", { user: req.session.user });
  } else {
    res.send("Unauthorize User");
  }
});



//route products
router.get("/products", async (req, res) => {
  var profile = await collection.findOne({ email: req.session.user });
  const productsData = await prodCollection.find()
 
    var prof = req.user.displayName
  
  
  if (req.session.user) {
    res.render("products", { productsData, prof });
  } else {
    res.send("Unauthorize User");
  }
});


//route cart
router.get("/cart", (req, res) => {
  if (req.session.user) {
    res.render("cart");
  } else {
    res.send("no user found");
  }
});


//route logout
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.send("Error");
    } else {
      var logout = true;
      res.render("login", { logout });
    }
  });
});


module.exports = router;
