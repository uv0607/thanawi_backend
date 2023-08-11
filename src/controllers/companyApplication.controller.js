const companyApplication = require("../models/companyApplication");
const dotenv = require("dotenv");
dotenv.config();

const axios = require("axios");

const wathqUrl = "https://api.wathq.sa/v4/commercialregistration/info/";

// async function createCompanyApplication(req, res) {
//     try {
//         let newComApplication = new companyApplication({
//             crNumber: req.body.crNumber,
//             crName: req.body.crName,
//             companyName: req.body.companyName,
//             reason: req.body.reason,
//             uppliedByUser: req.user_id,
//             document: req.body.document,
//         })

//         let data = new companyApplication(newComApplication);
//         await data.save();

//         res.status(200).json({
//           status: "success",
//           message: "Created successfully",
//           data: data,
//         });
//       } catch (error) {
//         console.log(error);
//         res.status(500).json({
//           status: "error",
//           message: error.message || error,
//         });
//       }
//   }

async function createCompanyApplication(req, res) {
  try {
    let newComApplication = new companyApplication({
      crNumber: req.body.crNumber,
      crName: req.body.crName,
      companyName: req.body.companyName,
      reason: req.body.reason,
      appliedByUser: req.user_id,
      document: req.body.document,
    });

    let data = new companyApplication(newComApplication);
    await data.save();

    res.status(200).json({
      status: "success",
      message: "Created successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message || error,
    });
  }
}

async function getCompanyDetails(req, res) {
  try {
    const crNumber = req.params.id;
    console.log(crNumber, "<<<<<<<<");
    const response = await axios.get(`${wathqUrl}${crNumber}`, {
      headers: {
        apiKey: process.env.WATHQ_KEY,
        accept: "application/json",
      },
    });

    // Save the response in DB
    let newComApplication = new companyApplication({
      crNumber: response.data.crNumber,
      crName: response.data.crName,
      companyName: response.data.companyName,
    });

    let findCompany = await companyApplication
    
      .findOne({
        crNumber: response.data.crNumber,
      })
      .lean()
      .exec();

    if (findCompany) {
      return res.status(400).json({
        status: "error",
        message: "Company Already Exists.",
      });
    }

    let company = new companyApplication(newComApplication);
    await company.save();

    res.status(200).json({ status: "success", data: response.data });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: "Failed to retrieve check outcome." });
  }
}

module.exports = {
  createCompanyApplication,
  getCompanyDetails,
};
