const express = require("express");
const router = express.Router();

const companyApplicationController = require("../controllers/companyApplication.controller");

const authGard = require("../middleware/authGard");



router.post("/create-company-application",authGard.AuthValidator,companyApplicationController.createCompanyApplication);
router.get("/get-company-info/:id",companyApplicationController.getCompanyDetails);






module.exports = router;
