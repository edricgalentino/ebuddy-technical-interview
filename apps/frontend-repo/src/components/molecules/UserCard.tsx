import React from "react";
import { Card, CardContent, Typography, Box, Grid } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import TimelineIcon from "@mui/icons-material/Timeline";
import UpdateIcon from "@mui/icons-material/Update";
import { User } from "@/apis/user";

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card sx={{ mb: 3, overflow: "visible" }}>
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" component="div" gutterBottom>
            user id: {user.id}
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {/* ratings */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box display="flex" alignItems="center" sx={{ mb: { xs: 1, sm: 0 } }}>
              <StarIcon color="warning" sx={{ mr: 1 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  average rating
                </Typography>
                <Typography variant="h6">{user.totalAverageWeightRatings.toFixed(1)}</Typography>
              </Box>
            </Box>
          </Grid>

          {/* number of rents */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box display="flex" alignItems="center" sx={{ mb: { xs: 1, sm: 0 } }}>
              <TimelineIcon color="primary" sx={{ mr: 1 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  number of rents
                </Typography>
                <Typography variant="h6">{user.numberOfRents}</Typography>
              </Box>
            </Box>
          </Grid>

          {/* recently active */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box display="flex" alignItems="center">
              <UpdateIcon color="success" sx={{ mr: 1 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  last active
                </Typography>
                <Typography variant="h6">{formatDate(user.recentlyActive)}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default UserCard;
