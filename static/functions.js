console.log("ENTRANDO");

$('.pagination').html()
var maxRows = 5;

function totalRows(){
    var count = $('#table td').length;
    return count
}

function pages(){
  var ul = $('.pagination').children().length;
  console.log("PAGINAS", ul)
  return ul
}

function showMessage(contador) {
  var pagActual = 1;
  var maxRows = 5;
  var totalPages = Math.ceil(contador/maxRows);
  var difference = totalPages - pagActual;
  var start = maxRows*difference
  var end = start +4    
  var c = 0;
  console.log(start, start+1, start+2, start+3, end)
  if(start==0){
    $('td:first').show()
  }
  else{
    $('td:first').hide()
  }
  $('td:gt(0)').each(function(){
    c++;
    if(c < start || c > end){
      $(this).hide()
    } else {
      $(this).show() 
    }
  })
}

function agregarPag(contador){
  var maxRows = 5
  if (contador > maxRows){
    var totalPages = Math.ceil(contador/maxRows);
    console.log("total", contador, "paginas", totalPages)
    var ultimaPag = pages()
    console.log(ultimaPag, totalPages, "COMPARAR")
    // agregar una página
    if (totalPages > ultimaPag){
      console.log("AGREGAR PAGINA");
      var siguiente = ultimaPag + 1
      console.log(ultimaPag, "SIGUIENTE", siguiente)
      $('.pagination').append('<li data-page="'+siguiente+'"><a class="page-link" href="#">'+siguiente+'</a></li>').show()
      showMessage(totalRows());
    }    
  }
}

//$('.pagination li').click(function(){
$("ul.pagination").on('click', 'li', function(){
  console.log("CLICK")
  var pageNum = $(this).attr('data-page');
  console.log("Estas en la pagina", pageNum)
  var maxRows = 5;
  var rows =  totalRows()
  var totalPages = Math.ceil(rows/maxRows);
  var difference = totalPages - pageNum;
  var start = difference*maxRows;
  var end = start + 4
  console.log(start, start+1, start+2, start+3, end)
  $('.pagination li').removeClass('active')
  $(this).addClass('page-item active')

  if(start==0){
    $('td:first').show()
  }
  else{
    $('td:first').hide()
  }
  var c = 0;
  /* $('#users-list td:gt(0)').each(function(){
    $(this).show()
  }) */

  $('td:gt(0)').each(function(){
    c++;
    if(c < start || c > end){
      $(this).hide()
    } else {
      $(this).show() 
    }
  })
});

var USERS = [];
const socket = io();
socket.emit('connection',{
    data: 'User Connected'
    })

/* socket.on('response', function(msg){
  console.log(msg)
     var joke = $('<div> "'+msg+'"</div>');
    $('#joke').append(joke) 
}) */

socket.on('joke', function(msg){
  console.log(msg)
  var joke = $('<div> "'+msg+'"</div>');
  $('#joke').append(joke)
})

var form = $( '.submit-button' ).on('click',function(e) {
    e.preventDefault();
    var username = $( 'input.username' ).val()
    $('.login-page').hide();
    $('#joke').show()
    $('#message-title').show()
    $('.board').show();
    $('.users').show();
    $('.controls').show(); 
    $('.pages').show();         
    socket.emit('user',username)
})

socket.on('disconnect-username', function(username){
  console.log("DISCONNECT");
  $('.'+username).hide()
})

socket.on('response-username', function(data){
    var name = $('<div>Bienvenido '+data[0]+'</div>');
    var row_m = $('<td class="table-row"><span class="">' + data[0] + ' se unió a la conversación</span></td>');    
    var keys = Object.keys(data[1]);
    /* var row = $('<td class="table-row"><span class="">' + data[0] + '</span></td>');
    $('#users-list').append(row).show() */
    console.log("PUSH USERS")
    USERS.push(data[0])
    /* var count = $('#users-list td').length;
    console.log("LENGTH USERS", count)
   
    console.log("DELETING")
    $("#users-list td").remove(); 
    var count = $('#users-list td').length;
    console.log("LENGTH USERS", count) */
    
    USERS.forEach(function(u){
      console.log(u);
    })
    /* keys.forEach(function(key){
        USERS.push(key) 
        var row = $('<td class="table-row"><span class="'+data[1][key]+'">' + data[1][key] + '</span></td>');
        $('#users-list').append(row).show()
    }); */
    
    $('#table').append(row_m)
    var r = totalRows()
    console.log("rows", r)  
})

$('.send-button').on('click', function(){
    totalRows();
    var text = $('.message').val()
    if (text){
      socket.emit('send-message',text);
      $('.message').val(' ');
    }
})

$('.joke-button').on('click', function(){
  console.log("CUENTAME UN CHISTE")
  socket.emit('tell-joke')
  /* var text = $('.message').val()
  if (text){
    socket.emit('send-message',text);
    $('.message').val(' ');
  } */
})

$('.message').keydown(function(e) {
    if (e.keyCode === 13) {
      $('.send-button').click();
    }
  })  

socket.on('receive-message', function(data){
    var now = new Date();
    console.log(now)
    var format = now.getDate() + '-' + now.getMonth() + '-' + now.getFullYear() + ' ' + now.getHours() + ':' + now.getMinutes()
    /* var time = Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate() , 
    now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
    console.log(date)
     */
    console.log(format)
    var row = $('<td class="table-row"><span class="sender">'+data['sender']+' <span class="time">'+format+'</span>: </span><span>'+data['msg']+'</span></td>');
    $('#table').append(row)
    var r = totalRows()
    console.log("rows", r)
    agregarPag(r);
    
})
