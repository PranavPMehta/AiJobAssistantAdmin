export const formatCreatedAt = (createdAt: string | number[] | null | undefined) => {
  if (!createdAt) return "-";

  const date = Array.isArray(createdAt)
    ? new Date(
        createdAt[0],
        createdAt[1] - 1,
        createdAt[2],
        createdAt[3] || 0,
        createdAt[4] || 0,
        createdAt[5] || 0
      )
    : new Date(createdAt);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const matchesDateFilter = (
  createdAt: string | number[] | null | undefined,
  dateFilter: string
) => {
  if (!dateFilter) return true;
  if (!createdAt) return false;

  const date = Array.isArray(createdAt)
    ? new Date(createdAt[0], createdAt[1] - 1, createdAt[2])
    : new Date(createdAt);

  if (Number.isNaN(date.getTime())) return false;

  const formatted =
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0");

  return formatted === dateFilter;
};
