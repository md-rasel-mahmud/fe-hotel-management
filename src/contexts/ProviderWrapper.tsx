import { AuthProvider } from "@/contexts/AuthContext";
import { store } from "@/lib/store/store";
import { router } from "@/routes/router";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC, ReactNode } from "react";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const ProviderWrapper: FC<{
  children: ReactNode;
}> = ({ children }) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Provider store={store}>
            <TooltipProvider>
              <RouterProvider router={router} />
            </TooltipProvider>
          </Provider>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
};

export default ProviderWrapper;
