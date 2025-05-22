import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Report from "../models/report.model.js";

const getLast7DaysDate = () => {
    const now = new Date();
    now.setDate(now.getDate() - 7);
    return now;
  };

export const getAnalytics = async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const totalPosts = await Post.countDocuments();
      const totalReports = await Report.countDocuments();

      const newUsersThisWeek = await User.countDocuments({
            createdAt: { $gte: getLast7DaysDate() }
        });

       const postsThisWeek = await Post.countDocuments({
                createdAt: { $gte: getLast7DaysDate() }
            });
  
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 6); // 7 days including today
  
      // Posts per day
      const postsByDay = await Post.aggregate([
        {
          $match: {
            createdAt: { $gte: weekAgo }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);
  
      res.json({
        totalUsers,
        totalPosts,
        totalReports,
        postsByDay,
        newUsersThisWeek,
        postsThisWeek,
      });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  };
  