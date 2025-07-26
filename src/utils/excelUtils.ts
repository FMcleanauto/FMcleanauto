import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Part } from '../types/Part';

export function readExcelFile(file: File): Promise<Part[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const allRows: Part[] = [];
        
        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
          
          jsonData.forEach((row: any) => {
            const reference = row['Référence'] || row['reference'] || row['REF'] || "";
            const fr = row['Designation_FR'] || row['designation_fr'] || row['Nom FR'] || "";
            const en = row['Designation_EN'] || row['designation_en'] || row['Nom EN'] || "";
            const image = row['Image'] || row['image'] || "";
            const category = row['Catégorie'] || row['categorie'] || row['Category'] || "";
            const price = row['Prix'] || row['prix'] || row['Price'] || "";
            
            if (reference) {
              let imageUrl = image;
              if (imageUrl.startsWith('="') && imageUrl.endsWith('"')) {
                imageUrl = imageUrl.replace(/^="|"$/g, '');
              }
              
              allRows.push({
                ref: reference.toString().trim(),
                fr: fr.toString().trim(),
                en: en.toString().trim(),
                image: imageUrl.toString().trim(),
                category: category.toString().trim(),
                price: price.toString().trim()
              });
            }
          });
        });
        
        resolve(allRows);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
    reader.readAsArrayBuffer(file);
  });
}

export function exportToExcel(parts: Part[], filename: string = 'pieces_selectionnees') {
  const exportData = parts.map(part => ({
    'Référence': part.ref,
    'Désignation FR': part.fr,
    'Désignation EN': part.en,
    'Catégorie': part.category || '',
    'Prix': part.price || '',
    'Image': part.image || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  
  // Ajuster la largeur des colonnes
  const colWidths = [
    { wch: 15 }, // Référence
    { wch: 30 }, // Désignation FR
    { wch: 30 }, // Désignation EN
    { wch: 15 }, // Catégorie
    { wch: 10 }, // Prix
    { wch: 20 }  // Image
  ];
  worksheet['!cols'] = colWidths;
  
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Pièces');
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  saveAs(dataBlob, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
}

export async function loadExcelFromUrl(url: string): Promise<Part[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Erreur de réseau');
    
    const data = await response.arrayBuffer();
    const workbook = XLSX.read(data);
    const allRows: Part[] = [];
    
    workbook.SheetNames.forEach(sheet => {
      const worksheet = workbook.Sheets[sheet];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      
      jsonData.forEach((row: any) => {
        const reference = row['Référence'] || row['reference'] || row['REF'] || "";
        const fr = row['Designation_FR'] || row['designation_fr'] || row['Nom FR'] || "";
        const en = row['Designation_EN'] || row['designation_en'] || row['Nom EN'] || "";
        const image = row['Image'] || row['image'] || "";
        const category = row['Catégorie'] || row['categorie'] || row['Category'] || "";
        const price = row['Prix'] || row['prix'] || row['Price'] || "";
        
        if (reference) {
          let imageUrl = image;
          if (imageUrl.startsWith('="') && imageUrl.endsWith('"')) {
            imageUrl = imageUrl.replace(/^="|"$/g, '');
          }
          
          allRows.push({
            ref: reference.toString().trim(),
            fr: fr.toString().trim(),
            en: en.toString().trim(),
            image: imageUrl.toString().trim(),
            category: category.toString().trim(),
            price: price.toString().trim()
          });
        }
      });
    });
    
    return allRows;
  } catch (error) {
    throw new Error(`Erreur lors du chargement: ${error}`);
  }
}