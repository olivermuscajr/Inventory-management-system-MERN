import { reportAPI } from './api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Export to CSV
export const exportToCSV = async (filename = 'inventory-report') => {
    try {
        const response = await reportAPI.getInventoryReport();
        const report = response.data;
        
        // Create CSV content
        let csvContent = 'Inventory Report\n';
        csvContent += `Generated: ${new Date(report.generatedAt).toLocaleString()}\n\n`;
        csvContent += `Total Products: ${report.totalProducts}\n`;
        csvContent += `Total Value: $${report.totalValue.toFixed(2)}\n`;
        csvContent += `Low Stock Items: ${report.lowStockItems}\n`;
        csvContent += `Out of Stock Items: ${report.outOfStockItems}\n\n`;
        
        csvContent += 'Product Details\n';
        csvContent += 'Name,SKU,Category,Price,Quantity,Reorder Level,Status,Value\n';
        
        report.products.forEach(product => {
            csvContent += `"${product.name}","${product.sku}","${product.category}",${product.price},${product.quantity},${product.reorderLevel},"${product.status}",$${product.value}\n`;
        });
        
        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}-${new Date().getTime()}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        return true;
    } catch (error) {
        console.error('Export to CSV failed:', error);
        throw error;
    }
};

// Export to Excel (as CSV with .xls extension)
export const exportToExcel = async (filename = 'inventory-report') => {
    try {
        const response = await reportAPI.getInventoryReport();
        const report = response.data;
        
        // Create Excel content (HTML table that Excel can open)
        let htmlContent = '<table border="1">';
        htmlContent += '<tr><th colspan="7">Inventory Report</th></tr>';
        htmlContent += `<tr><td colspan="7">Generated: ${new Date(report.generatedAt).toLocaleString()}</td></tr>`;
        htmlContent += '<tr><td colspan="7">&nbsp;</td></tr>';
        htmlContent += `<tr><td colspan="3">Total Products: ${report.totalProducts}</td><td colspan="4">Total Value: $${report.totalValue.toFixed(2)}</td></tr>`;
        htmlContent += `<tr><td colspan="3">Low Stock: ${report.lowStockItems}</td><td colspan="4">Out of Stock: ${report.outOfStockItems}</td></tr>`;
        htmlContent += '<tr><td colspan="7">&nbsp;</td></tr>';
        
        htmlContent += '<tr><th>Name</th><th>SKU</th><th>Category</th><th>Price</th><th>Quantity</th><th>Reorder Level</th><th>Status</th><th>Value</th></tr>';
        
        report.products.forEach(product => {
            htmlContent += `<tr>`;
            htmlContent += `<td>${product.name}</td>`;
            htmlContent += `<td>${product.sku}</td>`;
            htmlContent += `<td>${product.category}</td>`;
            htmlContent += `<td>${product.price}</td>`;
            htmlContent += `<td>${product.quantity}</td>`;
            htmlContent += `<td>${product.reorderLevel}</td>`;
            htmlContent += `<td>${product.status}</td>`;
            htmlContent += `<td>$${product.value}</td>`;
            htmlContent += `</tr>`;
        });
        
        htmlContent += '</table>';
        
        // Create blob and download
        const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}-${new Date().getTime()}.xls`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        return true;
    } catch (error) {
        console.error('Export to Excel failed:', error);
        throw error;
    }
};

// Print Report
export const printReport = async () => {
    try {
        const response = await reportAPI.getInventoryReport();
        const report = response.data;
        
        // Create print window
        const printWindow = window.open('', '_blank');
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Inventory Report</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #333; }
                    .header { margin-bottom: 20px; }
                    .stats { display: flex; gap: 20px; margin-bottom: 20px; }
                    .stat-box { padding: 10px; background: #f5f5f5; border-radius: 5px; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { padding: 8px; text-align: left; border: 1px solid #ddd; }
                    th { background-color: #4CAF50; color: white; }
                    tr:nth-child(even) { background-color: #f9f9f9; }
                    .low-stock { color: #ff9800; }
                    .out-of-stock { color: #f44336; }
                    .in-stock { color: #4CAF50; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Inventory Report</h1>
                    <p>Generated: ${new Date(report.generatedAt).toLocaleString()}</p>
                </div>
                
                <div class="stats">
                    <div class="stat-box">
                        <strong>Total Products:</strong> ${report.totalProducts}
                    </div>
                    <div class="stat-box">
                        <strong>Total Value:</strong> $${report.totalValue.toFixed(2)}
                    </div>
                    <div class="stat-box">
                        <strong>Low Stock:</strong> ${report.lowStockItems}
                    </div>
                    <div class="stat-box">
                        <strong>Out of Stock:</strong> ${report.outOfStockItems}
                    </div>
                </div>
                
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>SKU</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Reorder Level</th>
                            <th>Status</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${report.products.map(product => `
                            <tr>
                                <td>${product.name}</td>
                                <td>${product.sku}</td>
                                <td>${product.category}</td>
                                <td>$${product.price}</td>
                                <td>${product.quantity}</td>
                                <td>${product.reorderLevel}</td>
                                <td class="${product.status === 'Low Stock' ? 'low-stock' : product.status === 'Out of Stock' ? 'out-of-stock' : 'in-stock'}">${product.status}</td>
                                <td>$${product.value}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        
        // Wait for content to load, then print
        setTimeout(() => {
            printWindow.print();
        }, 250);
        
        return true;
    } catch (error) {
        console.error('Print failed:', error);
        throw error;
    }
};

// Export to PDF
export const exportToPDF = async () => {
    try {
        const response = await reportAPI.getInventoryReport();
        const report = response.data;
        
        // Create PDF
        const pdf = new jsPDF();
        pdf.setFontSize(18);
        pdf.text('Inventory Report', 14, 22);
        
        pdf.setFontSize(10);
        pdf.text(`Generated: ${new Date(report.generatedAt).toLocaleString()}`, 14, 30);
        pdf.line(14, 35, 196, 35);
        
        // Add summary
        pdf.setFontSize(12);
        pdf.text('Summary', 14, 42);
        
        pdf.setFontSize(10);
        pdf.text(`Total Products: ${report.totalProducts}`, 14, 48);
        pdf.text(`Total Value: $${report.totalValue.toFixed(2)}`, 14, 54);
        pdf.text(`Low Stock Items: ${report.lowStockItems}`, 14, 60);
        pdf.text(`Out of Stock: ${report.outOfStockItems}`, 14, 66);
        
        pdf.line(14, 70, 196, 70);
        
        // Add product table
        pdf.setFontSize(11);
        pdf.text('Product List', 14, 78);
        
        let yPos = 85;
        report.products.slice(0, 20).forEach((product, index) => {
            if (yPos > 270) {
                pdf.addPage();
                yPos = 20;
            }
            
            pdf.setFontSize(8);
            pdf.text(`${index + 1}. ${product.name.substring(0, 30)}`, 14, yPos);
            pdf.text(`   SKU: ${product.sku} | Qty: ${product.quantity} | Price: $${product.price}`, 14, yPos + 6);
            
            yPos += 14;
        });
        
        if (report.products.length > 20) {
            pdf.text(`... and ${report.products.length - 20} more products`, 14, yPos);
        }
        
        pdf.save(`inventory-report-${new Date().getTime()}.pdf`);
        
        return true;
    } catch (error) {
        console.error('Export to PDF failed:', error);
        throw error;
    }
};

