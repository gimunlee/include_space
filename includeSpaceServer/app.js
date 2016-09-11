console.log("Hello, app.js")

var bodyParser = require('body-parser');
var Moment = require('moment');

var express = require('express');
var app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json({extended:true}));

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/includespace');

var Message = mongoose.model('messages',{author:String,
                                        time:String,
                                        content:String});
function getAllMsgs(callback) {
  Message.find((err, msgs)=> {
    if(err) return console.error(err);
    var output=[];
    for(var i=0;i<msgs.length;i++) {
      var msg=msgs[i];
      output.push(msg);
    }
    callback(output);
  });
}

app.get('/',(req, res)=>{
  console.log(req.query.temp);
  res.send('Done');
});
app.get('/all', (req,res) => {
  getAllMsgs((msgs) => {
    res.set({'content-type':'text/plain'});
    for(var i=0;i<msgs.length;i++) {
      var line=(i+1) + ' ' + msgs[i].time + ' ' + msgs[i].author + '\t: ' + msgs[i].content;
      res.write(line+'\n');
      console.log(line);
    }
    res.end();
  });
})
app.get('/postMsg', (req, res) => {
  var msg= new Message();
  msg.author=req.query.author;
  msg.time=Moment().format('YYYYMMDD HH:mm:ss');
  msg.content=req.query.content;

  res.send('Message from ' + msg.author +
  ' at ' + msg.time);
  console.log('Message from ' + msg.author +
  ' at ' + msg.time);

  msg.save();
})

app.listen(6966, () => {
  console.log("listening on port 6966");
})