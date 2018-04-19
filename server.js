var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var fs = require('fs');
var PORT = 8002;
var bodyParser = require('body-parser');
var slots=[];
var available=[];
var users=[];
var time=new Date();

const csvFilePath='public/csv/slots.csv';
const csv=require('csvtojson');
csv()
.fromFile(csvFilePath)
.on('json',(jsonObj)=>{
    console.log(JSON.stringify(jsonObj));
    available.push(jsonObj.time);
    console.log(available);
})
.on('done',(error)=>{
	// console.log(question);
    // console.log('end');
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use('/', express.static(__dirname + '/public'));

server.listen(process.env.PORT || PORT);
console.log('Listening at : http://localhost:'+PORT);

app.get('/',function (req,res) {
	res.sendFile(__dirname + '/index.html');
});

app.post('/slots',function(req,res){
	// console.log('requested slots by user');
	res.json({slots:available,number:available.length});
});

app.post('/entries',function(req,res){
	// console.log(question.length);
	// console.log("USERNAME: "+req.body.username + " PASSWORD: "+req.body.password);
	if(req.body.user_text=="admin" && req.body.password=="smpiitd2018"){
		res.json({authentication:true,slots:slots});
	}
	else{
		res.json({authentication:false});
	}
});

app.post('/user_book',function(req,res){
	// console.log(JSON.stringify(req.body));
	var id_text = req.body.entry_no;
	if(users.indexOf(id_text)==-1){
		users.push(id_text);
		var index = available.indexOf(req.body.time); 
		if(index!=-1){
			available.splice(index,1);
			slots.push({time:req.body.time,first_name:req.body.first_name,
						last_name:req.body.last_name,
						entry_no:id_text,email:req.body.email,
						mob:req.body.mob});
			res.json({available:true});
		}
		else{
			res.json({available:false});
		}
	}else{
		res.json({available:false});
	}
});

io.on('connection',function(socket){
	// console.log("New Client");
	// // console.log(sockets);
	// socket.on('updateQuestion',function(data){
	// 	console.log("Update Question : Question "+data);
	// 	io.sockets.emit('updateQuestion',data);
	// });
	// socket.on('updateResult',function(){
	// 	console.log("Update Result");
	// 	io.sockets.emit('updateResult');
	// });
	// socket.on('disconnect',function(){
	// 	// var i = sockets.indexOf(sockte.id);
	// 	// sockets.splice(i,1);
	// 	var toRemove = users.find(function(e){
	// 		return e[1]==socket.id;
	// 	});
	// 	// var j = sockets.indexOf(toRemove);
	// 	users.splice(j,1);
	// 	// console.log(sockets);
	// 	console.log(users);
	// });
});
