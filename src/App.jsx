import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import TaskManager from "@/components/pages/TaskManager";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background font-body">
        <Routes>
          <Route path="/" element={<TaskManager />} />
          <Route path="/category/:categoryId" element={<TaskManager />} />
          <Route path="/today" element={<TaskManager />} />
          <Route path="/overdue" element={<TaskManager />} />
          <Route path="/completed" element={<TaskManager />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="mt-16"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
}

export default App;