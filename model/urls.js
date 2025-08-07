const {Schema,model}=require('mongoose');
const env= require('dotenv')
env.config();

const urls = new Schema({
    url: { type: String, required: true }, 
    shortcode: { type: String, required: true, unique: true }, // short code
    validity: { type: Number, required: true }, 
    expiry: { type: Date }, 
});

module.exports = model('urls', urls);