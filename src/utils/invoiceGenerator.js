export const generateInvoice = (order) => {
  if (!order) return;

  const orderId = order.id || 'AK-ORD-001';
  const invoiceNumber = `INV-${String(orderId).replace(/[^a-zA-Z0-9]/g, '')}`;
  const orderDate = order.date || order.createdAt
    ? new Date(order.date || order.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

  const customerName =
    order.shippingAddress?.fullName ||
    order.shippingAddress?.name ||
    order.customerName ||
    'Valued Customer';
  const customerEmail =
    order.shippingAddress?.email ||
    order.customerEmail ||
    order.userEmail ||
    'customer@akirafresh.com';
  const customerPhone =
    order.shippingAddress?.phone ||
    order.customerPhone ||
    '+91 98765 43210';
  const street = order.shippingAddress?.street || 'Residential Address';
  const city = order.shippingAddress?.city || 'Mumbai';
  const state = order.shippingAddress?.state || 'Maharashtra';
  const pincode = order.shippingAddress?.pincode || '400001';

  const items = Array.isArray(order.items) ? order.items : [];
  const subtotal = Number(order.subtotal || order.total || 0);
  const total = Number(order.total || subtotal);
  const shippingFee = Number(order.shippingFee || (total > 499 ? 0 : 49));
  const discount = Number(order.discount || 0);
  const paymentMethod = order.paymentMethod || 'Razorpay / UPI';
  const paymentStatus = order.paymentStatus || 'Paid (Verified)';

  const itemsRows = items
    .map((item, idx) => {
      const unitPrice = Number(item.price || 0);
      const qty = Number(item.quantity || 1);
      const itemTotal = unitPrice * qty;

      return `
        <tr style="border-bottom: 1px solid #E5E7EB;">
          <td style="padding: 12px 8px; text-align: center; color: #6B7280; font-size: 11px;">${idx + 1}</td>
          <td style="padding: 12px 8px;">
            <div style="font-weight: 600; color: #0E3723; font-size: 12px;">${item.name || 'Organic Fresh Item'}</div>
            <div style="font-size: 10px; color: #9CA3AF; margin-top: 2px;">
              ${item.weight ? `Unit: ${item.weight}` : ''}
              ${item.category ? ` • Category: ${item.category}` : ''}
            </div>
          </td>
          <td style="padding: 12px 8px; text-align: center; font-size: 12px; color: #374151;">${qty}</td>
          <td style="padding: 12px 8px; text-align: right; font-size: 12px; color: #374151;">₹${unitPrice.toLocaleString('en-IN')}</td>
          <td style="padding: 12px 8px; text-align: right; font-weight: 600; font-size: 12px; color: #0E3723;">₹${itemTotal.toLocaleString('en-IN')}</td>
        </tr>
      `;
    })
    .join('');

  const printWindow = window.open('', '_blank', 'width=850,height=950');
  if (!printWindow) {
    alert('Please allow popups to download or print your PDF Tax Invoice.');
    return;
  }

  const invoiceHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Tax Invoice - ${invoiceNumber} - Akira Fresh</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          color: #1F2937;
          background: #FFFFFF;
          padding: 36px 48px;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        @media print {
          body { padding: 20px 30px; }
          .no-print { display: none !important; }
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #84CC16;
          padding-bottom: 20px;
          margin-bottom: 24px;
        }
        .brand {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 700;
          color: #0E3723;
          letter-spacing: 1px;
        }
        .tagline {
          font-size: 10px;
          color: #65A30D;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-top: 2px;
          font-weight: 700;
        }
        .invoice-title {
          text-align: right;
        }
        .invoice-title h1 {
          font-size: 20px;
          font-weight: 700;
          color: #0E3723;
          letter-spacing: 1px;
        }
        .invoice-badge {
          display: inline-block;
          background: #ECFCCB;
          color: #3F6212;
          border: 1px solid #84CC16;
          font-size: 10px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
          margin-top: 4px;
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 24px;
        }
        .detail-block h3 {
          font-size: 11px;
          font-weight: 700;
          color: #6B7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }
        .detail-block p {
          font-size: 12px;
          color: #1F2937;
          line-height: 1.5;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 24px;
        }
        th {
          background: #0E3723;
          color: #F9FAFB;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          padding: 10px 8px;
        }

        .totals-container {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 30px;
        }
        .totals-table {
          width: 280px;
        }
        .totals-table tr td {
          padding: 6px 0;
          font-size: 12px;
        }
        .totals-table .grand-total {
          border-top: 2px solid #0E3723;
          padding-top: 10px;
          font-weight: 700;
          font-size: 15px;
          color: #0E3723;
        }

        .footer {
          border-top: 1px dashed #D1D5DB;
          padding-top: 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 10px;
          color: #6B7280;
        }
        .seal {
          display: inline-block;
          border: 1.5px solid #10B981;
          color: #059669;
          font-weight: 700;
          font-size: 9px;
          padding: 4px 10px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .action-bar {
          background: #0E3723;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .print-btn {
          background: #84CC16;
          color: #0E3723;
          border: none;
          font-weight: 700;
          font-size: 12px;
          padding: 8px 18px;
          border-radius: 6px;
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <div class="action-bar no-print">
        <span>📄 Ready to save or print your official Tax Invoice</span>
        <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
      </div>

      <div class="header">
        <div>
          <div class="brand">AKIRA FRESH</div>
          <div class="tagline">Organic Gourmet • 100% Farm Fresh</div>
          <p style="font-size: 10px; color: #6B7280; margin-top: 4px;">
            Akira Fresh Organics Private Limited<br>
            GSTIN: 27AABCA9876F1Z2 • FSSAI Lic: 11521018000492<br>
            Customer Care: support@akirafresh.com
          </p>
        </div>
        <div class="invoice-title">
          <h1>TAX INVOICE</h1>
          <div class="invoice-badge">ORIGINAL FOR RECIPIENT</div>
          <p style="font-size: 11px; color: #4B5563; margin-top: 6px;">
            <strong>Invoice No:</strong> ${invoiceNumber}<br>
            <strong>Order ID:</strong> #${orderId}<br>
            <strong>Date:</strong> ${orderDate}
          </p>
        </div>
      </div>

      <div class="details-grid">
        <div class="detail-block">
          <h3>Billed & Shipped To</h3>
          <p>
            <strong style="color: #0E3723;">${customerName}</strong><br>
            ${street}<br>
            ${city}, ${state} - ${pincode}<br>
            Phone: ${customerPhone}<br>
            Email: ${customerEmail}
          </p>
        </div>
        <div class="detail-block">
          <h3>Payment & Logistics Details</h3>
          <p>
            <strong>Payment Mode:</strong> ${paymentMethod}<br>
            <strong>Payment Status:</strong> <span style="color: #059669; font-weight: 600;">${paymentStatus}</span><br>
            <strong>Delivery Type:</strong> Express Temperature-Controlled Delivery<br>
            <strong>Place of Supply:</strong> ${state}
          </p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 40px; text-align: center;">#</th>
            <th style="text-align: left;">Item Description</th>
            <th style="width: 60px; text-align: center;">Qty</th>
            <th style="width: 100px; text-align: right;">Unit Price</th>
            <th style="width: 110px; text-align: right;">Total Amount</th>
          </tr>
        </thead>
        <tbody>
          ${
            itemsRows ||
            `<tr><td colspan="5" style="text-align: center; padding: 16px; color: #9CA3AF;">Order Items Summary</td></tr>`
          }
        </tbody>
      </table>

      <div class="totals-container">
        <table class="totals-table">
          <tr>
            <td style="color: #6B7280;">Subtotal:</td>
            <td style="text-align: right; font-weight: 600;">₹${subtotal.toLocaleString('en-IN')}</td>
          </tr>
          ${
            discount > 0
              ? `<tr>
                  <td style="color: #059669;">Promo Discount:</td>
                  <td style="text-align: right; color: #059669; font-weight: 600;">-₹${discount.toLocaleString('en-IN')}</td>
                </tr>`
              : ''
          }
          <tr>
            <td style="color: #6B7280;">Fresh Courier Delivery:</td>
            <td style="text-align: right; font-weight: 600;">${
              shippingFee === 0
                ? '<span style="color: #059669;">FREE</span>'
                : `₹${shippingFee}`
            }</td>
          </tr>
          <tr>
            <td style="color: #9CA3AF; font-size: 10px;">Applicable Taxes (GST 5% Incl.):</td>
            <td style="text-align: right; color: #9CA3AF; font-size: 10px;">₹${Math.round((total * 0.05) / 1.05).toLocaleString('en-IN')}</td>
          </tr>
          <tr class="grand-total">
            <td>Grand Total:</td>
            <td style="text-align: right;">₹${total.toLocaleString('en-IN')}</td>
          </tr>
        </table>
      </div>

      <div class="footer">
        <div>
          <p>Thank you for shopping with Akira Fresh. 100% Organically Certified & Farm Fresh Quality Guaranteed.</p>
          <p style="margin-top: 2px;">This is a computer generated invoice and does not require a physical signature.</p>
        </div>
        <div class="seal">
          ✓ Digitally Verified
        </div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 400);
        };
      <\/script>
    </body>
    </html>
  `;

  printWindow.document.write(invoiceHtml);
  printWindow.document.close();
};
