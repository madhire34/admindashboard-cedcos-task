import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const TOKEN_KEY = "shopadmin_token";
const USER_KEY = "shopadmin_user";

const periodOptions = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" }
];

const periodLabels = { today: "Today", week: "This week", month: "This month" };

const navItems = [
  { id: "overview", label: "Overview", icon: GridIcon },
  { id: "revenue", label: "Revenue", icon: ChartIcon },
  { id: "products", label: "Products", icon: BoxIcon },
  { id: "orders", label: "Orders", icon: BagIcon }
];

const trendMetricByKey = {
  totalOrders: "orders",
  totalRevenue: "revenue",
  newCustomers: null,
  avgOrderValue: null
};

function GridIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.6" />
    </svg>
  );
}

function ChartIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M4 19V5" strokeLinecap="round" />
      <path d="M4 19h16" strokeLinecap="round" />
      <path d="M7.5 15.5l4-5 3 3 4.5-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BoxIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" strokeLinejoin="round" />
      <path d="M4 7.5l8 4.5 8-4.5M12 12v9" strokeLinejoin="round" />
    </svg>
  );
}

function BagIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M5 8h14l-1.2 12H6.2L5 8z" strokeLinejoin="round" />
      <path d="M9 8V6a3 3 0 016 0v2" strokeLinecap="round" />
    </svg>
  );
}

function LogOutIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M15 4h3.5A1.5 1.5 0 0120 5.5v13a1.5 1.5 0 01-1.5 1.5H15" strokeLinecap="round" />
      <path d="M10 8l-4 4 4 4M6 12h10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RefreshIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M20 12a8 8 0 11-2.3-5.6" strokeLinecap="round" />
      <path d="M20 4v5h-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowUpRight(props) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M4 12L12 4M6 4h6v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function statusSlug(status) {
  return `is-${String(status).toLowerCase().replace(/[^a-z]+/g, "-")}`;
}

function SparkMark() {
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true" className="spark-mark">
      <path
        d="M14 1.5v25M1.5 14h25M5.5 5.5l17 17M22.5 5.5l-17 17"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RevenueChart({ points, currency, compact }) {
  if (!points.length) return null;

  const width = 760;
  const height = 260;
  const pad = { top: 18, right: 18, bottom: 38, left: 58 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;
  const max = Math.max(...points.map((point) => point.revenue)) || 1;
  const min = Math.min(...points.map((point) => point.revenue));
  const baseline = Math.max(0, min - (max - min) * 1.6);
  const span = max - baseline || 1;

  const x = (index) =>
    pad.left + (points.length === 1 ? chartW / 2 : (index * chartW) / (points.length - 1));
  const y = (value) => pad.top + (1 - (value - baseline) / span) * chartH;

  const line = points.map((point, index) => `${index === 0 ? "M" : "L"}${x(index)},${y(point.revenue)}`).join(" ");
  const area = `${line} L${x(points.length - 1)},${pad.top + chartH} L${x(0)},${pad.top + chartH} Z`;

  const ticks = [1, 0.75, 0.5, 0.25, 0].map((ratio) => baseline + span * ratio);
  const peakIndex = points.reduce(
    (best, point, index) => (point.revenue > points[best].revenue ? index : best),
    0
  );

  return (
    <svg
      className="revenue-chart"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Revenue trend chart"
    >
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9f558" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#c9f558" stopOpacity="0" />
        </linearGradient>
      </defs>

      {ticks.map((tick) => (
        <g key={tick}>
          <line
            x1={pad.left}
            x2={width - pad.right}
            y1={y(tick)}
            y2={y(tick)}
            className="chart-gridline"
          />
          <text x={pad.left - 12} y={y(tick) + 3.5} className="chart-axis" textAnchor="end">
            {compact.format(tick)}
          </text>
        </g>
      ))}

      <path d={area} fill="url(#areaFill)" />
      <path d={line} className="chart-line" />

      {points.map((point, index) => (
        <g key={point.label}>
          <circle
            cx={x(index)}
            cy={y(point.revenue)}
            r={index === peakIndex ? 5.2 : 3.6}
            className={index === peakIndex ? "chart-dot chart-dot-peak" : "chart-dot"}
          >
            <title>{`${point.label}: ${currency.format(point.revenue)} · ${point.orders} orders`}</title>
          </circle>
          <text x={x(index)} y={height - 12} className="chart-axis" textAnchor="middle">
            {point.label}
          </text>
        </g>
      ))}

      <text
        x={x(peakIndex)}
        y={y(points[peakIndex].revenue) - 14}
        className="chart-peak-label"
        textAnchor="middle"
      >
        peak {compact.format(points[peakIndex].revenue)}
      </text>
    </svg>
  );
}

function CategoryDonut({ items, currency, total }) {
  const palette = ["#c9f558", "#7ab8ff", "#f5c451", "#ff7a6b", "#b998ff"];
  const sum = items.reduce((acc, item) => acc + item.amount, 0) || 1;

  let cursor = 0;
  const segments = items.map((item, index) => {
    const start = cursor;
    cursor += (item.amount / sum) * 100;
    return `${palette[index % palette.length]} ${start}% ${cursor}%`;
  });

  return (
    <div className="donut-layout">
      <div
        className="donut"
        style={{ background: `conic-gradient(${segments.join(", ")})` }}
        role="img"
        aria-label="Revenue split by category"
      >
        <div className="donut-hole">
          <span className="donut-caption">Total</span>
          <strong>{currency.format(total)}</strong>
        </div>
      </div>

      <ul className="donut-legend">
        {items.map((item, index) => (
          <li key={item.category}>
            <span
              className="legend-dot"
              style={{ background: palette[index % palette.length] }}
            />
            <span className="legend-name">{item.category}</span>
            <span className="legend-percent">{Math.round((item.amount / sum) * 100)}%</span>
            <span className="legend-amount">{currency.format(item.amount)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="dashboard-page skeleton-page" aria-busy="true" aria-label="Loading dashboard">
      <div className="skeleton skeleton-title" />
      <div className="skeleton-row">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="skeleton skeleton-kpi" key={index} />
        ))}
      </div>
      <div className="skeleton-row skeleton-row-split">
        <div className="skeleton skeleton-panel" />
        <div className="skeleton skeleton-panel" />
      </div>
    </div>
  );
}

function App() {
  const [period, setPeriod] = useState("month");
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(USER_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [dashboardData, setDashboardData] = useState(null);
  const [authLoading, setAuthLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState("");
  const [loginForm, setLoginForm] = useState({
    email: "admin@shopadmin.com",
    password: "Admin@123"
  });

  const currency = useMemo(
    () =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
      }),
    []
  );

  const compact = useMemo(
    () =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        notation: "compact",
        maximumFractionDigits: 1
      }),
    []
  );

  const numberFormatter = useMemo(() => new Intl.NumberFormat("en-IN"), []);

  useEffect(() => {
    let active = true;

    async function verifySession() {
      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error("Session expired");
        }

        const payload = await response.json();
        if (active) {
          setUser(payload.user);
          localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
        }
      } catch (_) {
        if (active) {
          clearSession("Session expired. Please log in again.");
        }
      } finally {
        if (active) {
          setAuthLoading(false);
        }
      }
    }

    verifySession();

    return () => {
      active = false;
    };
  }, [token]);

  useEffect(() => {
    let active = true;

    async function fetchDashboard() {
      if (!token || !user) {
        return;
      }

      setDashboardLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_BASE}/dashboard?period=${period}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 401) {
          clearSession("Session expired. Please log in again.");
          return;
        }

        if (!response.ok) {
          throw new Error("Could not load dashboard.");
        }

        const payload = await response.json();
        if (active) {
          setDashboardData(payload);
        }
      } catch (fetchError) {
        if (active) {
          setError(fetchError.message || "Something went wrong");
        }
      } finally {
        if (active) {
          setDashboardLoading(false);
        }
      }
    }

    fetchDashboard();

    return () => {
      active = false;
    };
  }, [token, user, period, refreshKey]);

  function saveSession(nextToken, nextUser) {
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
    setError("");
  }

  function clearSession(nextError = "") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken("");
    setUser(null);
    setDashboardData(null);
    setError(nextError);
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();
    setLoginLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm)
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || "Login failed");
      }

      saveSession(payload.token, payload.user);
    } catch (loginError) {
      setError(loginError.message || "Unable to login");
    } finally {
      setLoginLoading(false);
    }
  }

  if (authLoading) {
    return (
      <div className="boot-screen">
        <div className="boot-mark">
          <SparkMark />
        </div>
        <p className="boot-text">Verifying admin session</p>
      </div>
    );
  }

  if (!token || !user) {
    return (
      <main className="login-page">
        <section className="login-brand">
          <div className="brand-lockup">
            <span className="brand-mark">
              <SparkMark />
            </span>
            <span className="brand-word">
              SHOP<span>/</span>ADMIN
            </span>
          </div>

          <div className="login-headline">
            <p className="eyebrow">Store control room · v2.0</p>
            <h1>
              Run the store
              <br />
              from one screen.
            </h1>
            <p className="login-sub">
              Orders, revenue, category mix and conversion — read the whole day in a single glance.
            </p>
          </div>

          <ul className="login-features">
            <li>
              <span>01</span> Live order pulse across every status
            </li>
            <li>
              <span>02</span> Revenue read by period, category and product
            </li>
            <li>
              <span>03</span> Funnel clarity from visitor to purchase
            </li>
          </ul>

          <div className="login-ticker" aria-hidden="true">
            <span>ORDERS</span>
            <span>·</span>
            <span>REVENUE</span>
            <span>·</span>
            <span>CATEGORY MIX</span>
            <span>·</span>
            <span>CONVERSION</span>
          </div>
        </section>

        <section className="login-panel">
          <div className="login-card">
            <p className="eyebrow">Admin access</p>
            <h2>Sign in to continue</h2>
            <p className="login-card-sub">Use the workspace credentials to open the dashboard.</p>

            <form onSubmit={handleLoginSubmit} className="login-form">
              <label htmlFor="email">Work email</label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                placeholder="you@company.com"
                value={loginForm.email}
                onChange={(event) =>
                  setLoginForm((prev) => ({ ...prev, email: event.target.value }))
                }
                required
              />

              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(event) =>
                  setLoginForm((prev) => ({ ...prev, password: event.target.value }))
                }
                required
              />

              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}

              <button type="submit" className="btn-primary" disabled={loginLoading}>
                {loginLoading ? "Signing in…" : "Enter dashboard"}
                <ArrowUpRight />
              </button>
            </form>

            <div className="demo-hint">
              <div>
                <span className="demo-hint-label">Demo workspace</span>
                <code>admin@shopadmin.com / Admin@123</code>
              </div>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setLoginForm({ email: "admin@shopadmin.com", password: "Admin@123" })}
              >
                Autofill
              </button>
            </div>
          </div>

          <p className="login-foot">Protected workspace · sessions expire after 12 hours</p>
        </section>
      </main>
    );
  }

  if (!dashboardData && dashboardLoading) {
    return <LoadingSkeleton />;
  }

  if (!dashboardData) {
    return (
      <div className="empty-state">
        <section>
          <p className="eyebrow">Connection issue</p>
          <h1>Dashboard data unavailable.</h1>
          <p>The API did not return a snapshot for this period.</p>
          <div className="empty-actions">
            <button type="button" className="btn-primary" onClick={() => setRefreshKey((key) => key + 1)}>
              Try again
            </button>
            <button type="button" className="btn-ghost" onClick={() => clearSession()}>
              Sign out
            </button>
          </div>
        </section>
      </div>
    );
  }

  const maxCategoryAmount = Math.max(...dashboardData.categorySales.map((item) => item.amount));
  const maxProductRevenue = Math.max(...dashboardData.topProducts.map((product) => product.revenue));
  const statusTotal = dashboardData.ordersByStatus.reduce((acc, item) => acc + item.count, 0) || 1;
  const funnel = dashboardData.funnel;
  const funnelStages = [
    { label: "Visitors", value: funnel.visitors },
    { label: "Product views", value: funnel.productViews },
    { label: "Add to cart", value: funnel.addToCart },
    { label: "Checkout", value: funnel.checkout },
    { label: "Purchased", value: funnel.purchased }
  ];
  const overallCvr = (funnel.purchased / funnel.visitors) * 100;

  const metricConfig = [
    { key: "totalOrders", label: "Orders", index: "01", metric: trendMetricByKey.totalOrders },
    { key: "totalRevenue", label: "Revenue", index: "02", metric: trendMetricByKey.totalRevenue },
    { key: "newCustomers", label: "New customers", index: "03", metric: null },
    { key: "avgOrderValue", label: "Avg order value", index: "04", metric: null }
  ];

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const updatedAt = new Date(dashboardData.generatedAt);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="sidebar-brand" href="#overview">
          <span className="brand-mark">
            <SparkMark />
          </span>
          <span className="brand-word">
            SHOP<span>/</span>ADMIN
          </span>
        </a>

        <p className="sidebar-label">Workspace</p>
        <nav className="sidebar-nav" aria-label="Dashboard sections">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a key={item.id} href={`#${item.id}`} className={item.id === "overview" ? "is-active" : ""}>
                <Icon />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="sidebar-card">
          <div className="sidebar-card-head">
            <span className="live-dot" />
            <span>Live data</span>
          </div>
          <p>Snapshot generated {updatedAt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</p>
          <p>{periodLabels[dashboardData.period]} · INR</p>
        </div>

        <div className="sidebar-user">
          <span className="avatar">{initials}</span>
          <div className="sidebar-user-meta">
            <strong>{user.name}</strong>
            <span>{user.role}</span>
          </div>
          <button type="button" className="icon-btn" onClick={() => clearSession()} aria-label="Sign out">
            <LogOutIcon />
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-title">
            <p className="eyebrow">Overview · {periodLabels[period]}</p>
            <h1>Store performance</h1>
            <p className="topbar-sub">
              Snapshot for {updatedAt.toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long"
              })}
            </p>
          </div>

          <div className="topbar-actions">
            <div className="segmented" role="group" aria-label="Select reporting period">
              {periodOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={period === option.value ? "is-active" : ""}
                  onClick={() => setPeriod(option.value)}
                  aria-pressed={period === option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="btn-ghost btn-refresh"
              onClick={() => setRefreshKey((key) => key + 1)}
              disabled={dashboardLoading}
            >
              <RefreshIcon className={dashboardLoading ? "is-spinning" : ""} />
              {dashboardLoading ? "Syncing" : "Refresh"}
            </button>
          </div>
        </header>

        {error && <div className="banner-error">{error}</div>}

        <section id="overview" className="kpi-grid">
          {metricConfig.map((metric) => {
            const metricData = dashboardData.summary[metric.key];
            const positive = metricData.change >= 0;
            const series = metric.metric
              ? dashboardData.revenueTrend.map((point) => point[metric.metric])
              : null;
            const seriesMax = series ? Math.max(...series) || 1 : 0;

            return (
              <article className="kpi-card" key={metric.key}>
                <header>
                  <span className="kpi-index">{metric.index}</span>
                  <span className="kpi-label">{metric.label}</span>
                </header>
                <p className="kpi-value">
                  {metric.key === "totalRevenue" || metric.key === "avgOrderValue"
                    ? currency.format(metricData.value)
                    : numberFormatter.format(metricData.value)}
                </p>
                <footer>
                  <span className={positive ? "delta is-up" : "delta is-down"}>
                    <ArrowUpRight className={positive ? "" : "is-flipped"} />
                    {Math.abs(metricData.change).toFixed(1)}%
                  </span>
                  <span className="kpi-note">vs previous period</span>
                </footer>
                {series && (
                  <div className="kpi-spark" aria-hidden="true">
                    {series.map((value, index) => (
                      <span
                        key={index}
                        style={{ height: `${Math.max(14, Math.round((value / seriesMax) * 100))}%` }}
                        className={index === series.length - 1 ? "is-last" : ""}
                      />
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </section>

        <section id="revenue" className="grid-2 grid-2-wide">
          <article className="panel">
            <header className="panel-head">
              <div>
                <p className="eyebrow">Revenue trend</p>
                <h2>How {periodLabels[period].toLowerCase()} is pacing</h2>
              </div>
              <div className="panel-head-stat">
                <strong>{currency.format(dashboardData.summary.totalRevenue.value)}</strong>
                <span className={dashboardData.summary.totalRevenue.change >= 0 ? "is-up" : "is-down"}>
                  {dashboardData.summary.totalRevenue.change >= 0 ? "+" : ""}
                  {dashboardData.summary.totalRevenue.change.toFixed(1)}%
                </span>
              </div>
            </header>

            <RevenueChart
              points={dashboardData.revenueTrend}
              currency={currency}
              compact={compact}
            />

            <footer className="panel-foot">
              <div>
                <span>Orders</span>
                <strong>{numberFormatter.format(dashboardData.summary.totalOrders.value)}</strong>
              </div>
              <div>
                <span>Avg order</span>
                <strong>{currency.format(dashboardData.summary.avgOrderValue.value)}</strong>
              </div>
              <div>
                <span>Conversion</span>
                <strong>{overallCvr.toFixed(1)}%</strong>
              </div>
            </footer>
          </article>

          <article className="panel" id="products">
            <header className="panel-head">
              <div>
                <p className="eyebrow">Top products</p>
                <h2>What the store keeps selling</h2>
              </div>
            </header>

            <ol className="product-list">
              {dashboardData.topProducts.map((product, index) => (
                <li key={product.name}>
                  <span className="product-rank">0{index + 1}</span>
                  <div className="product-body">
                    <div className="product-line">
                      <strong>{product.name}</strong>
                      <span>{currency.format(product.revenue)}</span>
                    </div>
                    <div className="product-track">
                      <span style={{ width: `${Math.round((product.revenue / maxProductRevenue) * 100)}%` }} />
                    </div>
                    <p className="product-units">{numberFormatter.format(product.unitsSold)} units sold</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="category-block">
              <p className="eyebrow">Category revenue mix</p>
              <CategoryDonut
                items={dashboardData.categorySales}
                currency={currency}
                total={dashboardData.summary.totalRevenue.value}
              />
            </div>
          </article>
        </section>

        <section id="orders" className="grid-3">
          <article className="panel panel-status">
            <header className="panel-head">
              <div>
                <p className="eyebrow">Order status</p>
                <h2>Where things stand</h2>
              </div>
              <span className="muted-chip">{numberFormatter.format(statusTotal)} orders</span>
            </header>

            <div className="status-stack" aria-hidden="true">
              {dashboardData.ordersByStatus.map((item) => (
                <span
                  key={item.status}
                  className={statusSlug(item.status)}
                  style={{ flexGrow: item.count }}
                />
              ))}
            </div>

            <ul className="status-list">
              {dashboardData.ordersByStatus.map((item) => (
                <li key={item.status}>
                  <span className={`status-dot ${statusSlug(item.status)}`} />
                  <span className="status-name">{item.status}</span>
                  <strong>{numberFormatter.format(item.count)}</strong>
                  <span className="status-share">{Math.round((item.count / statusTotal) * 100)}%</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="panel panel-funnel">
            <header className="panel-head">
              <div>
                <p className="eyebrow">Conversion funnel</p>
                <h2>Visitor to purchase</h2>
              </div>
              <span className="muted-chip is-lime">{overallCvr.toFixed(1)}% CVR</span>
            </header>

            <ul className="funnel-list">
              {funnelStages.map((stage, index) => {
                const width = Math.max(8, Math.round((stage.value / funnelStages[0].value) * 100));
                const step = index === 0 ? 100 : (stage.value / funnelStages[index - 1].value) * 100;
                return (
                  <li key={stage.label}>
                    <div className="funnel-head">
                      <span>{stage.label}</span>
                      <strong>{numberFormatter.format(stage.value)}</strong>
                    </div>
                    <div className="funnel-row">
                      <div className="funnel-track">
                        <span style={{ width: `${width}%` }} />
                      </div>
                      <span className="funnel-step">{step === 100 ? "—" : `${step.toFixed(1)}%`}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </article>

          <article className="panel panel-categories">
            <header className="panel-head">
              <div>
                <p className="eyebrow">Category depth</p>
                <h2>Revenue by category</h2>
              </div>
            </header>

            <ul className="category-list">
              {dashboardData.categorySales.map((item) => (
                <li key={item.category}>
                  <div className="category-line">
                    <span>{item.category}</span>
                    <strong>{currency.format(item.amount)}</strong>
                  </div>
                  <div className="category-track">
                    <span style={{ width: `${Math.round((item.amount / maxCategoryAmount) * 100)}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="panel panel-orders">
          <header className="panel-head">
            <div>
              <p className="eyebrow">Recent orders</p>
              <h2>Latest five transactions</h2>
            </div>
            <span className="muted-chip">Updated {updatedAt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
          </header>

          <div className="table-wrap">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th className="is-right">Amount</th>
                  <th>Placed</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentOrders.map((order) => (
                  <tr key={order.orderId}>
                    <td className="order-id">{order.orderId}</td>
                    <td>{order.customer}</td>
                    <td>
                      <span className="pay-chip">{order.payment}</span>
                    </td>
                    <td>
                      <span className={`status-pill ${statusSlug(order.status)}`}>{order.status}</span>
                    </td>
                    <td className="is-right order-amount">{currency.format(order.amount)}</td>
                    <td className="order-time">{order.placedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="page-foot">
          <span>ShopAdmin control room</span>
          <span>
            {periodLabels[dashboardData.period]} · {numberFormatter.format(dashboardData.summary.totalOrders.value)}{" "}
            orders · INR
          </span>
          <span>Demo dataset · generated {updatedAt.toLocaleString("en-IN")}</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
