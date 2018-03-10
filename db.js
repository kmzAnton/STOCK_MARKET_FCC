var mongodb = require('mongodb').MongoClient;

var dbase;

module.exports = {
  connect:function(cb){
    mongodb.connect(process.env.MONGO_URI, function(err, db){
      dbase = db.db('fccurlshort');
      return cb(err);
    });},
  getDb: function(){
    return dbase;
  }
};