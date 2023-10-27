//jshint esversion:6

import express from "express";
import bodyParser from "body-parser";
import ejs from 'ejs';
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const homeStartingContent = "Welcome to Daily Journal Blog, your daily companion on the journey of self-discovery and personal growth. Here, we believe that every day is an opportunity to explore, learn, and grow, and your journal is your most trusted ally on this incredible adventure. Whether you're a seasoned journaler or just starting, we're here to inspire, guide, and support you in making journaling an integral part of your life. Our mission is simple: to help you uncover the layers of your thoughts, emotions, and experiences, paving the way for personal growth, self-awareness, and creativity. Join our vibrant community of journaling enthusiasts, explore our journaling prompts, tips, personal stories, expert advice, and start your journey of self-discovery today with Daily Journal Blog";
const aboutContent = "Welcome to the heart and soul of Daily Journal Blog. Our journey began with a simple idea: to create a space where individuals could embrace the transformative potential of journaling in their lives. At Daily Journal Blog, our mission is to empower people with the tools and inspiration they need to make journaling an integral part of their daily routines. We firmly believe that journaling is a gateway to self-discovery, personal growth, and creativity. We stand for the idea that everyone, regardless of their background or experience, can benefit from the practice of journaling. We encourage you to start wherever you are and grow from there, and we're here to support you every step of the way. Daily Journal Blog is committed to providing a safe, inclusive, and nurturing space for individuals from all walks of life. We value diversity, respect, and the sharing of unique experiences. Join our community of individuals on a shared quest for self-discovery and personal growth. Connect with like-minded souls, share your experiences, and let's embark on this beautiful journey of self-exploration and creativity together. Thank you for being a part of our story; together, we can continue to unlock the incredible potential that journaling offers in our lives.";
const contactContent = "We're thrilled to connect with you. Our team at Daily Journal Blog is dedicated to ensuring that your experience on our platform is seamless, enjoyable, and informative. If you have any questions, feedback, or inquiries, please don't hesitate to reach out. Whether you want to share your journaling experiences, suggest topics for our blog, or simply say hello, we welcome your messages with open arms. Feel free to contact us through the provided contact form, and we'll get back to you as soon as possible. Your thoughts and insights are invaluable to us, and we look forward to hearing from you. Thank you for being a part of our community and for making Daily Journal Blog a part of your journaling journey.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(process.env.DB_MONGOSTRING, {useNewUrlParser: true});

const postSchema = {  
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({})
  .then(posts => {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  })
  .catch(err => {
    console.log(err)
  })

});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save();
  res.redirect("/");
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId})
  .then(post => {
    res.render("post", {
      title: post.title,
      content: post.content
    })
  })
  .catch(err => {
    console.log(err)
  })

});

app.get("/delete/:deleteId", function(req,res){

  const requestedDeleteId = req.params.deleteId;

  Post.findByIdAndDelete({_id: requestedDeleteId})
  .then(() => {
    console.log('Deleted');
    res.redirect('/');
  })
  .catch((err) => {
    console.log(err);
  });


})



app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
