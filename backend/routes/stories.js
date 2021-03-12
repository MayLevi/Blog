const express = require("express");
const multer = require("multer");

const Story = require("../models/story")
const checkAuth= require("../middleware/check-auth");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

router.post(
  "",checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const story = new Story({
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId,
      createDate: new Date()
    });
    story.save().then(createdStory => {
      res.status(201).json({
        message: "story added successfully",
        story: {
          ...createdStory,
          id: createdStory._id
        }
      });
    });
  }
);

router.put(
  "/:id",checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const story = new Story({
      _id: req.body.id,
      imagePath: imagePath,
      creator: req.userData.userId
    });
    console.log(story);
    Story.updateOne({ _id: req.params.id, creator: req.userData.userId }, story).then(result => {
        res.status(200).json({message: "Update successful!"});
    });
  }
);

router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const storyQuery = Story.find();
  let fetchedStories;
  if (pageSize && currentPage) {
    storyQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  storyQuery
    .then(documents => {
      fetchedStories = documents;
      return Story.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Story fetched successfully!",
        story: fetchedStory,
        maxStories: count
      });
    });
});

router.get("/:id", (req, res, next) => {
  Story.findById(req.params.id).then(story => {
    if (story) {
      res.status(200).json(story);
    } else {
      res.status(404).json({ message: "story not found!" });
    }
  });
});

router.delete("/:id",checkAuth, (req, res, next) => {
  Story.deleteOne({ _id: req.params.id , creator: req.userData.userId }).then(result => {
    if(result.n>0) {
      res.status(200).json({message: "Update successful!"});
    }else{
      res.status(401).json({message: "Not"});
    }
  });
});

//group by
router.get("/user/:id", (req, res, next) => {
  Story.aggregate([
    {"$group" : {_id:"$province", count:{$sum:1}}}
  ]).then(story => {
    if (story) {
      res.status(200).json(story);
    } else {
      res.status(404).json({ message: "story not found!" });
    }
  });
});

module.exports = router;
