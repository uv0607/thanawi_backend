const Categories = require("../models/categories");

async function getAllCategories(req, res) {
  try {
    const { q = "" } = req.query;
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 50);
    const skip = (page - 1) * limit;
    let filterObject = {};

    if (q.length > 0) {
      filterObject.$or = [
        { categories_name: { $regex: new RegExp(`${q}`, "i") } },
      ];
    }

    let totalCount = await Categories.countDocuments(filterObject);
    let totalPages = Math.ceil(totalCount / limit);

    let data = await Categories.find(filterObject)

      .limit(limit)
      .skip(skip)
      .lean()
      .exec();

    return res.status(200).json({
      status: true,
      message: "Data fetched successfully",
      data: data,
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

async function addCategories(req, res) {
  try {
    let newCategories = new Categories({
      categories_name: req.body.categories_name,
    });
    
    let data = await Categories.findOne({
      categories_name: req.body.categories_name,
    })
      .lean()
      .exec();

    if (data) {
      return res.status(400).json({
        status: "error",
        message: "Categories Already Exists.",
      });
    }

    data = new Categories(newCategories);
    await data.save();

    data = await Categories.findOne({ _id: data._id })
      .lean()
      .exec();
    return res.status(200).json({
      status: "success",
      message: "Add Successful ",
      data: data,
    });
  } catch (error) {
    console.log("error: " + error.message);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

module.exports = {
  getAllCategories,
  addCategories,
};
