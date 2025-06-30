import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";

export const getPostComments = async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate("user", "username img")
    .sort({ createdAt: -1 });

  res.json(comments);
};

export const addComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json("User not found.");
    }

    if(user.isBanned){
      return res.status(403).json("You are banned from commenting.");
    }
    

    const newComment = new Comment({
      ...req.body,
      user: user._id,
      post: postId,
    });

    const savedComment = await newComment.save();

    res.status(201).json(savedComment);
  } catch (error) {
    console.error("Error while adding comment:", error.message);
    res.status(500).json("Something went wrong.");
  }
};


export const deleteComment = async (req, res) => {
  // const userId = req.user.id;
  const commentId = req.params.id;
  

  // const user = await User.findById(userId);
  // if (!user) {
  //   return res.status(404).json("User not found.");
  // }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res.status(404).json("Comment not found.");
  }



  await Comment.findByIdAndDelete(commentId);

  res.status(200).json("Comment deleted successfully.");
  
  
  
};


export const editeComment = async (req, res) => {
  const commentId = req.params.id;
  const { desc } = req.body;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json("Comment not found.");
    }

    comment.desc = desc;
    const updatedComment = await comment.save();

    res.status(200).json(updatedComment);
  } catch (error) {
    console.error("Error while editing comment:", error.message);
    res.status(500).json("Something went wrong.");
  }

}
