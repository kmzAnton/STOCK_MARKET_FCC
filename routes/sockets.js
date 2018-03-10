var db = require('../db.js'),
    request = require('request-promise');


module.exports = function(io, socket){
  socket.on('start', function(){
    //////////////////////////
    setDataforSeries(io);
    /////////////////////////
  });
  
  socket.on('get_new_stock', function(data){
        console.log(data);
        request({
          uri: "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol="+data.stock+"&apikey="+process.env.API_KEY_ALPHA,
          json:true
        }).then(function(resp){
          console.log(resp);
          if(resp["Error Message"]){console.log('No such a stock');}
          
          else{
            db.connect(function(err){
              if(err){throw err}
              else{              
                var dbase = db.getDb().collection('stocks');
                dbase.save({name: data.stock})
              }
            });
            ////////////////////////
            setDataforSeries(io);
            /////////////////////
          }        
        }).catch(err=>{console.log(err)});
        
  });
  
  socket.on('remove_stock', function(data){
    var stock = data.stock;
    db.connect(function(err){
      if(err){throw err}
      else{
        var dbase = db.getDb().collection('stocks');
        dbase.remove({name: data.stock}, function(err){
          if(!err){console.log('Stock is successfuly removed')}
          else{console.log('Somehow, stock was not removed');}
        });
        ////////////////////////
        setDataforSeries(io);
        /////////////////////
      }
    });
  });
}


function setDataforSeries(io){
  db.connect(err=>{
      if(err){console.log(err)}
      var dbase = db.getDb().collection('stocks');
      dbase.find().toArray()
        .then(function(instance){
          if(instance.length==0){console.log('Dbase is empty')}
          else{
            var dataSet=[];
            var add = {};
            instance.forEach(item=>{                         
              var stockName = item.name.toString();

              request({
                uri: "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol="+stockName+"&apikey="+process.env.API_KEY_ALPHA,
                json:true
              }).then(resp=>{   
                // console.log(resp);
                add={};
                add.name = resp["Meta Data"]["2. Symbol"];
                add.data = [];

                for (var prop in resp["Time Series (Daily)"]){

                  var big = prop.toString().split(' ')[0].split('-');
                  var date = new Date(big[0],big[1]-1,big[2]).getTime();
                  var x = prop.toString();

                  add.data.push([Number(date), Number(resp["Time Series (Daily)"][x]["1. open"])]);

                  if(Object.keys(resp["Time Series (Daily)"]).length == add.data.length){
                    
                    console.log(add.data.length+'---'+add.name);
                    dataSet.push(add);
                    
                    if(instance.length === dataSet.length){
                      io.emit('loviData', dataSet);
                    }
                    
                  }

                }
              });
            })
            
          }
        })
        .catch(err=>{console.log(err)});
  });
}