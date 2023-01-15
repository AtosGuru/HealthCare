const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Level = new Schema({
    level:{
        type:String
    },
    rate:{
        type:Number
    }
});

module.exports = mongoose.model('Level', Level);