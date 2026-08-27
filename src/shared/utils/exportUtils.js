/**
 * Data Export Utilities for PDF, CSV, and JSON file downloads
 */

/**
 * Export tasks array to formatted PDF document with StackPulse branding
 */
export async function exportToPDF(todos, customFilename = 'tasks_export', title = 'StackPulse — Task Deliverables Report') {
  if (!todos || todos.length === 0) return false;

  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Metrics Calculation
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const pending = total - completed;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Header Banner Background (#4f46e5 Indigo)
  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, pageWidth, 56, 'F');

  // Brand Name & Tagline
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('StackPulse', 36, 34);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(224, 231, 255);
  doc.text('Enterprise Task & Sprint Management', 140, 34);

  // Date and Time on top right
  const dateStr = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  doc.setFontSize(9);
  doc.text(`Generated: ${dateStr}`, pageWidth - 36, 34, { align: 'right' });

  // Subtitle / Report Info Section
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(title, 36, 84);

  // Metric Badges Summary Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(36, 94, pageWidth - 72, 34, 4, 4, 'FD');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  
  // Total
  doc.setTextColor(100, 116, 139);
  doc.text('TOTAL TASKS:', 50, 115);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10.5);
  doc.text(`${total}`, 125, 115);

  // Completed
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('DELIVERED / DONE:', 200, 115);
  doc.setTextColor(22, 163, 74);
  doc.setFontSize(10.5);
  doc.text(`${completed}`, 315, 115);

  // Pending
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('IN PROGRESS:', 395, 115);
  doc.setTextColor(217, 119, 6);
  doc.setFontSize(10.5);
  doc.text(`${pending}`, 475, 115);

  // Velocity
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('SPRINT VELOCITY:', 555, 115);
  doc.setTextColor(79, 70, 229);
  doc.setFontSize(10.5);
  doc.text(`${rate}%`, 660, 115);

  // Prepare table data
  const tableHeaders = [
    ['ID', 'Task Deliverable / Title', 'Category', 'Priority', 'Assignee', 'Status', 'Due Date'],
  ];

  const tableRows = todos.map((t) => [
    `#${t.id}`,
    t.title || 'Untitled Deliverable',
    t.category || 'General',
    (t.priority || 'medium').toUpperCase(),
    t.assignedUser?.name || `User ${t.userId || 1}`,
    t.completed ? 'COMPLETED' : 'IN PROGRESS',
    t.dueDate || 'No Due Date',
  ]);

  autoTable(doc, {
    head: tableHeaders,
    body: tableRows,
    startY: 140,
    margin: { left: 36, right: 36, bottom: 40 },
    theme: 'striped',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      cellPadding: 6,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [51, 65, 85],
      cellPadding: 5.5,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 40, fontStyle: 'bold', textColor: [100, 116, 139] },
      1: { cellWidth: 'auto', fontStyle: 'bold' },
      2: { cellWidth: 75 },
      3: { cellWidth: 65, fontStyle: 'bold' },
      4: { cellWidth: 95 },
      5: { cellWidth: 80, fontStyle: 'bold' },
      6: { cellWidth: 75 },
    },
    didParseCell: (data) => {
      // Color-code Priority column
      if (data.section === 'body' && data.column.index === 3) {
        const val = data.cell.raw;
        if (val === 'URGENT') data.cell.styles.textColor = [220, 38, 38];
        else if (val === 'HIGH') data.cell.styles.textColor = [217, 119, 6];
        else if (val === 'MEDIUM') data.cell.styles.textColor = [37, 99, 235];
        else if (val === 'LOW') data.cell.styles.textColor = [100, 116, 139];
      }
      // Color-code Status column
      if (data.section === 'body' && data.column.index === 5) {
        const val = data.cell.raw;
        if (val === 'COMPLETED') data.cell.styles.textColor = [22, 163, 74];
        else data.cell.styles.textColor = [217, 119, 6];
      }
    },
    didDrawPage: (data) => {
      // Page Footer
      const totalPages = doc.getNumberOfPages();
      const str = `StackPulse Enterprise • Confidential • Page ${data.pageNumber} of ${totalPages}`;
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.setFont('helvetica', 'normal');
      doc.text(str, pageWidth / 2, pageHeight - 16, { align: 'center' });
    },
  });

  // Save PDF file
  const filename = `${customFilename}_${getFormattedTimestamp()}.pdf`;
  doc.save(filename);
  return true;
}

/**
 * Export tasks array to JSON file
 */
export function exportToJSON(todos, customFilename = 'tasks_export') {
  if (!todos || todos.length === 0) return false;

  const dataStr = JSON.stringify(todos, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8;' });
  triggerDownload(blob, `${customFilename}_${getFormattedTimestamp()}.json`);
  return true;
}

/**
 * Export tasks array to CSV file
 */
export function exportToCSV(todos, customFilename = 'tasks_export') {
  if (!todos || todos.length === 0) return false;

  const headers = ['ID', 'Title', 'Status', 'Priority', 'Category', 'Due Date', 'Assigned User', 'Assigned User ID', 'Created At'];
  
  const rows = todos.map((t) => [
    t.id,
    `"${(t.title || '').replace(/"/g, '""')}"`,
    t.completed ? 'Completed' : 'Pending',
    t.priority || 'medium',
    `"${(t.category || 'General').replace(/"/g, '""')}"`,
    t.dueDate || 'N/A',
    `"${(t.assignedUser?.name || `User ${t.userId || 1}`).replace(/"/g, '""')}"`,
    t.userId || 1,
    t.createdAt || 'N/A',
  ]);

  const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, `${customFilename}_${getFormattedTimestamp()}.csv`);
  return true;
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function getFormattedTimestamp() {
  const now = new Date();
  return now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
}
