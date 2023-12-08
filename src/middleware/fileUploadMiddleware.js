const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const fileExtension = path.extname(file.originalname).toLowerCase();
  console.log('Uploading file with mimetype:', file.mimetype, 'and extension:', fileExtension);

  if (file.mimetype.includes('csv') || fileExtension === '.csv') {
    cb(null, true);
  } else {
    const error = new Error('Only .csv files are allowed!');
    console.error('File upload error:', error.message); // Added error logging
    cb(error, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
