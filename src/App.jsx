import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom"; // Import BrowserRouter
import Topbar from "./global/Topbar.jsx";
import Sidebar from "./global/Sidebar.jsx";
import Login from "./components/Login.jsx";
import ForgotPassword from "./components/forgotPassword.jsx";
import ChangePassword from "./components/changePassword.jsx"; // Adjust the import based on your file structure
import Dashboard from "./scenes/dashboard/index.jsx";
import Customer from "./scenes/customer/index.jsx";
import Update from "./components/update.jsx";
import Employee from "./scenes/employees/employee.jsx";
import EmployeeArchive from "./scenes/employees/employeeArchive.jsx";
import EmployeeAttendance from "./scenes/employees/employeeAttendace.jsx";
import SalaryInclusionForm from "./scenes/payroll/SalaryInclusionForm.jsx";
import Daily from "./scenes/customer/daily.jsx";
import Monthly from "./scenes/customer/monthly.jsx";
import InventoryForm from "./scenes/inventory/inventoryForm.jsx";
import EquipmentTable from "./scenes/inventory/equipmentTabe.jsx";
import InventoryTable from "./scenes/inventory/inventoryTable.jsx";
import Report from "./scenes/inventory/report.jsx";
import CustomerArchive from "./scenes/customer/customerArchive.jsx";
import AccountSettings from "./scenes/settings/accountSettings.jsx";
import BackupAndRestore from "./scenes/settings/backupAndRestore.jsx";
import AuditTrail from "./scenes/settings/auditTrail.jsx";
import SystemVariable from "./scenes/settings/systemVariable.jsx";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme.js";
import Payslip from "./scenes/payroll/payslip.jsx";
import PaymentReceipt from "./components/paymentReceipt.jsx";
import PayrollList from "./scenes/payroll/payrollList.jsx";
import PayrollForm from "./scenes/payroll/payrollForm.jsx";
import AddPayrollForm from "./scenes/payroll/addPayrollForm.jsx";
import PaymentForm from "./components/paymentForm.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  useEffect(() => {
    document.title = "The Gym Republic | Admin"; // Set the title here
  }, []);
  return (
    <AuthProvider>
      <Router>
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="app">
              <ContentLayout
                isSidebar={isSidebar}
                setIsSidebar={setIsSidebar}
              />
            </div>
          </ThemeProvider>
        </ColorModeContext.Provider>
      </Router>
    </AuthProvider>
  );
}

function ContentLayout({ isSidebar, setIsSidebar }) {
  const location = useLocation();

  // Define routes where Sidebar and Topbar should be hidden
  const hideSidebarAndTopbar = [
    "/",
    "/change-password",
    "/forgot-password",
    "/payslip",
    "/payment-receipt",
    "/payment-form",
  ].includes(location.pathname);

  return (
    <>
      {!hideSidebarAndTopbar && <Sidebar isSidebar={isSidebar} />}
      <main className="content">
        {!hideSidebarAndTopbar && <Topbar setIsSidebar={setIsSidebar} />}
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/update" element={<Update />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/customerarchive" element={<CustomerArchive />} />
          <Route path="/daily" element={<Daily />} />
          <Route path="/monthly" element={<Monthly />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/employeeAttendance" element={<EmployeeAttendance />} />
          <Route path="/employeearchive" element={<EmployeeArchive />} />
          <Route path="/inventoryform" element={<InventoryForm />} />
          <Route path="/equipmentTable" element={<EquipmentTable />} />
          <Route path="/inventory-table" element={<InventoryTable />} />
          <Route path="/report" element={<Report />} />
          <Route path="/payroll-list" element={<PayrollList />} />
          <Route path="/payroll-form" element={<PayrollForm />} />
          <Route path="/addpayroll-form" element={<AddPayrollForm />} />
          <Route
            path="/salary-inclusionform"
            element={<SalaryInclusionForm />}
          />
          <Route path="/payslip" element={<Payslip />} />
          <Route path="/audittrail" element={<AuditTrail />} />
          <Route path="/accountsettings" element={<AccountSettings />} />
          <Route path="/backandrestore" element={<BackupAndRestore />} />
          <Route path="/systemvariable" element={<SystemVariable />} />
          <Route path="/payment-receipt" element={<PaymentReceipt />} />
          <Route path="/payment-form" element={<PaymentForm />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
