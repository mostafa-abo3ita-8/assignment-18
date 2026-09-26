require('dotenv').config();

module.exports = {
  port: Number(process.env.PORT || 3000),
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: process.env.JWT_EXPIRATION || '7d',
  clientUrl: process.env.CLIENT_URL || '*',
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    key: process.env.CLOUDINARY_KEY,
    secret: process.env.CLOUDINARY_SECRET
  }
};
