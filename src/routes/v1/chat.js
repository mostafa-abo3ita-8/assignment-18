const router=require('express').Router();const c=require('../../controllers/chat');const v=require('../../middlewares/verifyToken');
router.post('/conversations',v,c.createOrGet);
router.get('/conversations',v,c.list);
router.get('/conversations/:id',v,c.get);
router.get('/conversations/:id/messages',v,c.messages);
module.exports=router;
