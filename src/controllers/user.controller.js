const User = require("../models/user");
const Utils = require("../util/utils");
const tokenSchema = require("../models/authOTP");
const sendEmail = require("../util/sendEmail");

async function updateProfile(req, res) {
  try {
    let users = await User.findOne({ _id: req.user_id }).lean().exec();

    if (!users) {
      return res.status(404).json({ status: false, message: "User Not Found" });
    }
    users = await User.updateOne(
      { _id: users._id },
      {
        $set: {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          mobile_number: req.body.mobile_number,
          country_code: req.body.country_code,
          email: req.body.email,
          business_license: req.body.business_license,
          userType: req.body.userType,
        },
      }
    )
      .lean()
      .exec();

    const updatedData = await User.findOne({ _id: req.user_id }).lean().exec();
    return res.status(200).json({
      status: true,
      message: "Profile Updated Successfully",
      data: updatedData,
    });
  } catch (error) {
    console.error("Error updating profile :", error);
    return res
      .status(400)
      .json({ status: false, message: "Something went wrong" });
  }
}

// async function createPost(req, res) {
//   try {
//     let newPost = new Mentor({
//       title: req.body.title,
//       description: req.body.description,
//       locationUrl: req.body.locationUrl,
//       userType: "mentor",
//       mentorId: req.user_id,
//     });

//     let data = new Mentor(newPost);
//     await data.save();

//     res.status(200).json({
//       status: "success",
//       message: "Poste Created successfully",
//       data: data,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       status: "error",
//       message: error.message || error,
//     });
//   }
// }

async function allUser(req, res) {
  try {
    const { q = "" } = req.query;
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 50);
    const skip = (page - 1) * limit;
    let filterObject = {};

    if (q.length > 0) {
      filterObject.$or = [{ title: { $regex: new RegExp(`${q}`, "i") } }];
      filterObject.$or = [{ postType: { $regex: new RegExp(`${q}`, "i") } }];
    }

    let totalCount = await User.countDocuments(filterObject);
    let totalPages = Math.ceil(totalCount / limit);

    let post = await User.find(filterObject)

      .limit(limit)
      .skip(skip)
      .lean()
      .exec();

    return res.status(200).json({
      status: true,
      message: "Data fetched successfully",
      data: post,
      page: page,
      limit: limit,
      totalCount: totalCount,
      totalPages: totalPages,
    });
  } catch (error) {
    console.log("Error: ", error.message);
    return res.status(400).json({
      status: false,
      message: "Something Went to wrong",
    });
  }
}

module.exports = {
  updateProfile,
  allUser,
};
