"use client";

import { useEffect, useState } from "react";
import { Typography, Box, Card, CardContent, Grid, Button, Tabs, Tab } from "@mui/material";
import DashboardLayout from "@/components/templates/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { fetchUsers, fetchUserById, fetchPotentialUsers, clearPotentialUsersPagination } from "@/store/userSlice";
import UserCard from "@/components/molecules/UserCard";
import UpdateButton from "@/components/molecules/UpdateButton";
import Loading from "@/components/atoms/Loading";
import RefreshIcon from "@mui/icons-material/Refresh";
import PotentialUsersList from "@/components/molecules/PotentialUsersList";

// Custom update button that also refreshes potential users
interface DashboardUpdateButtonProps {
  userId: string;
}

const DashboardUpdateButton: React.FC<DashboardUpdateButtonProps> = ({ userId }) => {
  const dispatch = useDispatch<AppDispatch>();

  const refreshPotentialUsers = () => {
    // Clear pagination and fetch fresh potential users
    dispatch(clearPotentialUsersPagination());
    dispatch(fetchPotentialUsers({}));
  };

  return <UpdateButton userId={userId} onUpdateSuccess={refreshPotentialUsers} />;
};

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { users, potentialUsers, selectedUser, loading, error } = useSelector((state: RootState) => state.user);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"regular" | "potential">("potential");

  // redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  // fetch users on mount
  useEffect(() => {
    if (user) {
      dispatch(fetchUsers());
      dispatch(fetchPotentialUsers({}));
    }
  }, [dispatch, user]);

  // fetch selected user details when user is selected
  useEffect(() => {
    if (selectedUserId) {
      dispatch(fetchUserById(selectedUserId));
    }
  }, [dispatch, selectedUserId]);

  // handle user selection
  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
  };

  // handle refresh data
  const handleRefreshData = () => {
    if (viewMode === "regular") {
      dispatch(fetchUsers());
    } else {
      dispatch(clearPotentialUsersPagination());
      dispatch(fetchPotentialUsers({}));
    }

    if (selectedUserId) {
      dispatch(fetchUserById(selectedUserId));
    }
  };

  const handleViewModeChange = (_: React.SyntheticEvent, newValue: "regular" | "potential") => {
    setViewMode(newValue);
  };

  if (!user) {
    return <Loading message="checking authentication..." />;
  }

  return (
    <DashboardLayout>
      <Typography variant="h4" component="h1" gutterBottom>
        user dashboard
      </Typography>

      <Typography variant="body1" color="text.secondary" paragraph>
        select a user to view and update their data
      </Typography>

      <Grid container spacing={3}>
        {/* user list */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Tabs value={viewMode} onChange={handleViewModeChange} sx={{ mb: 2 }}>
            <Tab label="Regular Users" value="regular" />
            <Tab label="Potential Users" value="potential" />
          </Tabs>

          {viewMode === "regular" ? (
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6">Users</Typography>

                  {error && (
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      startIcon={<RefreshIcon />}
                      onClick={handleRefreshData}
                      disabled={loading}
                    >
                      Reload
                    </Button>
                  )}
                </Box>

                {loading && !users.length ? (
                  <Loading message="loading users..." />
                ) : error && !users.length ? (
                  <Box>
                    <Typography color="error" sx={{ mb: 2 }}>
                      {error}
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ mt: 2 }}>
                    {users.map((user) => (
                      <Button
                        key={user.id}
                        fullWidth
                        variant={selectedUserId === user.id ? "contained" : "outlined"}
                        sx={{ mb: 1, justifyContent: "flex-start" }}
                        onClick={() => handleSelectUser(user.id)}
                      >
                        {user.displayName || user.email || user.id}
                      </Button>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          ) : (
            <PotentialUsersList onSelectUser={handleSelectUser} selectedUserId={selectedUserId} />
          )}
        </Grid>

        {/* user details */}
        <Grid size={{ xs: 12, md: 8 }}>
          {selectedUser ? (
            <>
              <UserCard user={selectedUser} />
              <DashboardUpdateButton userId={selectedUser.id} />
            </>
          ) : (
            <Card>
              <CardContent>
                <Typography align="center" color="text.secondary" sx={{ py: 5 }}>
                  select a user to view details
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
