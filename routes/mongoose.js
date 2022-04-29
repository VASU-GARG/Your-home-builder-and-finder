var mongoose = require('mongoose');

mongoose.connect("mongodb+srv://Vasu:Vasu@cluster0.6vuhk.mongodb.net/YHBF?retryWrites=true&w=majority");

collectionSchema = mongoose.Schema({
        name:String,
        email:String,
        password:String
});

collectionModel = mongoose.model('userinfos',collectionSchema);

module.exports = collectionModel;