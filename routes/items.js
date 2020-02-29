const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
// Item Model
const Item = require("../models/Items");

// route get api/items, get all items
router.get("/", (req, res) => {
  Item.find()
    .sort({ date: -1 })
    .then(items => res.json(items));
});

// route post api/items, add a item, private
router.post("/", auth, (req, res) => {
  console.log(req.file);

  const newItem = new Item({
    weathers: req.body.weathers,
    newID: req.body.newID,
    name: req.body.name
  });
  newItem.save().then(item => res.json(item));
});
// route delete api/items, delete a item, private
router.delete("/:id", auth, (req, res) => {
  Item.findById(req.params.id)
    .then(item => item.remove().then(() => res.json({ success: true })))
    .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;
