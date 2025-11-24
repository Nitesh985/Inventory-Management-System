import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Icon from "../AppIcon";
import Button from "./Button";

const Header = ({ onMenuToggle, syncStatus = "online" }) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const location = useLocation();

  const primaryNavItems = [
    {
      label: "Dashboard",
      path: "/business-dashboard",
      icon: "LayoutDashboard",
    },
    { label: "Inventory", path: "/inventory-management", icon: "Package" },
    { label: "Sales", path: "/sales-recording", icon: "ShoppingCart" },
    { label: "Expenses", path: "/expense-tracking", icon: "Receipt" },
    { label: "Reports", path: "/ai-reports-dashboard", icon: "BarChart3" },
  ];

  const secondaryNavItems = [
    { label: "Settings", path: "/business-settings", icon: "Settings" },
  ];

  const getSyncStatusColor = () => {
    switch (syncStatus) {
      case "online":
        return "text-success";
      case "syncing":
        return "text-warning";
      case "offline":
        return "text-error";
      default:
        return "text-muted-foreground";
    }
  };

  const getSyncStatusIcon = () => {
    switch (syncStatus) {
      case "online":
        return "Wifi";
      case "syncing":
        return "RefreshCw";
      case "offline":
        return "WifiOff";
      default:
        return "Wifi";
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-100 bg-card border-b border-border">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left Section - Logo and Mobile Menu */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <Icon name="Menu" size={20} />
          </Button>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Calculator" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold text-foreground hidden sm:block">
              Digital Khata
            </span>
          </div>
        </div>

        {/* Center Section - Primary Navigation (Desktop) */}
        <nav className="hidden lg:flex items-center space-x-1">
          {primaryNavItems?.map((item) => {
            const isActive = location?.pathname === item?.path;
            return (
              <Button
                key={item?.path}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className="flex items-center space-x-2 px-3"
                onClick={() => (window.location.href = item?.path)}
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.label}</span>
              </Button>
            );
          })}
        </nav>

        {/* Right Section - Sync Status and More Menu */}
        <div className="flex items-center space-x-3">
          {/* Sync Status Indicator */}
          <div className="flex items-center space-x-2 px-2 py-1 rounded-md bg-muted">
            <Icon
              name={getSyncStatusIcon()}
              size={14}
              className={`${getSyncStatusColor()} ${syncStatus === "syncing" ? "animate-spin" : ""}`}
            />
            <span className="text-xs font-medium text-muted-foreground capitalize hidden sm:block">
              {syncStatus}
            </span>
          </div>

          {/* More Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="relative"
            >
              <Icon name="MoreVertical" size={20} />
            </Button>

            {showMoreMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-modal z-200">
                <div className="py-2">
                  {secondaryNavItems?.map((item) => (
                    <button
                      key={item?.path}
                      onClick={() => {
                        window.location.href = item?.path;
                        setShowMoreMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-smooth"
                    >
                      <Icon name={item?.icon} size={16} />
                      <span>{item?.label}</span>
                    </button>
                  ))}

                  <div className="border-t border-border my-2"></div>

                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-smooth">
                    <Icon name="HelpCircle" size={16} />
                    <span>Help & Support</span>
                  </button>

                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-smooth">
                    <Icon name="LogOut" size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Navigation Overlay */}
      {showMoreMenu && (
        <div
          className="fixed inset-0 bg-black/20 z-50 lg:hidden"
          onClick={() => setShowMoreMenu(false)}
        />
      )}
    </header>
  );
};

export default Header;
