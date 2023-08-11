const bcrypt = require("bcrypt");

// Generate a random 4-digit number
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}


const securePassword = async (password) => {
  try {
    const passwordHash = bcrypt.hash(password, 10);
    console.log(passwordHash);
    return passwordHash;
  } catch (error) {
    res.status(400).send(error.message);
  }
};



module.exports = {
  generateOTP,
  securePassword
};
