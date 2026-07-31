 const express = require("express");

const router = express.Router();

router.post("/register", (req, res) => {
  console.log("Register API Called");
  console.log(req.body);

  res.status(200).json({
    success: true,
    message: "Register API Working",
    data: req.body,
  });
});

module.exports = router;