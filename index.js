const express = require("express");
const MongoClient = require('mongodb').MongoClient;
const cors = require("cors");
const bodyParser = require("body-parser");
const port = process.env.PORT || 5052;
const ObjectId = require("mongodb").ObjectID;
const app = express();
require("dotenv").config()

app.use(cors());
app.use(express.json());
// app.use(bodyParser.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.9hyks.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, connectTimeoutMS: 30000 , keepAlive: 1 });
client.connect(err => {
  const postCollection = client.db("keyway").collection("posts");
  
  app.post("/addPost",(req,res) => {
      const newPost = req.body;
      postCollection.insertOne(newPost).then((result) =>{
          console.log("Post is inserted : ", result.insertedCount);
        res.send(result.insertedCount > 0);
      });
  });

  app.get("/posts",(req,res) => {
    postCollection.find({}).toArray((err,posts) => {
        console.log("error",err);
        res.send(posts);
        console.log("Title",posts.title);
        console.log("Description", posts.description);
    });
  });

app.get("/singlePost/:id", (req,res) =>{
  postCollection.find({_id: ObjectId(req.params.id)})
  .toArray((err, docs) => {
    res.send(docs[0]);
  });
} );

app.patch("/updatePost/:id", (req,res) => {
  postCollection.updateOne(
    {_id :objectId (req.params.id)},
    {
      $set : {
        title : req.body.title,
        description : req.body.description,
      },
    }
  )
  .then((result) => {
    res.send(result.modifiedCount > 0);
  });
})

// Delete Post
app.delete("/deletePost/:id", (req,res) => {
  postCollection.deleteOne({_id: ObjectId(req.params.id)})
  .then((result) => {
    res.send(result.deletedCount > 0);
  });
});

//   client.close();
});


app.get('/', (req,res) => {
    res.send("Hello from server side!");
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });