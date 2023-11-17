const { Router } = require("express");
const multer = require("multer");
const Blog = require('../models/blog');
const Comment = require('../models/comment');
const path = require("path");

const router = Router();

// multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage })




//simple add blog page
router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

// post add blog route
router.post("/add-new", upload.single('coverImage'), async (req, res) => {
  const {title, body} = req.body;
  // console.log(req.body);
  // console.log(req.file, req.body)

  const blog = await Blog.create({
     title,
     body,
     createdBy:req.user._id,
     coverImageURL:`/uploads/${req.file.filename}`,
  });
  return res.redirect(`/blog/${blog._id}`);
});

//post comment
router.post('/comment/:blogId',async (req,res)=>{
  console.log(req.body);
  const comment = await Comment.create({
    content:req.body.content,
    blogId:req.params.blogId,
    createdBy:req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});


//particular blog
router.get('/:id',async (req,res)=>{
  const blog=await Blog.findById(req.params.id).populate('createdBy');
  const comments=await Comment.find({blogId:blog._id}).populate('createdBy');
  // console.log(comments);
  // console.log(blog);
  return res.render('blog',{
    user:req.user,
    comments,
    blog,
  })
});



module.exports = router;
