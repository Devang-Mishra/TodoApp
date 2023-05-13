const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const _ = require("lodash");
const mongoose = require("mongoose");
const app = express();

// console.log(date)

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb+srv://Devangmishra285:2020033%40Dm@cluster0.zuhigk9.mongodb.net/TodoListDB");

const itemSchema = new mongoose.Schema({
  name: String,
});

const listSchema = new mongoose.Schema({
  name: String,
  listItems: [itemSchema],
});

const List = mongoose.model("List",  listSchema);

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Welcome to your todolist!",
});

const item2 = new Item({
  name: "Hit the + button to add new item",
});

const item3 = new Item({
  name: "Hit - to delete the item",
});

const defaultItems = [item1, item2, item3];

var day = date.getdate();
app.get("/", function (req, res) {
  Item.find()
    .then(function (items) {
      if (items.length === 0) {
        Item.insertMany(defaultItems)
          .then(() => console.log("Successfully added new items to DB"))
          .catch(function (err) {
            console.log(err);
          });
        res.redirect("/");
      } else {
        // console.log(items);
        res.render("list", {
          ListTitle: "Today",
          ListItems: items,
        });
      }
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.post("/", function (req, res) {
  //  console.log(req.body.Items)
  var itemName = req.body.Items;
  var listName = req.body.button;
  const newItem = new Item({ name: itemName });
  if (itemName && itemName.length <= 30) {
    if (listName === "Today") {
      newItem.save().then(function(){
          res.redirect("/");
      })
      
      
      
    } else {
      List.findOne({ name: listName })
        .then(function (list) {
          list.listItems.push(newItem);
          list.save().then(function(){
             res.redirect("/" + listName);
          })
            
          
         
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  }
});

app.post("/delete", function (req, res) {                   
  //console.log(req.body.checkBox)
  const deleteid = req.body.delButton;
  const listName = req.body.listName;
  if (listName === "Today") {
    Item.findByIdAndRemove(deleteid)
      .then()
      .catch(function (err) {
        console.log(err);
      });
    res.redirect("/");
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { listItems: { _id: deleteid } } }
    )
      .then(res.redirect("/" + listName))
      .catch(function (err) {
        console.log(err);
      });
  }
});

app.get("/about", function (req, res) {
  res.render("about");
});

//creating another list by express routing parameter
app.get("/:customListName", function (req, res) {
  const listName = _.capitalize(req.params.customListName);

  List.findOne({ name: listName })
    .then(function (list) {
      if (!list) {
        //list dosen't exists
        const newList = new List({
          name: listName,
          listItems: defaultItems,
        });
        newList.save();
        res.redirect("/:customListName");
      } else {
        //list already exists and we display it
        res.render("list", {
          ListTitle: list.name,
          ListItems: list.listItems,
        });
      }
    })
    .catch(() => console.log("error"));
});

app.listen(3000, function () {
  console.log("server started");
});
