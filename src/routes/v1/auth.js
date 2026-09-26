const router=require('express').Router();
const c=require('../../controllers/auth');
const verify=require('../../middlewares/verifyToken');
router.post('/register',c.register);
router.post('/login',c.login);
router.get('/me',verify,c.me);
module.exports=router;
