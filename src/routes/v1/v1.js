const router=require('express').Router();
router.use('/auth',require('./auth'));
router.use('/user',require('./user'));
router.use('/post',require('./post'));
router.use('/comment',require('./comment'));
router.use('/chat',require('./chat'));
module.exports=router;
