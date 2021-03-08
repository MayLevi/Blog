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
    const post = new Story({
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId,
      createDate: new Date()
    });
    post.save().then(createdPost => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          ...createdPost,
          id: createdPost._id
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
    const post = new Story({
      _id: req.body.id,
      imagePath: imagePath,
      creator: req.userData.userId
    });
    console.log(post);
    Story.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
        res.status(200).json({message: "Update successful!"});
    });
  }
);

router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Story.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Story.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Story fetched successfully!",
        story: fetchedStory,
        maxPosts: count
      });
    });
});

router.get("/:id", (req, res, next) => {
  Story.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
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
  ]).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
});

module.exports = router;