import express from "express";
import bodyParser from "body-parser";
import mongoose, { Schema } from "mongoose";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// creating database (wikiDB)
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

// defining blueprint of document
const articleSchema = new Schema({
  title: String,
  des: String,
});
// creating collections in cap and singular form which automatically converted into plural
const Article = mongoose.model("Article", articleSchema);

// requests targeting all articles.....
app
  .route("/articles")
  // to get all articles
  .get(async (req, res) => {
    try {
      const allArticles = await Article.find({});
      res.send(allArticles);
    } catch (error) {
      res.send(error, "Not found!");
    }
  })

  // add a new post in database (using post route)
  .post(async (req, res) => {
    try {
      const js = new Article({
        title: req.body.title,
        des: req.body.des,
      });
      await js.save();
      res.send("added succesfully");
    } catch (error) {}
  })

  //   delete all articles...
  .delete(async (req, res) => {
    try {
      await Article.deleteMany();
      res.send("deleted!");
    } catch (error) {
      res.send(error, "not able to delete!");
    }
  });

// requests targeting specific articles....

app
  .route("/articles/:articleTitle")
  // get article by title...
  .get(async (req, res) => {
    try {
      const founded = await Article.findOne({ title: req.params.articleTitle });
      res.send(founded);
    } catch (error) {
      res.send(error, "not found!");
    }
  })
  // update specific article fully...
  .put(async (req, res) => {
    try {
      const updated = await Article.findOneAndUpdate(
        { title: req.params.articleTitle },
        { title: req.body.title, des: req.body.des },
        { new: true }
      );

      res.send(updated);
    } catch {
      (error) => {
        res.send(error, "something went wrong");
      };
    }
  })

  // update specific field in article...
  .patch(async (req, res) => {
    try {
      const updateSpecific = await Article.findOneAndUpdate(
        { title: req.params.articleTitle },
        { $set: req.body },
        { new: true }
      );

      res.send(updateSpecific);
    } catch (error) {
      res.send(error, "something went wrong");
    }
  })
  .delete(async (req, res) => {
    try {
      await Article.deleteOne({ title: req.params.articleTitle });

      res.send("Deleted successfully!");
    } catch (error) {
      res.send(error, "something went wrong");
    }
  });

app.listen(port, (req, res) => {
  console.log(`listening the server on the port ${port} `);
});
