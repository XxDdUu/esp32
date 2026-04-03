export const getStatus = (lastSeen?: number) => {
  if (!lastSeen) return "offline";

  const diff = Date.now() - lastSeen;

  if (diff < 10000) return "online";
  if (diff < 60000) return "idle";

  return "offline";
};
