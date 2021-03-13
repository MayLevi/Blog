const express = require("express");
const multer = require("multer");

const Post = require("../models/post");
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
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
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
  "post/:id",checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId
    });
    console.log(post);
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
        res.status(200).json({message: "Update successful!"});
    });
  }
);

router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count
      });
    });
});

router.get("post/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
});

router.delete("post/:id",checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id , creator: req.userData.userId }).then(result => {
    if(result.n>0) {
      res.status(200).json({message: "Update successful!"});
    }else{
      res.status(401).json({message: "Not"});
    }
  });
});

// group by
router.get("/gbu",(req,res,next) => {
  Post.aggregate([{
    "$group": {
      _id: "$creator",
      count: {
        $sum: 1
      }
    }
  }]).then(posts => {
    if (posts) {
      res.status(200).json(posts);
    } else {
      res.status(404).json({ message: "Posts not found!" });
    }
  })
 });



// MapReduce
router.get("/mr",(req,res,next) => {
  const o = {};
  o.map = 'function () { emit(this.Title, 1) }';
  o.reduce = 'function (k, vals) { return vals.length }';
  o.out = { replace: 'createdCollectionNameForResults' }
  o.verbose = true;
  Post.mapReduce(o, function (err, model, stats) {
    Post.find().where('value').gt(1).exec(function (err, docs) {
    });
  }).then(posts => {
    if (posts) {
      res.status(200).json(posts);
    } else {
      res.status(404).json({ message: "Posts not found!" });
    }
  })

})

module.exports = router;
