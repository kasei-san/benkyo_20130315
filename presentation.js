var express = require("express");
var app = express();
app.configure(function(){ app.use(express.static(__dirname + '/public')); });
app.get("/",     function(req, res){ res.render('./index.jade'); });
app.get("/ctrl", function(req, res){ res.render('./ctrl.jade'); });
app.listen(80, function(){});

var io = require('socket.io').listen(3000);
io.sockets.on('connection', function(socket){
  socket.on('slide', function(message) {
    console.log(message);
    socket.broadcast.emit('slide', message);
  });
});

var Field = function(){
  this.X_MAX=640;
  this.Y_MAX=480;
  this.BALL_SIZE=20;
  this.position = {
    x : this.X_MAX/2 - this.BALL_SIZE/2,
    y : this.Y_MAX/2 - this.BALL_SIZE/2
  }
  this.vector = {x : 5, y : 5}
}
Field.prototype = {
  next : function(){
    this.position.x += this.vector.x;
    this.position.y += this.vector.y;
    if(this.position.x >= (this.X_MAX-(this.BALL_SIZE*2))){ this.position.x = this.X_MAX-(this.BALL_SIZE*2); this.vector.x = this.vector.x * -1; }
    if(this.position.y >= (this.Y_MAX-(this.BALL_SIZE*2))){ this.position.y = this.Y_MAX-(this.BALL_SIZE*2); this.vector.y = this.vector.y * -1; }
    if(this.position.x <= 0){ this.position.x = 0; this.vector.x = this.vector.x * -1; }
    if(this.position.y <= 0){ this.position.y = 0; this.vector.y = this.vector.y * -1; }
    return {
      ball : this.position
    };
  }
}
var field = new Field
var pong_io = require('socket.io').listen(3001);
pong_io.sockets.on('connection', function (socket) {
  setInterval(function(){
    socket.broadcast.emit("data", field.next());
  }, 100);
});
