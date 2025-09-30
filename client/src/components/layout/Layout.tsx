import React from "react";
import { Link, useLocation } from "react-router-dom";
import { PlusIcon, HomeIcon, CubeIcon } from "@heroicons/react/24/outline";
import ActivityLog from "../ActivityLog";

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: HomeIcon,
      current: location.pathname === "/",
    },
    {
      name: "Products",
      href: "/products",
      icon: HomeIcon,
      current: location.pathname === "/products",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white shadow-md border-r border-gray-200">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
                <CubeIcon className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-gray-900">
                Product Manager
              </h1>
            </div>
          </div>

          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                      ${
                        item.current
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex-shrink-0 p-4">
            <Link
              to="/products/new"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 w-full flex items-center justify-center shadow-sm"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar untuk mobile */}
        <div className="md:hidden bg-white shadow-md px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
              <CubeIcon className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900">
              Product Manager
            </h1>
          </div>
          <Link
            to="/products/new"
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors shadow-sm"
          >
            <PlusIcon className="h-4 w-4" />
          </Link>
        </div>

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>

          {/* Activity Log Sidebar */}
          <div className="hidden lg:flex lg:flex-col lg:w-80 lg:border-l lg:border-gray-200 lg:bg-white lg:shadow-md">
            <ActivityLog />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
