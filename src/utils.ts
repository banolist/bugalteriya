import dayjs from "dayjs";

export function displayTime(info: any) {
  return dayjs(info === "" ? info : undefined).format("lll");
}

export const displayPrice = (info: any) => `₽${info.getValue().toFixed(2)}`;
