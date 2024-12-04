import React from "react";
import { Box, Skeleton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import StatBox from "../../components/StatBox";

const DashboardSkeleton = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight="bold">
          <Skeleton width={200} />
        </Typography>
        <Typography variant="subtitle1">
          <Skeleton width={300} />
        </Typography>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
        marginTop={"2rem"}
      >
        {/* ROW 1 */}
        {[1, 2, 3].map((_, index) => (
          <Box
            key={index}
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Skeleton variant="rectangular" width="100%" height="100%">
              <StatBox
                title={<Skeleton width="50%" />}
                subtitle={<Skeleton width="30%" />}
                icon={
                  index === 0 ? (
                    <CalendarMonthOutlinedIcon
                      sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                    />
                  ) : index === 1 ? (
                    <PointOfSaleIcon
                      sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                    />
                  ) : (
                    <PersonAddIcon
                      sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                    />
                  )
                }
              />
            </Skeleton>
          </Box>
        ))}
      </Box>

      <Box
        marginTop={"2rem"}
        display="flex"
        gap={2}
        sx={{
          maxWidth: "100rem",
          maxHeight: "500px",
          flexDirection: {
            md: "column",
            lg: "row",
          },
        }}
      >
        <Box
          backgroundColor={colors.primary[400]}
          padding={"2rem"}
          height="500px"
          sx={{
            width: {
              xs: "100%",
              md: "100%",
              lg: "60%",
            },
          }}
        >
          <Box marginBottom={"2rem"}>
            <Skeleton width="20rem" />
            <Skeleton width="16rem" />
          </Box>

          <Box height="90%" width={"100%"} paddingInline={"2rem"}>
            <Skeleton variant="rectangular" width="100%" height="100%" />
          </Box>
        </Box>

        <Box
          backgroundColor={colors.primary[400]}
          height="500px"
          sx={{
            width: {
              xs: "100%",
              md: "100%",
              lg: "40%",
            },
          }}
          maxWidth={"40rem"}
          p="2rem"
        >
          <Skeleton variant="rectangular" width="100%" height="100%" />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardSkeleton;
