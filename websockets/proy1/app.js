var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(8080);
var i=0;
var coords = [];

//Init coords to place a new gamer
var x_init=350; 
var y_init=350; 

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
}
  
 function randomColor(){
	//http://paulirish.com/2009/random-hex-color-code-snippets/
	return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
}
 
io.sockets.on('connection', function (socket) {
  nickname = new Date().getTime();
  console.log('A new user joined to the party', nickname);
  socket.set('nickname', nickname, function () {
	var coord ={ x:x_init, y:y_init }	
	color = randomColor();
	socket.emit('simple message', "Welcome to my game "+nickname,color,x_init,y_init); 
	socket.broadcast.emit('new gamer', "A new user joined the party", coord, color);	
  });

  socket.set('color', color);
    
  socket.on('change position', function (new_coord) {
	socket.get('color', function (err, color_name) {
		socket.broadcast.emit('position update', new_coord, color_name);
    });
  });
  
});
