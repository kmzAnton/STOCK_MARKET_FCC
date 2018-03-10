module.exports = function(){
  var functions={};
  function Info(){
    this.title = '';
    this.error_msg = '';
  }
    
  
  functions.stock = function(req,res){
    var info = new Info();
    info.title = 'Stocks';
    res.render('page/stock.ejs', {info});
  }
  
  return functions;
}