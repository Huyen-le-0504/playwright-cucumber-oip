// src/constants/statusColors.ts

export const StatusColor = {
    Green: "bg-[#D4F4EC]",
    Yellow: "bg-[#FFEECC]",
    Red: "bg-[#FDDDD3]",
    Blue: "rgb(0, 86, 184)",
} as const;

export const StatusName = {
    [StatusColor.Green]: "Passing",
    [StatusColor.Yellow]: "Degraded",
    [StatusColor.Red]: "Failed",
    [StatusColor.Blue]: "The correct filter was selected",
} as const;
