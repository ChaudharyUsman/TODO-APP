const express = require('express');
const router = express.Router();
const {getAllandDelete, getAllusers} = require('../controller/adminController');

router.get('/users' , getAllusers);
router.delete('/users/:id',getAllandDelete );

module.exports=router;