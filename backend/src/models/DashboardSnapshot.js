const mongoose = require("mongoose");

const metricSchema = new mongoose.Schema(
  {
    value: {
      type: Number,
      required: true
    },
    change: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

const topProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    unitsSold: {
      type: Number,
      required: true
    },
    revenue: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

const categorySalesSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

const revenueTrendSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true
    },
    revenue: {
      type: Number,
      required: true
    },
    orders: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

const orderStatusSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

const recentOrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true
    },
    customer: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    payment: {
      type: String,
      required: true
    },
    placedAt: {
      type: String,
      required: true
    }
  },
  { _id: false }
);

const funnelSchema = new mongoose.Schema(
  {
    visitors: {
      type: Number,
      required: true
    },
    productViews: {
      type: Number,
      required: true
    },
    addToCart: {
      type: Number,
      required: true
    },
    checkout: {
      type: Number,
      required: true
    },
    purchased: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

const dashboardSnapshotSchema = new mongoose.Schema(
  {
    period: {
      type: String,
      required: true,
      enum: ["today", "week", "month"],
      unique: true,
      index: true
    },
    summary: {
      totalOrders: {
        type: metricSchema,
        required: true
      },
      totalRevenue: {
        type: metricSchema,
        required: true
      },
      newCustomers: {
        type: metricSchema,
        required: true
      },
      avgOrderValue: {
        type: metricSchema,
        required: true
      }
    },
    topProducts: {
      type: [topProductSchema],
      default: []
    },
    categorySales: {
      type: [categorySalesSchema],
      default: []
    },
    revenueTrend: {
      type: [revenueTrendSchema],
      default: []
    },
    ordersByStatus: {
      type: [orderStatusSchema],
      default: []
    },
    recentOrders: {
      type: [recentOrderSchema],
      default: []
    },
    funnel: {
      type: funnelSchema,
      required: true
    },
    generatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("DashboardSnapshot", dashboardSnapshotSchema);
