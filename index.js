const mongoose = require("mongoose");
const express = require("express");

const app = express();

// const connect = () => {
//     return mongoose.connect("mongodb://ramkrishna:ram1234@ecommerce-shard-00-00.ybzfv.mongodb.net:27017,ecommerce-shard-00-01.ybzfv.mongodb.net:27017,ecommerce-shard-00-02.ybzfv.mongodb.net:27017/?ssl=true&replicaSet=atlas-s2d4cr-shard-0&authSource=admin&retryWrites=true&w=majority")
// }
app.use(express.json());

const connect = () => {
    return mongoose.connect("mongodb://localhost:27017/happycredit")
}

//user Schema
//step1:- create the schema

const userSchema= new mongoose.Schema({
    id:{type:Number,required:true,unique:true},
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
}
)

// Step 2 : creating the model
const User = mongoose.model("user", userSchema); // user => users

// POST SCHEMA
// Step 1 :- creating the schema
const postSchema = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
    title: { type: String, required: true },
    body: { type: String, required: true },
    
  }
);

// Step 2 :- creating the model
const Post = mongoose.model("post", postSchema); // post => posts

// COMMENT Schema
// Step 1 :- creating the schema
const commentSchema = new mongoose.Schema(
  {
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
        required: true,
      },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
    body: { type: String, required: true },
    
  }
);

// Step 2 :- creating the model
const Comment = mongoose.model("comment", commentSchema); // comment => comments


//user get & post --->
app.get("/users", async (req, res) => {
  try {
    const users = await User.find().lean().exec();

    return res.status(200).send({ users: users }); // []
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Something went wrong .. try again later" });
  }
});

app.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);

    return res.status(201).send(user);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

// post operations

app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().populate({path:"userId",select:["_id"]}).lean().exec();

    return res.status(200).send(posts);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

app.post("/posts", async (req, res) => {
  try {
    const post = await Post.create(req.body);

    return res.status(200).send(post);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

app.get("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).lean().exec();

    return res.status(200).send(post);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

//comment operations

app.get("/comments", async (req, res) => {
    try {
      const comments = await Comment.find().populate({path:"userId",select:{name:1,email:1,_id:0}}).lean().exec();
  
      return res.status(200).send(comments);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  });
  

app.post("/comments", async(req,res) => {
  try{
    const comment = await Comment.create(req.body);

    return res.status(200).send(comment);
  }
  catch (err) {
    return res.status(500).send({ message: err.message });
  }
})


app.listen(5000,async()=> {
    try {
        await connect();
    } catch (error) {
        console.log(error)
    }

    console.log("listening on port 5000");
})