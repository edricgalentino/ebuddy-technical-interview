import React, { useEffect } from "react";
import { Typography, Box, Card, CardContent, List, ListItem, ListItemButton, ListItemText, Button, Divider, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchPotentialUsers, clearPotentialUsersPagination } from "@/store/userSlice";
import RefreshIcon from "@mui/icons-material/Refresh";

interface PotentialUsersListProps {
  onSelectUser: (userId: string) => void;
  selectedUserId?: string | null;
}

const PotentialUsersList: React.FC<PotentialUsersListProps> = ({ onSelectUser, selectedUserId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { potentialUsers, loading, error, pagination } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // Load potential users on component mount
    dispatch(fetchPotentialUsers({}));

    // clear pagination on unmount
    return () => {
      dispatch(clearPotentialUsersPagination());
    };
  }, [dispatch]);

  const handleLoadMore = () => {
    if (pagination.lastVisible) {
      dispatch(fetchPotentialUsers({ lastVisible: pagination.lastVisible }));
    }
  };

  const handleRefresh = () => {
    dispatch(clearPotentialUsersPagination());
    dispatch(fetchPotentialUsers({}));
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6">Potential Users</Typography>

          <Button variant="outlined" color="primary" size="small" startIcon={<RefreshIcon />} onClick={handleRefresh} disabled={loading}>
            Refresh
          </Button>
        </Box>

        {loading && !potentialUsers.length ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : error && !potentialUsers.length ? (
          <Box>
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          </Box>
        ) : (
          <>
            <List sx={{ width: "100%" }}>
              {potentialUsers.map((user, index) => (
                <React.Fragment key={user.id}>
                  {index > 0 && <Divider component="li" />}
                  <ListItem disablePadding>
                    <ListItemButton selected={selectedUserId === user.id} onClick={() => onSelectUser(user.id)}>
                      <ListItemText
                        primary={user.displayName || user.email}
                        secondary={
                          <Box component="span">
                            <Typography variant="caption" display="block">
                              Rating: {user.totalAverageWeightRatings.toFixed(1)} | Rents: {user.numberOfRents}
                            </Typography>
                            <Typography variant="caption" display="block">
                              Potential Score: {user.potentialScore?.toFixed(3) || "N/A"}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>

            {pagination.hasMore && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Button variant="outlined" onClick={handleLoadMore} disabled={loading} size="small">
                  {loading ? <CircularProgress size={20} /> : "Load More"}
                </Button>
              </Box>
            )}

            {!potentialUsers.length && (
              <Typography color="text.secondary" sx={{ textAlign: "center", py: 3 }}>
                No potential users found
              </Typography>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PotentialUsersList;
