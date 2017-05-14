var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var jwt = require('jwt-simple');
var app = express();

var JWT_SECRET = 'whattodo';

var db = null;
MongoClient.connect("mongodb://localhost:27017/", function(err,dbconn){
//MongoClient.connect(process.env.MONGOLAB_URI || "mongodb://localhost:27017/mittens", function(err,dbconn){    
    if(!err){
        console.log("we are connected !");
        db = dbconn;
    }
    else{
        console.log("error connecting db");
    }
});

app.use(bodyParser.json());


app.use(express.static('public'));

app.get('/todos',function(req,res,next){
    
    var token = req.headers.authorization;
    var user = jwt.decode(token,JWT_SECRET);

    db.collection('wtdtodos',function(err,todosCollection){
        // var usertodo = req.body.
        todosCollection.find({user : user._id}).toArray(function(err,todos){
            return res.json(todos);
        });
    });
});

app.post('/todos',function(req,res,next){
    
    var token = req.headers.authorization;
    var user = jwt.decode(token,JWT_SECRET);
    

    db.collection('wtdtodos',function(err,todosCollection){
         var newTodo = {
             todotitle: req.body.todotitle,
             tododesc: req.body.tododesc,
             tododone: req.body.tododone,
             //check: false
             user: user._id,
             username: user.username,
             email: user.email
        };

        todosCollection.insert(newTodo,{w:1},function(err){
            return res.send();
        });
        
        
    });

    // res.send();

});

app.put('/todos/:id', function(req,res,next){

     var token = req.headers.authorization;
     var user = jwt.decode(token,JWT_SECRET);


     db.collection('wtdtodos',function(err,todosCollection){
         var updateTodo = {
            todotitle:req.body.todotitle,
            tododesc:req.body.tododesc,
            tododone:req.body.tododone,
            user: user._id,
            username: user.username,
            email: user.email
        };
        console.log(updateTodo);
        todosCollection.findOneAndUpdate({_id:ObjectID(req.params.id),user: user._id}, updateTodo, function(err,todo){
            if(err){
                res.send(err);
            }

            return res.json(todo);
            
         });
     });
});

app.put('/todos/remove',function(req,res,next){

    var token = req.headers.authorization;
    var user = jwt.decode(token,JWT_SECRET);

    db.collection('wtdtodos',function(err,todosCollection){
        var todoId = req.body.todo._id;

        todosCollection.remove({_id:ObjectID(todoId), user: user._id},{w:1},function(err){
            return res.send();
        });
    });
});

// app.put('/todos/edit',function(req,res,next){

//     var token = req.headers.authorization;
//     var user = jwt.decode(token,JWT_SECRET);

//     db.collection('wtdtodos',function(err,todosCollection){
//         var todoId = req.body.todo._id;

//         todosCollection.remove({_id:ObjectID(todoId), user: user._id},{w:1},function(err){
//             return res.send();
//         });
//     });
// });


app.post('/users',function(req,res,next){

    // console.log(req.body);
    // res.send();    

    db.collection('users',function(err,usersCollection){


        bcrypt.genSalt(10,function(err,salt){
            bcrypt.hash(req.body.password, salt, function(err,hash){
                var newUser = {
                    username: req.body.username,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    password: hash
                }

                usersCollection.insert(newUser,{w:1},function(err){
                    return res.send();
                });
            });
             
        });
       
    });

    // res.send();

});

app.put('/users/signin',function(req,res,next){

    db.collection('users',function(err,usersCollection){
        usersCollection.findOne({email: req.body.email}, function(err,user){
            bcrypt.compare(req.body.password, user.password, function(err,result){
                if(result){
                    var token = jwt.encode(user,JWT_SECRET);
                    var username = user.username;
                    return res.json({token:token,username:username});
                }
                else{
                    return res.status(400).send();
                }
            });
        });
    });
});

app.listen(3000,function(){
    console.log('WhatToDo App listening on port 3000 !');
});