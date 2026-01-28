import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider, RoleProvider, NotificationProvider } from "./store";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "sonner";
import AppRouter from "./router";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
