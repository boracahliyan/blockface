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
const PORT = process.env.PORT || 3000;

connectToDb((err) => {
    if(err == null){
        app.listen(PORT, () => {
            console.log(`App listening at port ${PORT}`);
        });
        db = getDb();
    } else {
        console.log("It is not connected")
    }
});


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



app.post("/posts",(req,res) => {
    const new_post = req.body;


    if(!new_post.title || !new_post.content){
        return res.status(400).json({Error: "Title and content is required"});
    }

    dbconnection.collection("posts").insertOne(new_post).then(result => {
        res.status(201).json({
            message: "Post added",
            postId: result.insertedId
        });
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ Error: "Could not create posts in database" });


    })



})




app.patch("/posts/:id", (req, res) => {
    const id = req.params.id; 
    const updates = req.body;

    if (!mongodb.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
    }

    dbconnection.collection("posts")
    .updateOne(
        { _id: new mongodb.ObjectId(id) }, 
        { $set: updates }
    )
    .then(result => {
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.status(200).json({ message: "Post updated successfully!" });
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: "Database update failed" });
    });
});

app.delete("/posts/:id",(req,res) => {
    const id = req.params.id;

    if(!mongodb.ObjectId.isValid(id)){
        return res.status(400).json({error: "Invalid ID format"});
    }

    dbconnection.collection("posts")
    .deleteOne({_id: new mongodb.ObjectId(id)})
    .then(result => {
        if(result.deletedCount === 0){
            return res.status(404).json({ message: "Post not found"});
        }
        res.status(200).json({message: "Post is deleted"});
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: "Database deletion failed" });
    })
});