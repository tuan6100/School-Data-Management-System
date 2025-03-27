import * as ExcelJS from "exceljs";
import * as process from 'node:process';

export async function exportUserAuthData(users: Array<{ id: number, fullName: string, email: string, password: string }>) {
  const excelFilePath = `${process.env.EXCEL_FILE_PATH}`;
  let workbook = new ExcelJS.Workbook();
  let worksheet: ExcelJS.Worksheet;
  try{
    worksheet = workbook.addWorksheet("Users");
    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Full Name", key: "fullName", width: 30 },
      { header: "Email", key: "email", width: 30 },
      { header: "Password", key: "password", width: 20 }
    ];
    users.forEach(user => worksheet.addRow(user));
    await workbook.xlsx.writeFile(excelFilePath);
  } catch (e) {
    console.error(e)
  }
}

export async function updateUserInExcel(id: number, fullName: string, email: string) {
  const excelFilePath = `${process.env.EXCEL_FILE_PATH}`;
  let workbook = new ExcelJS.Workbook();
  try {
    await workbook.xlsx.readFile(excelFilePath);
    let worksheet = workbook.getWorksheet("Users");
    if (!worksheet) {
      console.log("Worksheet not found")
      worksheet = workbook.addWorksheet("Users");
      worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Full Name", key: "fullName", width: 30 },
        { header: "Email", key: "email", width: 30 },
      ];
    }
    let userRow: ExcelJS.Row | undefined;
    worksheet.eachRow((row, rowIndex) => {
      if (rowIndex > 1) {
        const rowId = row.getCell(1).value;
        if (rowId === id) {
          userRow = row;
        }
      }
    });
    if (userRow) {
      userRow.getCell(2).value = fullName;
      userRow.getCell(3).value = email;
    } else {
      const newRow = {
        id: id,
        fullName: fullName,
        email: email,
      };
      worksheet.addRow(newRow);
    }
    await workbook.xlsx.writeFile(excelFilePath);
  } catch (e) {
    console.error(`Error updating Excel file: ${e}`);
  }
}

export async function removeUserFromExcel(id: number) {
  const excelFilePath = `${process.env.EXCEL_FILE_PATH}`;
  let workbook = new ExcelJS.Workbook();
  try {
    await workbook.xlsx.readFile(excelFilePath);
    let worksheet = workbook.getWorksheet("Users");
    if (!worksheet) {
      return;
    }
    let rowToDelete = -1;
    worksheet.eachRow((row, rowIndex) => {
      if (rowIndex > 1) {
        const rowId = row.getCell(1).value;
        console.log("Row: ", rowId)
        if (rowId === id) {
          rowToDelete = rowIndex;
        }
      }
    });
    if (rowToDelete > 0) {
      worksheet.spliceRows(rowToDelete, 1);
      await workbook.xlsx.writeFile(excelFilePath);
    }
  } catch (e) {
    console.error(`Error updating Excel file: ${e}`);
  }
}


