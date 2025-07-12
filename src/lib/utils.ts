import { ToastOptions } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getQueryString = (data: any) => {
  const keyData = Object.keys(data);
  var paramData = "";
  keyData.map((value, index) => {
    if (index == 0) {
      paramData = `${paramData}${value}=${data[value]}`;
    } else {
      paramData = `${paramData}&${value}=${data[value]}`;
    }
  });
  return paramData;
};


export const showToast = ({
  title,
  description = "",
  type = "success",
}: ToastOptions) => {
  const styleMap = {
    success: {
      backgroundColor: "#DCFCE7",
      color: "#166534",
    },
    error: {
      backgroundColor: "#FEE2E2",
      color: "#991B1B",
    },
    warning: {
      backgroundColor: "#FFEDD5",
      color: "#9A3412",
    },
  };

  const { backgroundColor, color } = styleMap[type];

  toast(title, {
    description,
    style: { backgroundColor, color },
  });
};
