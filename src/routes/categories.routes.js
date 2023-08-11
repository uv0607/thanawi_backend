const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/categories.controller");

router.get("/all-categories", categoriesController.getAllCategories);
router.post("/add-categories", categoriesController.addCategories);


module.exports = router;
