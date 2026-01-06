import React from "react";
import Icon from "../AppIcon";

interface SyncStatusIndicatorProps {
  status?: "online" | "syncing" | "offline";
  showLabel?: boolean;
  size?: "sm" | "default" | "lg";
  className?: string;
}

const SyncStatusIndicator: React.FC<SyncStatusIndicatorProps> = ({
  status = "online",
  showLabel = true,
  size = "default",
  className = "",
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case "online":
        return {
          icon: "Wifi",
          color: "text-success",
          bgColor: "bg-success/10",
          label: "Online",
          description: "All data synchronized",
        };
      case "syncing":
        return {
          icon: "RefreshCw",
          color: "text-warning",
          bgColor: "bg-warning/10",
          label: "Syncing",
          description: "Synchronizing data...",
        };
      case "offline":
        return {
          icon: "WifiOff",
          color: "text-error",
          bgColor: "bg-error/10",
          label: "Offline",
          description: "Working offline",
        };
      default:
        return {
          icon: "Wifi",
          color: "text-muted-foreground",
          bgColor: "bg-muted",
          label: "Unknown",
          description: "Connection status unknown",
        };
    }
  };

  const getSizeConfig = () => {
    switch (size) {
      case "sm":
        return {
          container: "px-2 py-1",
          icon: 12,
          text: "text-xs",
        };
      case "lg":
        return {
          container: "px-4 py-3",
          icon: 20,
          text: "text-sm",
        };
      default:
        return {
          container: "px-3 py-2",
          icon: 16,
          text: "text-sm",
        };
    }
  };

  const statusConfig = getStatusConfig();
  const sizeConfig = getSizeConfig();

  return (
    <div
      className={`inline-flex items-center space-x-2 rounded-lg ${statusConfig?.bgColor} ${sizeConfig?.container} ${className}`}
    >
      <Icon
        name={statusConfig?.icon}
        size={sizeConfig?.icon}
        className={`${statusConfig?.color} ${status === "syncing" ? "animate-spin" : ""} flex-shrink-0`}
      />
      {showLabel && (
        <div className="flex flex-col min-w-0">
          <span
            className={`font-medium ${statusConfig?.color} ${sizeConfig?.text}`}
          >
            {statusConfig?.label}
          </span>
          {size === "lg" && (
            <span className="text-xs text-muted-foreground">
              {statusConfig?.description}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SyncStatusIndicator;
