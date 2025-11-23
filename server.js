const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrls");
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/urlShortener");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find({});
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const created = req.query.created === "1";
  const createdShort = req.query.short || null;
  res.render("index.ejs", { shortUrls, baseUrl, created, createdShort });
});

app.post("/shortUrls", async (req, res) => {
  const createdDoc = await ShortUrl.create({ full: req.body.fullUrl });
  res.redirect(`/?created=1&short=${createdDoc.short}`);
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.status(404).send("Not found");
  shortUrl.clicks++;
  await shortUrl.save();
  res.redirect(shortUrl.full);
});

app.listen(process.env.PORT || 5000, () => console.log("server is runnung"));
