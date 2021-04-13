const express = require("express");
const Product = require("../models/product");
const mongoose = require("mongoose");
const multer = require("multer");
const authentication = require("../middleware/authentication");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads/");
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});
const fileFilter = (req, file, callback) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    callback(null, true); // accept a file
  } else {
    callback(null, false); // reject a file
  }
};
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, //5MB
  fileFilter: fileFilter,
});
const router = express.Router();

router.get("/", (req, res) => {
  Product.find()
    .then((result) => {
      console.log(result);
      const response = {
        count: result.length,
        products: result.map((document) => {
          return {
            name: document.name,
            price: document.price,
            _id: document._id,
            productImage: document.productImage,
            getMoreInfoAt: {
              url: `http://localhost:3000/products/${document._id}`,
              type: "GET",
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: err,
      });
    });
});

router.post("/", authentication, upload.single("productImage"), (req, res) => {
  console.log(req.file.path);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });
  product
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Products post route",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            url: `http://localhost:3000/products/${result._id}`,
            type: "GET",
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: err,
      });
    });
});

router.get("/:productId", (req, res) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .select("name price productImage")
    .then((result) => {
      if (result) {
        res.status(200).json({
          product: result,
          request: {
            type: "GET",
            url: "http://localhost:3000/products",
          },
        });
      } else {
        res.status(404).json({
          message: "No Product found!",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: err,
      });
    });
});

router.patch("/:productId", authentication, (req, res) => {
  const productId = req.params.productId;
  const updateOptions = {};
  for (const option of req.body) {
    updateOptions[option.propName] = option.value;
  }
  Product.updateOne({ _id: productId }, { $set: updateOptions })
    .then((result) => {
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "GET",
          url: `http://localhost:3000/products${productId}`,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete("/:productId", authentication, (req, res) => {
  const productId = req.params.productId;
  Product.deleteOne({ _id: productId })
    .then((result) => {
      if (result.deletedCount == 1) {
        res.status(200).json({
          message: "deleted",
          request: {
            type: "GET",
            url: `http://localhost:3000/product`,
          },
        });
      } else {
        res.status(404).json({
          message: "Not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: err,
      });
    });
});

module.exports = router;
