const mongoose=require('mongoose');
exports.connect=async uri=>{
 if(!uri)throw new Error('MONGO_URI is missing');
 await mongoose.connect(uri);
 console.log('MongoDB connected');
};
