import * as XLSX from 'xlsx';

export const readJobTitles = async () => {
  try {
    const response = await fetch('/src/assets/job_title_list.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    return data.flat().filter(Boolean); // Flatten the array and remove empty values
  } catch (error) {
    console.error('Error reading job titles:', error);
    return [];
  }
};