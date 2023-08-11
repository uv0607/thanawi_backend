const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

const authGard = require("../middleware/authGard");

router.patch("/update-profile",authGard.AuthValidator,userController.updateProfile);
router.get("/all-user",userController.allUser);


module.exports = router;
