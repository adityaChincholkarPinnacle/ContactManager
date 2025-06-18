import { Contact } from '../types';

/**
 * Exports contacts to a CSV file and triggers download
 * @param contacts Array of contacts to export
 * @param filename Base name for the exported file (without extension)
 */
export const exportToCSV = (contacts: Contact[], filename: string): void => {
  const csvContent = contactsToCSV(contacts);
  if (csvContent) {
    downloadCSV(csvContent, filename);
  }
};

/**
 * Converts an array of contacts to a CSV string
 * @param contacts Array of contacts to export
 * @returns CSV string
 */
const contactsToCSV = (contacts: Contact[]): string => {
  if (contacts.length === 0) return '';

  // Define CSV headers
  const headers = ['Name', 'Email', 'Phone', 'Favourite'];
  
  // Convert each contact to a CSV row
  const rows = contacts.map(contact => {
    // Escape fields that might contain commas or quotes
    const escape = (field: string | boolean): string => {
      const str = String(field);
      // If the field contains commas, quotes, or newlines, wrap it in quotes
      if (/[,"\n]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    return [
      escape(contact.name),
      escape(contact.email),
      escape(contact.phone),
      escape(contact.favourite)
    ].join(',');
  });

  // Combine headers and rows
  return [headers.join(','), ...rows].join('\n');
};

/**
 * Triggers download of a CSV file
 * @param csvContent CSV string content
 * @param filename Name of the file (without extension)
 */
const downloadCSV = (csvContent: string, filename: string): void => {
  if (!csvContent) return;

  // Create a Blob with the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create a download link and trigger download
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
