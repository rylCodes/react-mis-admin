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

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isFetching, setIsFetching] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [totalSales, setTotalSales] = useState(null);
  const [monthlySales, setMonthlySales] = useState(null);
  const [dailySales, setDailySales] = useState(null);
  const [exercises, setExercises] = useState([]);

  const fetchClients = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/show-client",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log(response.data.data);
      if (response.status === 200) {
        setCustomers(response.data.data);
      } else {
        console.error("Failed to fetch clients");
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const fetchExercises = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/show-exercise",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        setExercises(response.data.data);
        console.log(response.data.data);
      } else {
        console.error("Failed to fetch exercises:", response);
      }
    } catch (error) {
      console.error("Error fetching exercises:", error.message);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/exercise-transaction/show",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.status === 200) {
        const clientTransactions = response.data.data;
        const totalSalesAmount = clientTransactions.reduce(
          (acc, client) => acc + parseFloat(client.total_price),
          0
        );
        const monthly = clientTransactions.filter((client) =>
          client.transactions.some((item) => item.tag === "monthly")
        );
        const daily = clientTransactions.filter((client) =>
          client.transactions.some((item) => item.tag === "session")
        );
        setTotalSales(totalSalesAmount.toFixed(2));
        setTransactions(clientTransactions);
        setMonthlySales(monthly);
        setDailySales(daily);
      } else {
        console.error("Failed to fetch transactions");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    } else {
      setIsFetching(true);
      try {
        fetchClients();
        fetchTransactions();
        fetchExercises();
        setIsFetching(false);
      } catch (error) {
        setIsFetching(false);
        console.error(error);
      }
    }
    console.log(exercises);
  }, [authToken, navigate]);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Dashboard" subtitle="Welcome to your dashboard" />
        <Box>{/* Your header-related content can go here */}</Box>
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
            title={`${monthlySales?.length} `}
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
            title={`${dailySales?.length} `}
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
            title={`${customers?.length} `}
            subtitle="Guest"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
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
                ₱ {totalSales}
              </Typography>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <BarChart isDashboard={true} />
          </Box>
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Event and Promo
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <Typography variant="h6" color={colors.greenAccent[500]}>
              Upcoming Promotions
            </Typography>
            <Typography variant="body1" color={colors.grey[100]}>
              Join us for exciting events and special offers this month!
            </Typography>
          </Box>
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Female and Male
          </Typography>
          <PieChart isDashboard={true} />
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          ></Box>
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          color={colors.grey[100]}
        >
          <Box
            mt="20px"
            p="0 25px"
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
                Weekly and Monthly
              </Typography>
            </Box>
          </Box>
          <Box height="150px" m="-25px 4 2 0">
            <HorizontalChart isDashboard={true} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
