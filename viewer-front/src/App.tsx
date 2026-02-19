import { Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { Viewer } from "./pages/Viewer";
import { ProtectedRoute } from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/login/:userId/:roomId/:objectId" element={<Login />} />

      <Route
        path="/viewer"
        element={
          <ProtectedRoute>
            <Viewer />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
