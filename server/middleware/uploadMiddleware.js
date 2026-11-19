const multer = require("multer");
const path = require("path");

// Store uploaded files in uploads/resumes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/resumes");
  },

  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
    );
  },
});

// Allow only PDF and DOCX
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and DOCX files are allowed."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;