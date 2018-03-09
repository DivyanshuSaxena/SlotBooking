var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var fs = require('fs');
var PORT = 8002;
var bodyParser = require('body-parser');
var slots=[];
var available=[];
var time=new Date();

const csvFilePath='public/csv/a.csv';
const csv=require('csvtojson');
csv()
.fromFile(csvFilePath)
.on('json',(jsonObj)=>{
    // console.log(JSON.stringify(jsonObj));
    available.push(jsonObj);
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

server.listen(PORT);
console.log('Listening at : http://localhost:'+PORT);

app.get('/',function (req,res) {
	res.sendFile(__dirname + '/index.html');
});

app.get('/slots',function(req,res){
	// console.log('requested question');
	res.json({slots:available});
});

app.post('/entries',function(req,res){
	// console.log(question.length);
	// console.log("USERNAME: "+req.body.username + " PASSWORD: "+req.body.password);
	if(req.body.user_text=="admin" && req.body.password=="admin"){
		res.json({authentication:true,slots:slots});
	}
	else{
		res.json({authentication:false});
	}
});

app.post('/user_book',function(req,res){
	// console.log(JSON.stringify(req.body));
	if(req.body.pass_text=="admin"){
		// console.log(req.body.user_text);
		// console.log(users);
		// console.log(users.indexOf(req.body.user_text));
		var user_text = req.body.user_text;
		// if(users.indexOf(user_text)==-1){
		if(!users.find(function(e){
			return e[0]==user_text;
		})){
			users.push([user_text,req.body.id]);
			scores[user_text]={};
			sockets.push(req.body.id);
			// console.log(JSON.stringify(scores));
			res.json({user_auth:true,username:req.body.user_text});
		}else{
			res.json({user_auth:false,username:req.body.user_text});
		}
	} else {
		res.json({user_auth:false,username:req.body.user_text});
	}
});

// app.post('/answer',function(req,res){
// 	if((new Date)<time){
// 		username=req.body.username;
// 		choice=req.body.choice;
// 		socketid=req.body.id;
// 		if(sockets.indexOf(socketid)!=-1){
// 			correct=question[queno].correct;
// 			// console.log(queno);
// 			// if(scores[username].has(queno)){
// 			// 	console.log("Repeat");
// 			// } else {
// 			if(choice==correct){
// 				// console.log("Correct");
// 				// console.log(scores);
// 				scores[username][queno]=1;
// 				console.log(JSON.stringify(scores));
// 				// console.log(scores[username]);
// 			}else{
// 				// console.log("Incorrect");
// 				scores[username][queno]=0;
// 				console.log(JSON.stringify(scores));
// 			}
// 		}else{
// 			console.log("Invalid request");
// 		}
// 	}
// });

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