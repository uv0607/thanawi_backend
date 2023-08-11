const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const categoriesRoutes = require("./categories.routes");
const companyApplicationRoutes = require("./companyApplication.routes");

router.use("/auth", authRoutes); 
router.use("/user", userRoutes); 
router.use("/company-application",companyApplicationRoutes ); 
router.use("/categories", categoriesRoutes); 

module.exports = router;
