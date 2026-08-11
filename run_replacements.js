const fs = require('fs');
const path = require('path');

const replacements = [
  {
    file: 'frontend/app/checkout/payment/page.tsx',
    search: "`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/payments/create-checkout`",
    replace: "`${process.env.NEXT_PUBLIC_API_URL}/api/payments/create-checkout`"
  },
  {
    file: 'frontend/app/checkout/payment/page.tsx',
    search: "`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/payments/verify-checkout`",
    replace: "`${process.env.NEXT_PUBLIC_API_URL}/api/payments/verify-checkout`"
  },
  {
    file: 'frontend/app/api/products/[id]/bid/route.ts',
    search: "const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';",
    replace: "const API_BASE = process.env.NEXT_PUBLIC_API_URL;"
  },
  {
    file: 'frontend/app/orders/page.tsx',
    search: "const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'",
    replace: "const API_BASE = process.env.NEXT_PUBLIC_API_URL"
  },
  {
    file: 'frontend/store/authStore.ts',
    search: "const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'",
    replace: "const API_BASE = process.env.NEXT_PUBLIC_API_URL"
  },
  {
    file: 'frontend/components/dashboard/buyer-disputes.tsx',
    search: "`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/disputes`",
    replace: "`${process.env.NEXT_PUBLIC_API_URL}/api/disputes`"
  },
  {
    file: 'frontend/components/dashboard/buyer-orders.tsx',
    search: "`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/orders?role=buyer`",
    replace: "`${process.env.NEXT_PUBLIC_API_URL}/api/orders?role=buyer`"
  },
  {
    file: 'frontend/components/dashboard/seller-orders.tsx',
    search: "`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/orders?role=seller`",
    replace: "`${process.env.NEXT_PUBLIC_API_URL}/api/orders?role=seller`"
  },
  {
    file: 'frontend/components/dashboard/seller-orders.tsx',
    search: "`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/shipments/${shippingOrderId}/tracking`",
    replace: "`${process.env.NEXT_PUBLIC_API_URL}/api/shipments/${shippingOrderId}/tracking`"
  },
  {
    file: 'frontend/components/dashboard/seller-payouts.tsx',
    search: "`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/orders?role=seller`",
    replace: "`${process.env.NEXT_PUBLIC_API_URL}/api/orders?role=seller`"
  },
  {
    file: 'frontend/components/listing-qa.tsx',
    search: "`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/qa/listing/${listingId}`",
    replace: "`${process.env.NEXT_PUBLIC_API_URL}/api/qa/listing/${listingId}`"
  },
  {
    file: 'frontend/components/listing-qa.tsx',
    search: "`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/qa/ask`",
    replace: "`${process.env.NEXT_PUBLIC_API_URL}/api/qa/ask`"
  },
  {
    file: 'frontend/components/listing-qa.tsx',
    search: "`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/qa/${qId}/answer`",
    replace: "`${process.env.NEXT_PUBLIC_API_URL}/api/qa/${qId}/answer`"
  },
  {
    file: 'frontend/components/notification-bell.tsx',
    search: "`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/notifications`",
    replace: "`${process.env.NEXT_PUBLIC_API_URL}/api/notifications`"
  },
  {
    file: 'frontend/components/notification-bell.tsx',
    search: "`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/notifications/${id}/read`",
    replace: "`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${id}/read`"
  },
  {
    file: 'frontend/components/notification-bell.tsx',
    search: "`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/notifications/read-all`",
    replace: "`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/read-all`"
  },
  {
    file: 'frontend/lib/store.ts',
    search: "const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'",
    replace: "const API_BASE = process.env.NEXT_PUBLIC_API_URL"
  },
  {
    file: 'frontend/lib/useSocket.ts',
    search: "const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';",
    replace: "const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';"
  },
  {
    file: 'frontend/components/SocketProvider.tsx',
    search: "const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';",
    replace: "const API_URL = process.env.NEXT_PUBLIC_API_URL || '';"
  },
  {
    file: 'frontend/components/upload/guided-upload.tsx',
    search: "const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'",
    replace: "const apiUrl = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : ''"
  },
  {
    file: 'frontend/components/CloudinaryImage.tsx',
    search: "const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';",
    replace: "const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';"
  }
];

for (const rep of replacements) {
  const p = path.join(__dirname, rep.file);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    if (content.includes(rep.search)) {
      content = content.replace(rep.search, rep.replace);
      fs.writeFileSync(p, content);
      console.log(`Updated ${rep.file}`);
    } else {
      console.log(`String not found in ${rep.file}: ${rep.search}`);
    }
  } else {
    console.log(`File not found: ${rep.file}`);
  }
}
