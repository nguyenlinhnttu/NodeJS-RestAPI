const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const ProductControler = require('../controllers/products')
//End upload image
//Use to upload image
//NEED: npm install multer
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    //reject file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else {
        cb(null, false);
    }   
}
const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});
router.get('/', checkAuth,ProductControler.get_all_product);

router.post('/',checkAuth,upload.single('productImage'),ProductControler.create_new_product);

router.get('/:productId',checkAuth, ProductControler.get_product_detail);

router.patch('/:productId', checkAuth,ProductControler.update_product);

router.delete('/:productId', checkAuth,ProductControler.delete_product);

module.exports = router;