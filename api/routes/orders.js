const express = require("express");
const Order = require("../models/order");
const Product = require("../models/product");
const mongoose = require("mongoose");
const authentication = require("../middleware/authentication");

const router = express.Router();

router.get("/", authentication, (req, res) => {
  Order.find()
    .populate("productId", "name")
    .exec()
    .then((result) => {
      if (result.length > 0) {
        res.status(200).json({
          count: result.length,
          Orders: result.map((order) => {
            return {
              _id: order._id,
              productId: order.productId,
              quantity: order.quantity,
              request: {
                type: "GET",
                url: `http://localhost:3000/orders/${order._id}`,
              },
            };
          }),
        });
      } else {
        res.status(200).json({ message: "No Orders found!" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/", authentication, (req, res) => {
  const productId = req.body.productId;
  const quantity = req.body.quantity;
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({ message: "Product not found!" });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: quantity,
        productId: productId,
      });
      return order.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "Order saved!",
        createdOrder: {
          _id: result._id,
          productId: result.productId,
          quantity: result.quantity,
        },
        request: {
          type: "GET",
          url: `http://localhost:3000/orders/${result._id}`,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/:orderId", authentication, (req, res) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .populate("productId", "name")
    .exec()
    .then((order) => {
      if (order) {
        res.status(200).json({
          order: order,
          request: {
            type: "GET",
            url: `http://localhost:3000/orders`,
          },
        });
      } else {
        res.status(404).json({ message: "Not found!" });
      }
    });
});

router.delete("/:orderId", authentication, (req, res) => {
  const orderId = req.params.orderId;
  Order.deleteOne({ _id: orderId })
    .then((result) => {
      if (result.deletedCount == 1) {
        res.status(200).json({
          message: "Order Deleted",
          request: {
            type: "GET",
            url: `http://localhost:3000/orders`,
          },
        });
      } else {
        res.status(404).json({ message: "Order not found!" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

module.exports = router;
