var express = require("express");
var app = express();
app.configure(function(){ app.use(express.static(__dirname + '/public')); });
app.get("/",     function(req, res){ res.render('./index.jade'); });
app.get("/ctrl", function(req, res){ res.render('./ctrl.jade'); });
app.listen(8888, function(){});

var io = require('socket.io').listen(3000);
io.sockets.on('connection', function(socket){
  socket.on('slide', function(message) {
    console.log(message);
    socket.broadcast.emit('slide', message);
  });
});



