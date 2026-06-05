const defaultDashboardData = {
  today: {
    summary: {
      totalOrders: { value: 58, change: 14.6 },
      totalRevenue: { value: 187450, change: 11.2 },
      newCustomers: { value: 19, change: 9.4 },
      avgOrderValue: { value: 3232, change: -2.1 }
    },
    topProducts: [
      { name: "Wireless Mouse", unitsSold: 32, revenue: 47968 },
      { name: "Smart Watch", unitsSold: 18, revenue: 42300 },
      { name: "Noise Cancelling Headphones", unitsSold: 11, revenue: 32989 }
    ],
    categorySales: [
      { category: "Electronics", amount: 91200 },
      { category: "Accessories", amount: 45150 },
      { category: "Home & Living", amount: 28700 },
      { category: "Fashion", amount: 22400 }
    ],
    revenueTrend: [
      { label: "09 AM", revenue: 14120, orders: 4 },
      { label: "10 AM", revenue: 21980, orders: 7 },
      { label: "11 AM", revenue: 24660, orders: 8 },
      { label: "12 PM", revenue: 27300, orders: 9 },
      { label: "01 PM", revenue: 19890, orders: 6 },
      { label: "02 PM", revenue: 30960, orders: 10 },
      { label: "03 PM", revenue: 26150, orders: 8 },
      { label: "04 PM", revenue: 22490, orders: 6 }
    ],
    ordersByStatus: [
      { status: "Delivered", count: 31 },
      { status: "In Transit", count: 16 },
      { status: "Processing", count: 7 },
      { status: "Cancelled", count: 4 }
    ],
    recentOrders: [
      { orderId: "ORD-80654", customer: "Aarav Sharma", amount: 3899, status: "Delivered", payment: "UPI", placedAt: "04:12 PM" },
      { orderId: "ORD-80653", customer: "Nidhi Verma", amount: 1299, status: "In Transit", payment: "Card", placedAt: "04:01 PM" },
      { orderId: "ORD-80652", customer: "Harshit Singh", amount: 7499, status: "Processing", payment: "UPI", placedAt: "03:55 PM" },
      { orderId: "ORD-80651", customer: "Ritika Malhotra", amount: 2599, status: "Delivered", payment: "Net Banking", placedAt: "03:39 PM" },
      { orderId: "ORD-80650", customer: "Anvi Gupta", amount: 999, status: "Cancelled", payment: "Card", placedAt: "03:26 PM" }
    ],
    funnel: {
      visitors: 2450,
      productViews: 1740,
      addToCart: 498,
      checkout: 172,
      purchased: 58
    }
  },
  week: {
    summary: {
      totalOrders: { value: 364, change: 18.7 },
      totalRevenue: { value: 1098420, change: 13.9 },
      newCustomers: { value: 128, change: 10.5 },
      avgOrderValue: { value: 3018, change: -1.4 }
    },
    topProducts: [
      { name: "Wireless Mouse", unitsSold: 156, revenue: 233844 },
      { name: "Smart Watch", unitsSold: 121, revenue: 284350 },
      { name: "Bluetooth Speaker", unitsSold: 104, revenue: 175760 }
    ],
    categorySales: [
      { category: "Electronics", amount: 498000 },
      { category: "Accessories", amount: 242600 },
      { category: "Home & Living", amount: 182400 },
      { category: "Fashion", amount: 175420 }
    ],
    revenueTrend: [
      { label: "Mon", revenue: 121450, orders: 42 },
      { label: "Tue", revenue: 149380, orders: 51 },
      { label: "Wed", revenue: 133790, orders: 44 },
      { label: "Thu", revenue: 167420, orders: 56 },
      { label: "Fri", revenue: 178210, orders: 59 },
      { label: "Sat", revenue: 197560, orders: 64 },
      { label: "Sun", revenue: 150610, orders: 48 }
    ],
    ordersByStatus: [
      { status: "Delivered", count: 214 },
      { status: "In Transit", count: 89 },
      { status: "Processing", count: 44 },
      { status: "Cancelled", count: 17 }
    ],
    recentOrders: [
      { orderId: "ORD-80654", customer: "Aarav Sharma", amount: 3899, status: "Delivered", payment: "UPI", placedAt: "Today" },
      { orderId: "ORD-80631", customer: "Kunal Mehta", amount: 4599, status: "In Transit", payment: "Card", placedAt: "Today" },
      { orderId: "ORD-80603", customer: "Sneha Agarwal", amount: 1799, status: "Processing", payment: "Wallet", placedAt: "Yesterday" },
      { orderId: "ORD-80591", customer: "Prerna Kaul", amount: 8999, status: "Delivered", payment: "UPI", placedAt: "Yesterday" },
      { orderId: "ORD-80580", customer: "Mihir Anand", amount: 2799, status: "Cancelled", payment: "Card", placedAt: "2 days ago" }
    ],
    funnel: {
      visitors: 16800,
      productViews: 12950,
      addToCart: 3920,
      checkout: 972,
      purchased: 364
    }
  },
  month: {
    summary: {
      totalOrders: { value: 1492, change: 23.8 },
      totalRevenue: { value: 4512760, change: 19.4 },
      newCustomers: { value: 412, change: 16.1 },
      avgOrderValue: { value: 3025, change: -0.8 }
    },
    topProducts: [
      { name: "Wireless Mouse", unitsSold: 548, revenue: 821452 },
      { name: "Smart Watch", unitsSold: 503, revenue: 1182050 },
      { name: "Bluetooth Speaker", unitsSold: 441, revenue: 744290 }
    ],
    categorySales: [
      { category: "Electronics", amount: 2124860 },
      { category: "Accessories", amount: 953250 },
      { category: "Home & Living", amount: 732940 },
      { category: "Fashion", amount: 701710 }
    ],
    revenueTrend: [
      { label: "Week 1", revenue: 968420, orders: 321 },
      { label: "Week 2", revenue: 1043810, orders: 348 },
      { label: "Week 3", revenue: 1182540, orders: 391 },
      { label: "Week 4", revenue: 1317990, orders: 432 }
    ],
    ordersByStatus: [
      { status: "Delivered", count: 1014 },
      { status: "In Transit", count: 271 },
      { status: "Processing", count: 146 },
      { status: "Cancelled", count: 61 }
    ],
    recentOrders: [
      { orderId: "ORD-80654", customer: "Aarav Sharma", amount: 3899, status: "Delivered", payment: "UPI", placedAt: "Today" },
      { orderId: "ORD-80644", customer: "Ishita Rao", amount: 2699, status: "In Transit", payment: "Card", placedAt: "Today" },
      { orderId: "ORD-80632", customer: "Dev Patel", amount: 7999, status: "Delivered", payment: "UPI", placedAt: "Yesterday" },
      { orderId: "ORD-80621", customer: "Krish Nair", amount: 1499, status: "Processing", payment: "Net Banking", placedAt: "Yesterday" },
      { orderId: "ORD-80608", customer: "Tanya Sethi", amount: 2199, status: "Delivered", payment: "Wallet", placedAt: "2 days ago" }
    ],
    funnel: {
      visitors: 75200,
      productViews: 58230,
      addToCart: 17340,
      checkout: 4970,
      purchased: 1492
    }
  }
};

module.exports = defaultDashboardData;
