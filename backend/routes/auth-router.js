const express=require('express');
const {loginUser,registerUser, password,get,usercount,like,addPost, start}=require('./aut-controller');
const user = require('./user');
const router=express.Router();
router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/addpost',addPost);
router.put('/password/:email',password);
router.get('/get/:email',get);
router.post('/userwin',usercount);
router.post('/start',start);
router.post('/like',like);







module.exports=router
