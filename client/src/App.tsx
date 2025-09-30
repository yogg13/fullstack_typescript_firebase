import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./config/queryClient";
import Layout from "./components/layout/Layout";
import ProductsPage from "./pages/ProductsPage";
import CreateProductPage from "./pages/CreateProductPage";
import EditProductPage from "./pages/EditProductPage";
import Toaster from "./components/ui/Toaster";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Layout>
            <Routes>
              <Route path="/" element={<ProductsPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/new" element={<CreateProductPage />} />
              <Route path="/products/:id/edit" element={<EditProductPage />} />
            </Routes>
          </Layout>

          {/* Toast notifications */}
          <Toaster />
        </div>
      </Router>

      {/* React Query DevTools (hanya untuk development) */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;
