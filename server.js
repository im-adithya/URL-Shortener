"use strict";

var express = require("express");
var mongo = require("mongodb");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var cors = require("cors");
var dns = require("dns");
var app = express();
var id = 0;
var list = [];
const allfuncs = require("./allfuncs.js");
// Basic Configuration
var port = process.env.PORT || 3000;

/*mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});*/

app.use(cors());

/** this project needs to parse POST bodies **/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/shorturl/new", (req, res) => {
  let url = req.body.url;
  dns.lookup(allfuncs.refiner(url), function onLookup(err, addresses, family) {
    if (err) {
      res.json({ error: "invalid URL" });
    } else {
      id += 1;

      //console.log("addresses:", addresses);
      //res.json({ original_url: url, short_url: "dummy" });
      const theobj = {
        original_url: url,
        short_url: id
      };
      list.push(theobj);
      res.json(theobj);
    }
  });
});

app.get("/api/shorturl/:id", (req, res) => {
  let { id } = req.params;
  const link = list.find(l => l.short_url === parseInt(id));
  if (link) {
    return res.redirect(link.original_url);
  } else {
    return res.json({ error: "No short URL found for the given input" });
  }
});

app.listen(port, function() {
  console.log("Node.js listening ...");
});
