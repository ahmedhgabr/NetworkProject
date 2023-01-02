var express = require('express');
var path = require('path');

var app = express();
var session = require('express-session');
const { Session } = require('inspector');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


// Use the session middleware
app.use(session({
  secret: "cookie_secret",
  resave: true,
  saveUninitialized: true,

}));




//handle get request

app.get('/',function(req,res){
  res.render('login',{ state:""})
});
app.get('/annapurna',function(req,res){
  if (req.session.username == null ){
    res.redirect('/');
  }
  else{
    res.render('annapurna',{state:"",state1:""})
  }
});
app.get('/bali',function(req,res){
  if (req.session.username == null ){
    res.redirect('/');
  }
  else{
  res.render('bali' , {state:"",state1:""})
  }
});
app.get('/cities',function(req,res){
  if (req.session.username == null ){
    res.redirect('/');
  }
  else{
  res.render('cities')}
});
app.get('/hiking',function(req,res){
  if (req.session.username == null ){
    res.redirect('/');
  }
  else{
  res.render('hiking')}
});
app.get('/home',function(req,res){
  if (req.session.username == null ){
    res.redirect('/');
  }
  else{
  res.render('home',{ state:  ""})}
});
app.get('/inca',function(req,res){
  if (req.session.username == null ){
    res.redirect('/');
  }
  else{
  res.render('inca',{state:"",state1:""});}
});
app.get('/islands',function(req,res){
  if (req.session.username == null ){
    res.redirect('/');
  }
  else{
  res.render('islands');}
});

app.get('/paris',function(req,res){
  if (req.session.username == null ){
    res.redirect('/');
  }
  else{
  res.render('paris',{state:"",state1:""});}
});

app.get('/registration',function(req,res){
  res.render('registration',{ state:""})
});

app.get('/rome',function(req,res){
  if (req.session.username == null ){
    res.redirect('/');
  }
  else{
  res.render('rome',{state:"",state1:""});}
});

app.get('/santorini',function(req,res){
  if (req.session.username == null ){
    res.redirect('/');
  }
  else{
  res.render('santorini',{state:"",state1:""});}
});

app.get('/searchresults',function(req,res){
  if (req.session.username == null ){
    res.redirect('/');
  }
  else{
  res.render('searchresults',{destination:[], searchError:""})}
});

app.get('/wanttogo',function(req,res){
  if (req.session.username == null ){
    res.redirect('/');
  }
  else{
    try {
      var user = req.session.username
      MongoClient.connect('mongodb://127.0.0.1:27017' , function(err,client){
        //if (err) throw err;
        var db = client.db('myDB');

        db.collection('myCollection').findOne({username: user} , function(err,data){
          res.render('wanttogo',{wanttogo:data.List});
            // res.redirect('/'+loc)
        });
      });
    }
    catch(err) {

     }
}
});



//mongodb
//npm install mongodb
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://127.0.0.1:27017' , function(err,client){
  if (err) throw err;
  var db = client.db('myDB');
  //db.collection('myCollection').insertOne({id:1 , firstName :'Ahmed',lastName:'Hussein'});
});


//regestration
app.post('/register' , function(req, res){
  var user = req.body.username ;
  var pass = req.body.password ;

  try {
    if (user == '' || pass == '' )throw err
    MongoClient.connect('mongodb://127.0.0.1:27017' , function(err,client){
      var db = client.db('myDB');
      db.collection('myCollection').count({username: user} , function(err,count){

        try {
          //if user is already in database
          if (count > 0 )throw err

          //successful register
          db.collection('myCollection').insertOne({ username :user,password:pass,List:[]});

          res.redirect('/');
        }
        catch(err) {
          res.render('registration',{title:"express" , state:"username is already taken"})
        }
      });
    });
  }
  catch(err) {
    res.render('registration',{title:"express" , state:"fields can not empty"})
   }
});

//login
app.post('/' , function(req, res){
  var user = req.body.username ;
  var pass = req.body.password ;
  req.session.username = user ;

  try {
    if (user == '' || pass == '' )throw err
    MongoClient.connect('mongodb://127.0.0.1:27017' , function(err,client){
      //if (err) throw err;
      var db = client.db('myDB');

      db.collection('myCollection').count({username: user , password:pass} , function(err,count){

        try {
          if (count == 0 )throw err;
          res.redirect("/home");
        }
        catch(err) {
          res.render('login',{title:"express" , state:"username or pass is not correct"})
        }
      });
    });
  }
  catch(err) {
    res.render('login',{title:"express" , state:"fields can not empty"})
   }
});


app.post('/search',function(req ,res){
  var search = req.body.Search
  var dest = ["bali","annapurna","inca","paris","rome","santorini"]
  var destfound = dest.filter(s => s.includes(search));
  console.log(destfound)
  if (destfound.length == 0) {
    res.render('searchresults',{destination:[], searchError:"Not Found"})
  }
  else {
  res.render('searchresults',{destination:destfound, searchError:""})
  }
});

app.post('/:location', function(req,res){
  var user = req.session.username
  var loc = req.params.location

  try {

    MongoClient.connect('mongodb://127.0.0.1:27017' , function(err,client){
      //if (err) throw err;
      var db = client.db('myDB');

      db.collection('myCollection').findOne({username: user} , function(err,data){
        if (data.List.includes(loc))  {
          res.render(loc,{state:"Already Added",state1:""})
          // res.redirect('/'+loc)

      }
        else{
          data.List.push(loc)

        db.collection('myCollection').updateOne( { username: user },
        {
          $set: {
                  List: data.List
        }
        })
        res.render(loc,{state:"",state1:"Added Successfully"})
      }
      });
    });
  }
  catch(err) {

   }
});



const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
