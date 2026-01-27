import { BrowserRouter } from "react-router-dom";
import { AuthProvider, RoleProvider, NotificationProvider } from "./store";
import { Toaster } from "sonner";
import AppRouter from "./router";

function App() {
  return (
    <AuthProvider>
      <RoleProvider>
        <NotificationProvider>
          <BrowserRouter>
            <AppRouter />
            <Toaster richColors position="top-right" />
          </BrowserRouter>
        </NotificationProvider>
      </RoleProvider>
    </AuthProvider>
  );
}

export default App;
