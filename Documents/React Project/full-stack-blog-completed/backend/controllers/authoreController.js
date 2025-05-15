// controllers/author.controller.js
import User from '../models/user.model.js';

export const FollowAuthor = async (req, res) => {
  const { authorId } = req.body;
  const userId = req.user?.id;

  try {
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const author = await User.findById(authorId);
    const user = await User.findById(userId);

    if (!author || !user) {
      return res.status(404).json({ message: 'Author or user not found' });
    }

    const isFollowing = author.followers.includes(userId);

    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(authorId, {
        $pull: { followers: userId }
      });

      await User.findByIdAndUpdate(userId, {
        $pull: { following: authorId }
      });

      return res.status(200).json({ message: 'Unfollowed successfully' });
    } else {
      // Follow
      await User.findByIdAndUpdate(authorId, {
        $addToSet: { followers: userId }
      });

      await User.findByIdAndUpdate(userId, {
        $addToSet: { following: authorId }
      });

      return res.status(200).json({ message: 'Followed successfully' });
    }

  } catch (error) {
    console.error("FollowAuthor error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};
