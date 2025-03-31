import dayjs from "dayjs";

export function displayTime(info: string) {
  return dayjs(info).format("lll");
}

export const displayPrice = (info: any) => `₽${info.getValue().toFixed(2)}`;
