const express=require('express');
const {loginUser,registerUser, password,get,usercount, start}=require('./aut-controller');
const user = require('./user');
const router=express.Router();
router.post('/register',registerUser);
router.post('/login',loginUser);
router.put('/password/:email',password);
router.get('/get/:email',get);
router.post('/userwin',usercount);
router.post('/start',start);







module.exports=router