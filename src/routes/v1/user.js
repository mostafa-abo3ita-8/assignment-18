const router=require('express').Router();const c=require('../../controllers/user');const v=require('../../middlewares/verifyToken');
router.get('/dashboard',v,c.dashboard);
router.get('/find/all',v,c.getAllUsers);
router.get('/:id',v,c.getProfile);
router.put('/:id',v,c.updateProfile);
router.post('/toggle-connection',v,c.toggleConnection);
module.exports=router;
