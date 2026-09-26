const router=require('express').Router();const c=require('../../controllers/comment');const v=require('../../middlewares/verifyToken');
router.get('/:postId',v,c.getAll);
router.post('/:postId',v,c.create);
router.put('/:commentId',v,c.update);
router.delete('/:commentId',v,c.delete);
router.delete('/:commentId/hard',v,c.hardDelete);
router.put('/:commentId/reaction',v,c.react);
module.exports=router;
