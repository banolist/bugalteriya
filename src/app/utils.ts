import * as XLSX from "xlsx";
import { writeFile } from "@tauri-apps/plugin-fs";
import { save } from "@tauri-apps/plugin-dialog";
export const exportToXLSX = async (data: any[]) => {
  // Создаем лист и книгу
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Генерируем бинарные данные (Uint8Array)
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // Получаем путь к папке приложения
  //   const filePath = await join(await appDataDir(), filename);
  const filePath = await save({ defaultPath: "export.xlsx" });
  // Сохраняем файл
  if (filePath) {
    await writeFile(filePath, new Uint8Array(excelBuffer));
    console.log(`Файл сохранен в: ${filePath}`);
  }
};
