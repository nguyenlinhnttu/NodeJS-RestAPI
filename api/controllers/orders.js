const mongoose = require('mongoose')
const Order = require('../model/order')

exports.order_get_all = (req,res,next)=>{
    Order.find()
    .select('product _id quantity')
    .populate('product', 'name price number')
    .exec()
    .then(results =>{
        console.log(results)
        res.status(200).json({
            count :results.length,
            list_order : results.map(result =>{
                return{
                    _id : result._id,
                    product :result.product,
                    quantity :result.quantity,
                    detail:{
                     url : "localhost:3001/orders/"+result._id
                    }
                }
            }),
            
        })
    })
    .catch(error=>{
        console.log(error)
        res.status(500).json(error)
    });
}

exports.create_new_order = (req,res,next)=>{
    const order = new Order({
        _id : mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product :req.body.productId
    });
    order
    .save()
    .then(result =>{
        res.status(201).json(result);
    })
    .catch(error =>{
        res.status(500).json(error);
    });
    
}

exports.find_order_detail = (req,res,next)=>{
    const orderId = req.params.orderId
    Order.findById(orderId)
    .select('product _id quantity')
    .populate('product', 'name price number')
    .exec()
    .then(result =>{
        console.log(result)
        if (result) {
            res.status(200).json(result)
        } else{
            res.status(404).json({
                message : "OrderId not found!!"
            })
        }
    })
    .catch(error=>{
        console.log(error)
        res.status(500).json(error)
    });
}

exports.update_order = (req,res,next) =>{
    const orderId = req.params.orderId
    const order = new Order({
        quantity :req.body.quantity,
        product :req.body.product
    })
    Order.update({_id :orderId}, {$set:{
        quantity :order.quantity,
        product:order.product
    }})
    .exec()
    .then(result =>{
        if (result.nModified == 1) {
            res.status(200).json({
                message : "Update Order success!"
            });
        } else{
            res.status(200).json({
                message : "No Order matching!!"
            });
        }
    })
    .catch(error =>{
        res.status(500).json(error);
    })
}

exports.delete_order = (req,res,next)=>{
    const orderId = req.params.orderId
    Order.remove({_id:orderId})
    .exec()
    .then(result =>{
        res.status(201).json({
            message: 'Order Deleted',
            result : result
        });
    })
    .catch(error =>{
        res.status(500).json(error);
    });
    
}