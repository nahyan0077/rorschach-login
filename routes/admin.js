var express = require('express');
var router = express.Router();
const collection = require('./mongodb')



//admin login page 
router.get('/admin',(req,res)=>{
  if(req.session.admin){
    res.redirect('/admin_home')
  }else{
    res.render('admin_login')
  }
})



//admin add user
router.get('/adduser',(req,res)=>{
  if(req.session.admin){
    res.render('admin_adduser')
  }else{
    res.send('unauthorised user')
  }
})



//admin home
router.get('/admin_home',(req,res)=>{
  collection.find().then((data)=>{
    if(req.session.admin){
      res.render('admin_home',{data})
    }else{
      res.send('unauthorised user')
    }
  })
})


//admin login details
const emailDB = "nahyan007@gmail.com"
const passwordDB = "121212" 



//admin login route
router.post('/admin',(req,res)=>{

    const {email,password} = req.body;
  
    if(email===emailDB && password===passwordDB){
      req.session.admin=req.body.email
      res.redirect('/admin_home')
    }else if(email==="" || password===""){
      res.render('admin_login',{data: "Please input email and password"})
    }else{
      res.render('admin_login',{data:"Invalid Username or Password"})
    }
})


//admin add user
router.post('/adduser',async (req,res)=>{

  const data = {
    name:req.body.name,
    email:req.body.email,
    password:req.body.password
  }
  await collection.create(data)
  
  if(req.body.name=="" || req.body.email=="" || req.body.password==""){
    res.render('admin_adduser',{addUser:"Please input the details"})
  }else{
    res.render('admin_adduser',{addUser:"User Added Successfully"})
  }
})


// admin edit user
router.post('/updateUser',(req,res)=>{
  const updt = {
    name:req.body.name,
    password:req.body.password,
    email:req.body.email
  }
  var id = req.body._id
  collection.updateOne({_id:id},{$set:{name:updt.name,password:updt.password,email:updt.email}}).then(()=>{
    res.redirect('/admin_home')
  })
  
})


//admin update user post
router.get('/editUser/:id',(req,res)=>{
  let id = req.params.id
  collection.find({_id:id}).then((dat)=>{
    let datas = dat[0]
      if(req.session.admin){
        res.render('edituser_admin',{datas})
      }else{
        res.send('unauthorised user')
      }
  })
})


//delete user admin
router.get('/deleteUser/:id',(req,res)=>{
  let idd = req.params.id
  collection.deleteOne({_id:idd},{}).then(()=>{
    res.redirect('/admin_home')
  })
})


//admin logout
router.get('/logout_admin',(req,res)=>{
  req.session.destroy((err)=>{
    if(err){
      res.send('error')
    }else{
      var logout = true
      res.render('admin_login',{logout})
    }
  })
})


module.exports=router