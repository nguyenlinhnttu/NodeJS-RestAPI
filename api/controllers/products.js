const mongoose = require('mongoose')
const Product = require('../model/product');

exports.get_all_product = (req, res, next) => {
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            console.log(docs)
            res.status(201).json({
                number: docs.length,
                list_product: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        number: doc.number,
                        _id: doc._id,
                        productImage:doc.productImage,
                        request: {
                            type: "GET",
                            url: "localhost:3001/products/" + doc._id
                        }
                    }
                })
            });
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                error: error
            });
        });
}

exports.create_new_product =(req, res, next) => {
    product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        number: req.body.number,
        productImage: req.file.path
    });
    product.save()
        .then(result => {
            console.log(result)
            res.status(201).json({
                createProduct: product
            });
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                error: error
            });
        });
}

exports.get_product_detail = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id).exec()
        .then(doc => {
            console.log(doc)
            if (doc) {
                res.status(200).json(doc)
            } else {
                res.status(404).json({ message: "Product not found for ID!!" })
            }

        })
        .catch(error => {
            console.log(error)
            res.status(500).json(error)
        });

}

exports.update_product = (req, res, next) => {
    const id = req.params.productId
    product = new Product({
        name: req.body.name,
        price: req.body.price,
        number: req.body.number
    });
    Product.update({ _id: id },
        {
            $set:
            {
                name: product.name,
                price: product.price,
                number: product.number
            }
        })
        .exec()
        .then(result => {
            if (result.nModified == 1) {
                res.status(200).json({
                    message: "Update Product success!"
                });
            } else {
                res.status(200).json({
                    message: "No Product matching!!"
                });
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
}

exports.delete_product = (req, res, next) => {
    const id = req.params.productId
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(error => {
            res.status(500).json(error);
        });
}