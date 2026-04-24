export interface GoogleSheetRow {
  [key: string]: string;
}

export const fetchGoogleSheet = async (sheetId: string): Promise<GoogleSheetRow[]> => {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Falha ao buscar dados da planilha');
    
    const csvContent = await response.text();
    const rows = csvContent.split('\n').filter(row => row.trim() !== '');
    
    if (rows.length < 2) return [];

    const headers = rows[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    return rows.slice(1).map(row => {
      // Improved CSV parsing for quoted strings with commas
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < row.length; i++) {
        const char = row[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());

      const obj: GoogleSheetRow = {};
      headers.forEach((header, index) => {
        obj[header] = values[index]?.replace(/^"|"$/g, '') || '';
      });
      return obj;
    });
  } catch (error) {
    console.error('Erro na Planilha Google:', error);
    return [];
  }
};
