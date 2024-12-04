import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Header from "../../components/Header";
import HorizontalChart from "../../components/HorizontalChart";
import PieChart from "../../components/PieChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import DashboardSkeleton from "./DashboardSkeleton";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isFetching, setIsFetching] = useState(false);
  const [dashboardData, setDashboardData] = useState([]);
  const [salesExercise, setSalesExercise] = useState([]);
  const [maleFemale, setMaleFemale] = useState([]);

  const fetchDashboardData = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const dataResponse = response.data;
      setDashboardData(dataResponse);

      const salesExerciseData = dataResponse["Sales_exercise"].map((item) => ({
        service: item.name,
        revenue: item.sales,
      }));
      setSalesExercise(salesExerciseData);

      const maleFemaleData = [
        {
          id: "female",
          label: "female",
          value: dataResponse.total_gender[0].female,
          color: "hsl(162, 70%, 50%)",
        },
        {
          id: "male",
          label: "male",
          value: dataResponse.total_gender[0].male,
          color: "hsl(344, 70%, 50%)",
        },
      ];
      setMaleFemale(maleFemaleData);
      setIsFetching(false);
    } catch (error) {
      console.error("Error fetching inventory data:", error);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    } else {
      fetchDashboardData();
    }
  }, [authToken, navigate]);

  return (
    <>
      {isFetching ? (
        <DashboardSkeleton />
      ) : (
        <Box m="20px">
          {/* HEADER */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Header title="Dashboard" subtitle="Welcome to your dashboard" />
          </Box>

          {/* GRID & CHARTS */}
          <Box
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gridAutoRows="140px"
            gap="20px"
          >
            {/* ROW 1 */}
            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={`${dashboardData.monthly_customer || ""} `}
                subtitle="Monthly"
                icon={
                  <CalendarMonthOutlinedIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>

            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={`${dashboardData.session_customer || ""} `}
                subtitle="Daily"
                icon={
                  <PointOfSaleIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>

            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={`${
                  dashboardData.session_customer +
                    dashboardData.monthly_customer || ""
                } `}
                subtitle="Guest"
                icon={
                  <PersonAddIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
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
              sx={{
                width: {
                  xs: "100%",
                  md: "100%",
                  lg: "60%",
                },
              }}
            >
              <Box
                mt="25px"
                p="0 30px"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="h5"
                    fontWeight="600"
                    color={colors.grey[100]}
                  >
                    Sales Services
                  </Typography>
                  <Typography
                    variant="h3"
                    fontWeight="bold"
                    color={colors.greenAccent[500]}
                  >
                    ₱ {dashboardData.total_sales}
                  </Typography>
                </Box>
              </Box>

              <Box height="100%" width={"100%"} padding={"2rem"}>
                <BarChart
                  isDashboard={true}
                  salesExerciseData={salesExercise}
                />
              </Box>
            </Box>

            {/* Pie Chart */}
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
              <Typography variant="h5" fontWeight="600">
                Female and Male
              </Typography>
              <PieChart
                height={"100%"}
                isDashboard={true}
                maleFemaleData={maleFemale}
              />
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Dashboard;
