import React, { useEffect, useState } from "react";

const OfflineIndicator = () => {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateStatus = () => setOnline(navigator.onLine);
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  if (online) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "linear-gradient(45deg, #ff416c, #ff4b2b)",
        padding: "12px 24px",
        borderRadius: "8px",
        color: "#fff",
        zIndex: 10000,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        fontWeight: "bold",
        fontSize: "16px",
        cursor: "default"
      }}
      title="Offline Mode"
    >
      You are offline. Changes will sync when connection is restored.
    </div>
  );
};

export default OfflineIndicator;