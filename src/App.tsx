import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import FriendProfile from "./pages/FriendProfile";
import AddFriend from "./pages/AddFriend";
import SettingsPage from "./pages/SettingsPage";
import Wishlist from "./pages/Wishlist";
import Inspiration from "./pages/Inspiration";
import InspirationGiftBaskets from "./pages/InspirationGiftBaskets";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { SettingsProvider } from "@/hooks/useSettings";
import { AuthProvider } from "@/hooks/useAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SettingsProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route
                path="*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/friend/:id" element={<FriendProfile />} />
                        <Route path="/add" element={<AddFriend />} />
                        <Route path="/edit/:id" element={<AddFriend />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/inspiration" element={<Inspiration />} />
                        <Route path="/inspiration/gift-baskets" element={<InspirationGiftBaskets />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </SettingsProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
