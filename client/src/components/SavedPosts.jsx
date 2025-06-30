import React from "react";
import {
  Paper,
  Box,
  Typography,
  CircularProgress,
  Button,
  Stack,
} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { Link } from "react-router-dom";
import PostListItem from "./PostListItem"; // Make sure this is the right path
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const SavedPosts = ({ userId }) => {
  const {
    data: savedPosts,
    isLoading: savedLoading,
  } = useQuery({
    queryKey: ["savedPosts", userId],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/saved/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data;
    },
    enabled: !!userId,
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to load saved posts.");
    },
  });

  const sortedPosts = savedPosts?.slice().sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <Stack spacing={2} width="100%">
      {savedLoading ? (
        <Box display="flex" justifyContent="center" py={4} width="100%">
          <CircularProgress size={24} />
        </Box>
      ) : !sortedPosts || sortedPosts.length === 0 ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
          py={8}
          width="100%"
        >
          <BookmarkIcon sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No saved posts
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Posts you save will appear here.
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="outlined"
            sx={{ mt: 2 }}
          >
            Explore Posts
          </Button>
        </Box>
      ) : (
        sortedPosts.map((post) => (
          <PostListItem key={post._id} post={post} />
        ))
      )}
    </Stack>
  );
};

export default SavedPosts;
