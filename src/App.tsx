import { BrowserRouter } from "react-router-dom";
import { AuthProvider, RoleProvider } from "./store";
import AppRouter from "./router";

function App() {
  return (
    <AuthProvider>
      <RoleProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </RoleProvider>
    </AuthProvider>
  );
}

export default App;
