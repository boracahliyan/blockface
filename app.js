const express = require("express");
const mongodb = require("mongodb");
const cors = require("cors");


let dbconnection


function connectToDb(cb){
    mongodb.MongoClient.connect("mongodb+srv://bc23:2358@social-media-db.sfrqbeh.mongodb.net/blockface")
    .then((client) => {
        dbconnection = client.db();
        return cb();
    })
    .catch(err => {
        console.log(err);
        return cb(err);
    })
};
function getDb(){return dbconnection}

const app = express();
app.use(cors());
app.use(express.json());
let db;


//db connection

connectToDb((err) => {
    if(err == null){

        app.listen(3000, () => {
            console.log("App listenin at port 3000");
    
        });

        db = getDb();
       
    }else{
        console.log("It is not connect")
    }
})


//init app & middleware





//routes 
app.get("/users",(req,res) => {

    let users = [];

    dbconnection.collection("users")
    .find().forEach( user => users.push(user))
    .then(() => {
        res.status(200).json(users)
    })

})

app.get("/posts",(req,res) => {

    let posts = [];

    dbconnection.collection("posts")
    .find().forEach( post => posts.push(post))
    .then(() => {
        res.status(200).json(posts)
    })

})


app.post("/users",(req,res) => {
    const new_user = req.body;


    if(!new_user.name || !new_user.password){
        return res.status(400).json({Error: "Name and password is required"});
    }

    dbconnection.collection("users").insertOne(new_user).then(result => {
        res.status(201).json({
            message: "User created",
            userId: result.insertedId
        });
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ Error: "Could not create user in database" });


    })



})

