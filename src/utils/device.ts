export const getStatus = (lastSeen?: number) => {
  if (!lastSeen) return "offline";

  const diff = Date.now() - lastSeen * 1000;
  
  if (diff < 10000) return "online";
  if (diff < 60000) return "idle";

  return "offline";
};
export const getStatusColor = (status: string) => {
  switch (status) {
    case "online":
      return "text-green-400";
    case "idle":
      return "text-yellow-400";
    default:
      return "text-red-400";
  }
};

