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
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries(["user", username]);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
      if (isOwner) {
        localStorage.setItem("user", JSON.stringify({
          ...updatedUser,
        }));
      }
      if (updatedUser.username !== username) {
        window.location.href = `/profile/${updatedUser.username}`; 
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    },
  });

  const { data: walletData, isLoading: walletLoading } = useQuery({
    queryKey: ["wallet", userId],
    queryFn: async () => {
      if (data?.user?.role !== "author") return null;
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/payment/donations/wallet/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data;

    },
    enabled: !!userId && data?.user?.role === "author",
    onError : (message) =>{
      toast.error(message || "Failed to load wallet data.");
    }

  });

  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [img, setImg] = useState(null);
  const [username1, setUsername] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [progress, setProgress] = useState(0);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  useEffect(() => {
    if (data) {
      setBio(data.bio || "");
      setUsername(data.username);
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
      img: img?.filePath || data.img,
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

const withdrawMutation = useMutation({
  mutationFn: (amount) =>
    axios.post(`${import.meta.env.VITE_API_URL}/payment/withdraw/${data.user._id}`, { amount }),
  onSuccess: () => {
    toast.success("Withdrawal request sent successfully!");
    queryClient.invalidateQueries(["wallet", userId]);
  },
  onError: (err) => {
    toast.error(err.response?.data?.message || "Failed to request withdrawal.");
  },
});

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
      sx={{ 
        bgcolor: "background.default", 
        minHeight: "100vh", 
        py: 4,
        background: 'linear-gradient(to bottom, #f6f8fa, #ffffff)',
        '.dark &': {
          background: 'linear-gradient(to bottom, #111827, #1f2937)'
        }
      }}
    >
      {/* Profile Header Section */}
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Left Column - Profile Picture and Wallet */}
          
          <Grid item xs={12} md={4}>
          <Stack
            direction={{ xs: 'column', md: 'row-reverse' }}
            spacing={10}
            alignItems="flex-start"
          >
            {/* Wallet Section */}
            {data.user?.role === "author" && (
              <Box sx={{ flex: 1 }}>
                <Card elevation={3} sx={{ borderRadius: 3, p: 3 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Donation Wallet
                  </Typography>

                  {walletLoading ? (
                    <Box display="flex" justifyContent="center" py={2}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : (
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Current Balance
                        </Typography>
                       <Typography variant="h5" fontWeight={700} color="success.main">
                          {walletData?.balance !== undefined ? `${walletData.balance} ETB` : "0 ETB"}
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        disabled={walletData?.balance < 10}
                        onClick={() => setWithdrawDialogOpen(true)}
                        sx={{ py: 1.5 }}
                      >
                        Withdraw Funds
                      </Button>

                      {walletData?.balance < 100 && (
                        <Typography variant="caption" color="text.secondary" textAlign="center" >
                          Minimum 100 ETB required to withdraw.
                        </Typography>
                      )}
                    </Stack>
                  )}
                </Card>
              </Box>
            )}

            {/* Profile Picture */}
            <Box sx={{ flex: 1 }}>
              <Card elevation={3} sx={{ borderRadius: 3, p: 3, textAlign: "center" }}>
                <Image
                  src={data.user?.img || "/default-avatar.png"}
                  alt={data.user?.username}
                  w={180}
                  h={180}
                  className="rounded-full border-4 border-primary-main shadow-lg object-cover mx-auto"
                />
                {isOwner && isEditing && (
                  <Box mt={2}>
                    <Upload type="image" setProgress={setProgress} setData={setImg}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<UploadIcon />}
                        fullWidth
                        sx={{
                          mt: 1,
                          bgcolor: "background.paper",
                          color: "primary.main",
                          "&:hover": { bgcolor: "background.paper", opacity: 0.9 },
                        }}
                      >
                        Change Photo
                      </Button>
                    </Upload>
                  </Box>
                )}
              </Card>
            </Box>
          </Stack>

        </Grid>


          
          {/* Right Column - Profile Info and Posts */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={3}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                mb: 3
              }}
              className="dark:bg-gray-800 bg-white"
            >
              <Stack spacing={3}>
                {/* User Info Header */}
                <Box display="flex" alignItems="center" flexWrap="wrap" gap={1}>
                  <Typography variant="h4" fontWeight={700} className="dark:text-gray-300">
                    {data.user?.username}
                  </Typography>
                  {data.user?.role === "admin" && (
                    <Tooltip title="Verified Admin">
                      <VerifiedIcon color="secondary" fontSize="large" />
                    </Tooltip>
                  )}
                  <Chip
                    label={data.user?.role || "User"}
                    color={getRoleColor(data.user?.role)}
                    size="medium"
                    sx={{ fontWeight: 600, ml: 1 }}
                  />
                </Box>

                {/* Bio */}
                <Box>
                  <Typography variant="body1" sx={{ fontSize: 18 }} className="dark:text-gray-300">
                    {data.user?.bio || (
                      <span style={{ color: "#aaa", fontStyle: 'italic' }}>
                        No bio yet. Add something about yourself!
                      </span>
                    )}
                  </Typography>
                </Box>

                {/* Website Link */}
                {data.website && (
                  <Button
                    href={data.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<LinkIcon />}
                    sx={{ 
                      alignSelf: 'flex-start',
                      fontWeight: 500,
                      color: 'primary.main'
                    }}
                  >
                    {data.website.replace(/(^\w+:|^)\/\//, "")}
                  </Button>
                )}

                {/* Action Buttons */}
                {isOwner && (
                  <Stack direction="row" spacing={2} flexWrap="wrap">
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
                    {data.user?.role === "user" && (
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
                  </Stack>
                )}
              </Stack>
            </Paper>

            {/* Posts Section */}
            <Paper
              elevation={3}
              sx={{
                borderRadius: 3,
                overflow: 'hidden'
              }}
              className="dark:bg-gray-800 bg-white"
            >
              <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6" component="h2" fontWeight={700}>
                  <Box display="flex" alignItems="center" gap={1} className="dark:text-gray-300">
                    <ArticleIcon color="primary" />
                    Posts by {data.username}
                  </Box>
                </Typography>
              </Box>

              {data.posts && data.posts.length === 0 ? (
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
                    When {data.username} creates posts, they'll appear here.
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
              ) : (
                <Box>
                  {data.posts && data.posts.map((post) => (
                    <PostListItem key={post._id} post={post} />
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Edit Profile Modal */}
      <Dialog open={isEditing} onClose={() => setIsEditing(false)} maxWidth="sm" fullWidth>
        <DialogTitle className="dark:bg-slate-100">Edit Profile</DialogTitle>
        <form onSubmit={handleSaveProfile} className="dark:bg-slate-200">
          <DialogContent>
            <Stack spacing={3}>
              <TextField
                label="Username"
                value={username1}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                margin="normal"
                inputProps={{ maxLength: 32 }}
                required
                sx={{
                  '& .MuiInputBase-input': { color: 'inherit' },
                  '& .MuiInputLabel-root': { color: 'text.secondary' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                }}
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
                sx={{
                  '& .MuiInputBase-input': { color: 'inherit' },
                  '& .MuiInputLabel-root': { color: 'text.secondary' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                }}
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

      {/* Change Password Dialog */}
      <Dialog
        open={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      >
        <ResetPassword setShowChangePassword={setShowChangePassword} />
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={withdrawDialogOpen} onClose={() => setWithdrawDialogOpen(false)}>
        <DialogTitle>Withdraw Funds</DialogTitle>
        <DialogContent>
          <TextField
            label="Amount"
            type="number"
            fullWidth
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            inputProps={{ min: 10, max: walletData?.balance || 0 }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWithdrawDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            className="bg-success-500 hover:bg-success-600"
            startIcon={withdrawMutation.isLoading ? <CircularProgress size={20} /> : null}
            disabled={
              !withdrawAmount ||
              Number(withdrawAmount) < 10 ||
              Number(withdrawAmount) > (walletData?.balance || 0) ||
              withdrawMutation.isLoading
            }
            onClick={async () => {
              await withdrawMutation.mutateAsync(Number(withdrawAmount));
              setWithdrawDialogOpen(false);
              setWithdrawAmount('');
            }}
          >
            {withdrawMutation.isLoading ? "Processing..." : "Request"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserProfile;