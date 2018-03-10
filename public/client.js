$(document).ready(function(){
    
  var socket = io();
  socket.emit('start');
  socket.on('loviData', function(data){
    
    // create chart
    Highcharts.stockChart('graph', {
      chart:{
        zoomType: 'xy',
      },
      rangeSelector: {
        selected: 6
      },
      yAxis: {
        // min: 0,
        plotLines: [{
          value: 0,
          width: 2,
          color: 'silver'
        }]
      },
      xAxis:{
        tickColor: 'green',
        tickLength: 5,
        tickWidth: 3,
        tickInterval: 604800000,
        type: 'datetime',
        // range: 1000*3600*5,
      },
      tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br>',
        valueDecimals: 2,
        split: true
      },
      plotOptions:{
         series: {
             dataGrouping: {
                  enabled: false
             }
         }
      },
      series: data,
    });
    
    // add buttons
    data.forEach(item=>{
      var button ='';
      
        button += "<div class='col-sm-4 change'>"
        button +=   "<button class='btn btn-sm btn-block btn-outline-info' name='"+item.name+"'>"+item.name+"</button>"
        button += "</div>"
      
      $('#buttons').append(button);
    });
  });
  
  // EVENT HANDLERS
  
  $('#new_stock').keypress(function(e){
    if(e.which==13){
      var new_stock = $('#new_stock').val().toUpperCase();
      if(new_stock.length>1){

        var stocks = document.getElementsByClassName('btn-outline-info');
        var ya_stocks=[];

        // check if there is such a stock
        for(var i = 0; i<stocks.length; i++){
          ya_stocks.push(stocks[i].name); 
        }

        if(!ya_stocks.includes(new_stock)){
          // alert('not include');
          socket.emit('get_new_stock',{stock:new_stock});
          $('#new_stock').val('');
          $('#buttons').html('');
        }
        else{
          // alert('include');
        }
      }else{alert('Please, check stock name!');}
    }
  });
  
  $('#add_stock').click(function(e){
    var new_stock = $('#new_stock').val().toUpperCase();
    if(new_stock.length>1){
      
      var stocks = document.getElementsByClassName('btn-outline-info');
      var ya_stocks=[];
      
      // check if there is such a stock
      for(var i = 0; i<stocks.length; i++){
        ya_stocks.push(stocks[i].name); 
      }
      
      if(!ya_stocks.includes(new_stock)){
        // alert('not include');
        socket.emit('get_new_stock',{stock:new_stock});
        $('#new_stock').val('');
        $('#buttons').html('');
      }
      else{
        // alert('include');
      }
    }else{alert('Please, check stock name!');}
    
  });
  
  $('#buttons').on('click', '.btn-outline-info', function(e){
    var name = $(this).attr('name'); 
    $('#buttons').html('');
    socket.emit('remove_stock', {stock: name});
  });
  $('#buttons').on('mouseover', '.btn-outline-info', function(e){
    $(this).html('<b>&times</b>')
  });
  $('#buttons').on('mouseout', '.btn-outline-info', function(e){
    var name = $(this).attr('name');  
    $(this).html(name);
  });
});
