import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
  Tooltip,
  Avatar,
} from "@mui/material";
import {
  Edit as EditIcon,
  Link as LinkIcon,
  Logout as LogoutIcon,
  AdminPanelSettings as AdminIcon,
  Article as ArticleIcon,
  Lock as LockIcon,
  Add as AddIcon,
  Cancel as CancelIcon,
  Save as SaveIcon,
  CloudUpload as UploadIcon,
  Image as ImageIcon,
  Verified as VerifiedIcon,
} from "@mui/icons-material";
import PostListItem from "../components/PostListItem";
import Image from "./Image";
import Upload from "../components/Upload";
import ResetPassword from "./resetpass";



const fetchUserData = async (username) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/profile/${username}`);
  return res.data;
};

const updateUserProfile = async (updatedData) => {
  const res = await axios.patch(
    `${import.meta.env.VITE_API_URL}/users/profile/update`,
    updatedData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return res.data;
};

const UserProfile = () => {
  const { username } = useParams();
  const queryClient = useQueryClient();
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const isOwner = loggedInUser?.username === username;
  const userId = loggedInUser?.id;

  const { isLoading, error, data } = useQuery({
    queryKey: ["user", username],
    queryFn: () => fetchUserData(username),
  });

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(["user", username]);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [img, setImg] = useState(null);
  const [username1, setUsername] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (data?.user) {
      setBio(data.user.bio || "");
      setUsername(data.user.username);
    }
  }, [data]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleEditProfile = () => setIsEditing(true);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!bio.trim()) return toast.error("Bio cannot be empty.");
    if (!username1.trim()) return toast.error("Username cannot be empty.");
    const updatedData = {
      bio,
      username: username1,
      img: img?.filePath || data.user.img,
    };
    mutation.mutate(updatedData);
  };

  const handleAuthorRequest = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/request/request-author`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ userId }),
      });
      const result = await res.json();
      if (res.status === 400) return toast.error(result.message);
      if (res.ok) toast.success("Request sent to admin!");
    } catch (error) {
      toast.error("Error requesting author role");
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "secondary";
      case "author":
        return "success";
      default:
        return "primary";
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={48} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 10 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" color="error" gutterBottom>
            Error loading profile
          </Typography>
          <Typography variant="body1" paragraph>
            {error.message}
          </Typography>
          <Button component={Link} to="/" variant="contained" color="primary" sx={{ mt: 2 }}>
            Return home
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Box
      sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}
      className="dark:bg-gray-900 bg-[#f6f8fa] transition-colors duration-300"
    >
      {/* Profile Header */}
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 5 },
            mb: 4,
            borderRadius: 4,
            background: "none", // Remove MUI background so Tailwind can take over
            boxShadow: 6,
          }}
          className="dark:bg-gray-900 dark:text-white bg-white transition-colors duration-300"
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Image
                  src={data.user.img || "/default-avatar.png"}
                  alt={data.user.username}
                    w= {150}
                    h= {150}
                  className={
                    {border: 4,
                    borderColor: "primary.main",
                    boxShadow: 4,
                    borderRadius: "50%",
                    mb: 2,}
                  }
                />
                {isOwner && isEditing && (
                  <Box mt={1}>
                    <Upload type="image" setProgress={setProgress} setData={setImg}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<UploadIcon />}
                        sx={{
                          bgcolor: "background.paper",
                          color: "primary.main",
                          "&:hover": { bgcolor: "background.paper" },
                        }}
                      >
                        Change Photo
                      </Button>
                    </Upload>
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Stack spacing={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="h4" fontWeight={700}>
                    {data.user.username}
                  </Typography>
                  {data.user.role === "admin" && (
                    <Tooltip title="Verified Admin">
                      <VerifiedIcon color="secondary" />
                    </Tooltip>
                  )}
                  <Chip
                    label={data.user.role || "User"}
                    color={getRoleColor(data.user.role)}
                    size="small"
                    sx={{ ml: 1, fontWeight: 600 }}
                  />
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: 18 }}  className="dark:text-gray-300">
                  {data.user.bio || (
                    <span style={{ color: "#aaa" }}>No bio yet. Add something about yourself!</span>
                  )}
                </Typography>
                {data.user.website && (
                  <Button
                    href={data.user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<LinkIcon />}
                    sx={{ alignSelf: "flex-start", fontWeight: 500 }}
                  >
                    {data.user.website.replace(/(^\w+:|^)\/\//, "")}
                  </Button>
                )}
                <Stack direction="row" spacing={2} mt={2}>
                  {isOwner && (
                    <>
                      <Button
                        onClick={handleEditProfile}
                        variant="contained"
                        startIcon={<EditIcon />}
                        sx={{ fontWeight: 600 }}
                      >
                        Edit Profile
                      </Button>
                      <Button
                        onClick={handleLogout}
                        variant="outlined"
                        color="error"
                        startIcon={<LogoutIcon />}
                        sx={{ fontWeight: 600 }}
                      >
                        Logout
                      </Button>
                    </>
                  )}
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Main Content */}
      <Container maxWidth="md">
        {isOwner && (
          <Stack direction="row" spacing={2} sx={{ mb: 4 }} flexWrap="wrap">
            {data.user.role === "admin" && (
              <Button
                component={Link}
                to="/admin_dashboard"
                variant="contained"
                color="secondary"
                startIcon={<AdminIcon />}
                sx={{ fontWeight: 600 }}
              >
                Admin Dashboard
              </Button>
            )}
            {data.user.role !== "admin" && data.user.role !== "author" && (
              <Button
                onClick={handleAuthorRequest}
                variant="contained"
                color="warning"
                startIcon={<EditIcon />}
                sx={{ fontWeight: 600 }}
              >
                Request Author Role
              </Button>
            )}
            <Button
              onClick={() => setShowChangePassword(true)}
              variant="outlined"
              startIcon={<LockIcon />}
              sx={{ fontWeight: 600 }}
            >
              Change Password
            </Button>
            <Dialog
              open={showChangePassword}
              onClose={() => setShowChangePassword(false)}
            >
              <ResetPassword setShowChangePassword={setShowChangePassword} />
            </Dialog>
          </Stack>
        )}

        {/* Posts Section */}
        <Card elevation={2} sx={{ borderRadius: 3  }} className="dark:bg-gray-900 bg-white transition-colors duration-300">
          <CardHeader
            title={
              <Typography variant="h6" component="h2" fontWeight={700}>
                <Box display="flex" alignItems="center" gap={1} className="dark:text-gray-300">
                  <ArticleIcon color="primary" />
                  Posts by {data.user.username}
                </Box>
              </Typography>
            }
          />
          <Divider />
          {data.posts.length === 0 ? (
            <CardContent>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                textAlign="center"
                py={8}
              >
                <ImageIcon sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No posts yet
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  When {data.user.username} creates posts, they'll appear here.
                </Typography>
                {isOwner && (
                  <Button
                    component={Link}
                    to="/write"
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ mt: 2, fontWeight: 600 }}
                  >
                    Create your first post
                  </Button>
                )}
              </Box>
            </CardContent>
          ) : (
            <Box>
              {data.posts.map((post) => (
                <PostListItem key={post._id} post={post} />
              ))}
            </Box>
          )}
        </Card>
      </Container>

      {/* Edit Profile Modal */}
      <Dialog open={isEditing} onClose={() => setIsEditing(false)} maxWidth="sm" fullWidth className="dark:text-white">
        <DialogTitle className="dark : bg-slate-900">Edit Profile</DialogTitle>
        <form onSubmit={handleSaveProfile} className="dark:bg-[#18191A] dark:text-white bg-[#f6f8fa] transition-colors duration-300">
          <DialogContent >
            <Stack spacing={3}>
              <TextField
                label="Username"
                value={username1}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                margin="normal"
                inputProps={{ maxLength: 32 }}
                required
              />
              <TextField
                label="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                multiline
                rows={4}
                fullWidth
                margin="normal"
                inputProps={{ maxLength: 200 }}
                helperText={`${bio.length}/200`}
              />
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Profile Image
                </Typography>
                <Upload type="image" setProgress={setProgress} setData={setImg}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 4,
                      border: "2px dashed",
                      borderColor: "divider",
                      textAlign: "center",
                      cursor: "pointer",
                      "&:hover": { borderColor: "primary.main" },
                    }}
                  >
                    <Stack alignItems="center" spacing={1}>
                      <UploadIcon fontSize="large" color="action" />
                      <Typography variant="body2">
                        <Box component="span" color="primary.main" fontWeight="medium">
                          Click to upload
                        </Box>{" "}
                        or drag and drop
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        SVG, PNG, JPG or GIF (max. 5MB)
                      </Typography>
                    </Stack>
                  </Paper>
                </Upload>
                {progress > 0 && progress < 100 && (
                  <Box mt={2}>
                    <LinearProgress variant="determinate" value={progress} />
                    <Typography variant="caption" color="text.secondary">
                      Uploading: {progress}%
                    </Typography>
                  </Box>
                )}
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={() => setIsEditing(false)}
              startIcon={<CancelIcon />}
              color="inherit"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={mutation.isLoading ? null : <SaveIcon />}
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default UserProfile;