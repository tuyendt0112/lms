const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: 'dvq7moqwv',
    api_key: '753369553363584',
    api_secret: '7Qpiorl7FuVtISoK4QkmWwmpbEc'
});

const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['jpg', 'png'],
    params: {
        forder: 'bookingpitch'
    }
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;