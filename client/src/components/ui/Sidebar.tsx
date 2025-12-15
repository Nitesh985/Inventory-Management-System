import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Icon from "../AppIcon";
import Button from "./Button";
import Logo from "../../assets/logo.png";

const Sidebar = ({ isCollapsed = false, onToggle, syncStatus = "online", onMobileOpenChange }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const navigationSections = [
    {
      title: "Dashboard",
      items: [
        {
          label: "Business Overview",
          path: "/business-dashboard",
          icon: "LayoutDashboard",
        },
      ],
    },
    {
      title: "Operations",
      items: [
        {
          label: "Inventory Management",
          path: "/inventory-management",
          icon: "Package",
        },
        {
          label: "Sales Recording",
          path: "/sales-recording",
          icon: "ShoppingCart",
        },
        {
          label: "Expense Tracking",
          path: "/expense-tracking",
          icon: "Receipt",
        },
       {
          label: "Customer Khata",
          path: "/customer-khata",
          icon: "Users",
        }, 
      ],
    },
    {
      title: "Analytics",
      items: [
        {
          label: "AI Reports Dashboard",
          path: "/ai-reports-dashboard",
          icon: "BarChart3",
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          label: "Business Settings",
          path: "/business-settings",
          icon: "Settings",
        },
      ],
    },
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Notify parent component when mobile sidebar state changes
  useEffect(() => {
    if (onMobileOpenChange) {
      onMobileOpenChange(isMobileOpen);
    }
  }, [isMobileOpen, onMobileOpenChange]);

  const handleMobileClose = () => {
    setIsMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full ">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
      
            <img src={Logo} alt="Digital Khata" className="w-12 h-12" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                Digital Khata
              </h1>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="hidden lg:flex"
          >
            <Icon name="PanelLeftClose" size={16} />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4  space-y-6">
        {navigationSections?.map((section) => (
          <div key={section?.title}>
            {!isCollapsed && (
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                {section?.title}
              </h3>
            )}
            <div className="space-y-1">
              {section?.items?.map((item) => {
                const isActive = location?.pathname === item?.path;
                return (
                  <Button 
                    key={item?.path}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={`w-full justify-start ${isCollapsed ? "px-2" : "px-3"}`}
                    onClick={() => {
                      window.location.href = item?.path;
                      handleMobileClose();
                    }}
                  >
                    <Icon
                      name={item?.icon}
                      size={20}
                      className="flex-shrink-0"
                    />
                    {!isCollapsed && (
                      <span className="ml-3 truncate">{item?.label}</span>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer - Sync Status */}
      <div className="p-4 border-t border-border">
        <div
          className={`flex items-center ${isCollapsed ? "justify-center" : "space-x-3"} p-2 rounded-lg bg-muted`}
        >
          <Icon
            name={getSyncStatusIcon()}
            size={16}
            className={`${getSyncStatusColor()} ${syncStatus === "syncing" ? "animate-spin" : ""} flex-shrink-0`}
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground capitalize">
                {syncStatus}
              </p>
              <p className="text-xs text-muted-foreground">
                {syncStatus === "online" && "All data synchronized"}
                {syncStatus === "syncing" && "Synchronizing data..."}
                {syncStatus === "offline" && "Working offline"}
              </p>
            </div>
          )}
        </div>

        {isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="w-full mt-2 hidden lg:flex "
          >
            <Icon name="PanelLeftOpen" size={16} />
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:z-100 lg:flex-col lg:bg-card lg:border-r lg:border-border transition-all duration-300 ${
          isCollapsed ? "lg:w-20" : "lg:w-72"
        }`}
      >
        {sidebarContent}
      </aside>
      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-100 lg:hidden"
            onClick={handleMobileClose}
          />
          <aside className="fixed inset-y-0 left-0 z-200 w-72 bg-card border-r border-border lg:hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 flex items-center justify-center">
                  <img src={Logo} alt="Digital Khata" className="w-12 h-12" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">
                    Digital Khata
                  </h1>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleMobileClose}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">{sidebarContent}</div>
          </aside>
        </>
      )}
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-100 bg-card border-t border-border lg:hidden">
        <div className="flex items-center justify-around py-2">
          {navigationSections?.slice(0, 4)?.map((section) =>
            section?.items?.map((item) => {
              const isActive = location?.pathname === item?.path;
              return (
                <Button
                  key={item?.path}
                  variant="ghost"
                  size="sm"
                  className={`flex flex-col items-center space-y-1 min-w-0 flex-1 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => (window.location.href = item?.path)}
                >
                  <Icon name={item?.icon} size={20} />
                  <span className="text-xs truncate">
                    {item?.label?.split(" ")?.[0]}
                  </span>
                </Button>
              );
            }),
          )}
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 text-muted-foreground"
            onClick={() => setIsMobileOpen(true)}
          >
            <Icon name="Menu" size={20} />
            <span className="text-xs">More</span>
          </Button>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;