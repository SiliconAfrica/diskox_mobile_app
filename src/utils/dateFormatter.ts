import { format } from "date-fns";

export const formatDate = (dateString) => {
  if (dateString) {
    return `${format(new Date(dateString), "dd MMM, yyyy")}`;
  }
  return ``;
};
