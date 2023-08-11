const User = require("../models/user");
const Utils = require("../util/utils");
const bcrypt = require("bcrypt");
const { generateJWT } = require("../middleware/jwtToken");
const sendEmail = require("../util/sendEmail");
const authOTP = require("../models/authOTP");
const tokenSchema = require("../models/authOTP");

async function auth(req, res) {
  try {
    const { phoneNumber, countryCode, email } = req.body;
    let user = await User.findOne({ phoneNumber: phoneNumber });

    // check and validate phoneNumber and email and create a new user
  } catch (error) {
    console.log("Error: ", error || error.message);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

async function checkPhone(req, res) {
  try {
    const { phoneNumber, countryCode } = req.body;
    let user = await User.findOne({
      phoneNumber: phoneNumber,
      countryCode: countryCode,
    })
      .lean()
      .exec();
    console.log("object :>> ", user);
    if (!user) {
      return res.status(404).send({
        status: "error",
        message: "User does not exist",
      });
    }

    const { token } = await generateJWT(user);

    let OTP = Utils.generateOTP();

    // Send OTP to the email

    await sendEmail(
      user.email,
      "Email Verification",
      `Your email verification code is : ${OTP}`
    );
    // store otp into database

    var data = new authOTP({
      phoneNumber: req.body.phoneNumber,
      email: user.email,
      token: OTP,
    });
    await data.save();

    return res.status(200).send({
      status: "success",
      message: "OTP Sent Successfully On Your Email",
      data: user,
      OTP: OTP,
    });
  } catch (error) {
    console.log("error: ", error || error.message);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

async function authRegister(req, res) {
  try {
    let password = await Utils.securePassword(req.body.password);

    let newUser = new User({
      userId: req.body.userId,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      mobile_number: req.body.mobile_number,
      country_code: req.body.country_code,
      email: req.body.email,
      password: password,
      business_license: req.body.business_license,
      userType: req.body.userType,
      businessType: req.body.businessType,
    });

    let user = await User.findOne({ email: req.body.email }).lean().exec();

    if (user) {
      return res.status(400).json({
        status: "error",
        message: "Email Already Exists.",
      });
    }
    // user = await User.findOne({ phoneNumber: req.body.phoneNumber })
    //   .lean()
    //   .exec();

    // if (user) {
    //   return res.status(400).json({
    //     status: "error",
    //     message: "Phone number Already Exists",
    //   });
    // }
    user = new User(newUser);
    await user.save();

    user = await User.findOne({ _id: user._id })
      .select({ password: 0, address: 0 })
      .lean()
      .exec();

    const { token } = await generateJWT(user);

    // let OTP = Utils.generateOTP();

    // await sendEmail(
    //   user.email,
    //   "Email Verification",
    //   `Your email verification code is : ${OTP}`
    // );

    // var data = new authOTP({
    //   phoneNumber: req.body.phoneNumber,
    //   email: req.body.email,
    //   token: OTP,
    // });

    // await data.save();

    return res.status(200).json({
      status: "success",
      message: "Registration Successful ",
      token: token,
      data: user,
      // OTP: OTP,
      // msg: "OTP Sent Successfully On Your Email",
    });
  } catch (error) {
    console.log("error: " + error.message);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Find the user
    let user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    // Compare passwords
    let isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    user = await User.findOne({ _id: user._id }).lean().exec();

    const { token } = await generateJWT(user);

    res.status(200).json({
      status: "success",
      message: "Login Successful",
      token: token,
      data: user,
    });
  } catch (error) {
    console.log("Error1: ", error);

    return res.status(500).json({
      status: "error",
      message: "Something went wrong.",
    });
  }
}

async function forgetPassword(req, res) {
  try {
    const user = await User.findOne({
      // countryCode: req.body.countryCode,
      // phoneNumber: req.body.phoneNumber,
      email: req.body.email,
    })
      .lean()
      .exec();
    console.log(user, ">>>>>>>>>");

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }

    let OTP = Utils.generateOTP();

    await sendEmail(
      user.email,
      "Email Verification",
      `Your email verification code is : ${OTP}`
    );

    var data = new tokenSchema({
      // phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      token: OTP,
    });

    await data.save();

    res.status(200).send({
      status: "success",
      message: "OTP sent successfully",
      OTP: OTP,
      data: user,
    });
  } catch (error) {
    console.log("Error in send mail: ", error.message);
  }
}

async function resetPassword(req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const newPassword = await Utils.securePassword(password);

    let isEmail = await User.findOne({
      email: email,
    });

    if (!isEmail) {
      return res.status(400).json({
        status: "error",
        message: "Email does not exist",
      });
    }

    console.log("PPP ", isEmail);

    let isMatch = await bcrypt.compare(req.body.password, isEmail.password);

    if (isMatch) {
      return res.status(400).json({
        status: "error",
        message: "Password already used, Please enter new password",
      });
    }

    const useeData = await User.updateOne(
      { email: email },
      {
        $set: {
          password: newPassword,
        },
      }
    );

    res
      .status(200)
      .send({ status: "success", message: "password updated successfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function otpVerify(req, res) {
  try {
    let email = await tokenSchema
      .findOne({ email: req.body.email })
      .lean()
      .exec();

    console.log(email), "<<<<<<<";

    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Email does not exist",
      });
    }

    let otp = await tokenSchema
      .findOne({ token: req.body.token })
      .lean()
      .exec();

    if (!otp) {
      return res.status(400).json({
        status: "error",
        message: "Please enter valid OTP",
      });
    }

    // await User.updateOne(
    //   { email: otp.email },
    //   {
    //     $set: { isVerified: true },
    //   }
    // );

    await tokenSchema.deleteOne({ token: req.body.token }).lean().exec();

    let data = await User.findOne({ email: otp.email }).lean().exec();

    const { token } = await generateJWT(data);

    res.status(200).json({
      token: token,
      status: "success",
      data: data,
    });
  } catch (error) {
    console.log("Error: " + error.message);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
}

async function changePassword(req, res) {
  try {
    let users = await User.findOne({ _id: req.user_id }).lean().exec();
    const password = req.body.password;

    const newPassword = await Utils.securePassword(password);

    let isMatch = await bcrypt.compare(req.body.password, users.password);

    if (!isMatch) {
      return res.status(400).json({
        status: "error",
        message: "old password is incorrect",
      });
    }

    users = await User.updateOne(
      { _id: users._id },
      {
        $set: {
          password: newPassword,
        },
      }
    );

    res
      .status(200)
      .send({ status: "success", message: "password updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}

module.exports = {
  auth,
  checkPhone,
  authRegister,
  otpVerify,
  login,
  forgetPassword,
  resetPassword,
  changePassword,
};
