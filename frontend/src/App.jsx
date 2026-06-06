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
          headers: {
            Authorization: `Bearer ${token}`
          }
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
          headers: {
            Authorization: `Bearer ${token}`
          }
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
  }, [token, user, period]);

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

  function formatValue(metricKey, value) {
    if (metricKey === "totalRevenue" || metricKey === "avgOrderValue") {
      return currency.format(value);
    }
    return numberFormatter.format(value);
  }

  function formatChange(changeValue) {
    const prefix = changeValue >= 0 ? "+" : "";
    return `${prefix}${changeValue.toFixed(1)}% vs previous period`;
  }

  function changeClass(changeValue) {
    return changeValue >= 0 ? "trend trend-up" : "trend trend-down";
  }

  if (authLoading) {
    return <div className="state-message">Checking admin session...</div>;
  }

  if (!token || !user) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <h1>ShopAdmin Login</h1>
          <p>Use admin credentials to access real-time dashboard insights.</p>
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={loginForm.email}
              onChange={(event) => setLoginForm((prev) => ({ ...prev, email: event.target.value }))}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={loginForm.password}
              onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
              required
            />

            <button type="submit" disabled={loginLoading}>
              {loginLoading ? "Signing in..." : "Login as Admin"}
            </button>
          </form>

          {error && <div className="warning">{error}</div>}
          <p className="credentials-text">Demo login: admin@shopadmin.com / Admin@123</p>
        </section>
      </main>
    );
  }

  if (!dashboardData && dashboardLoading) {
    return <div className="state-message">Loading dashboard...</div>;
  }

  if (!dashboardData) {
    return <div className="state-message">Dashboard data unavailable.</div>;
  }

  const maxTrendRevenue = Math.max(...dashboardData.revenueTrend.map((point) => point.revenue));
  const maxCategoryAmount = Math.max(...dashboardData.categorySales.map((item) => item.amount));
  const metricConfig = [
    { key: "totalOrders", label: "Total Orders" },
    { key: "totalRevenue", label: "Total Revenue" },
    { key: "newCustomers", label: "New Customers" },
    { key: "avgOrderValue", label: "Avg Order Value" }
  ];

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>ShopAdmin Admin Dashboard</h1>
          <p>
            Welcome, {user.name} • Last updated{" "}
            {new Date(dashboardData.generatedAt).toLocaleString("en-IN")}
          </p>
        </div>

        <div className="dashboard-actions">
          <div className="filter-group">
            {periodOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={period === option.value ? "filter-btn active" : "filter-btn"}
                onClick={() => setPeriod(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button className="logout-btn" type="button" onClick={() => clearSession()}>
            Logout
          </button>
        </div>
      </header>

      {error && <div className="warning">{error}</div>}

      <section className="cards-grid">
        {metricConfig.map((metric) => {
          const metricData = dashboardData.summary[metric.key];
          return (
            <article className="card" key={metric.key}>
              <h2>{metric.label}</h2>
              <p>{formatValue(metric.key, metricData.value)}</p>
              <span className={changeClass(metricData.change)}>{formatChange(metricData.change)}</span>
            </article>
          );
        })}
      </section>

      <section className="main-grid">
        <article className="panel trend-panel">
          <h2>Revenue Trend</h2>
          <div className="trend-chart">
            {dashboardData.revenueTrend.map((point) => {
              const height = Math.max(12, Math.round((point.revenue / maxTrendRevenue) * 100));
              return (
                <div key={point.label} className="trend-bar-group">
                  <div className="trend-value">{currency.format(point.revenue)}</div>
                  <div className="trend-bar-rail">
                    <div className="trend-bar" style={{ height: `${height}%` }} />
                  </div>
                  <div className="trend-label">{point.label}</div>
                  <div className="trend-orders">{point.orders} orders</div>
                </div>
              );
            })}
          </div>
        </article>

        <article className="panel">
          <h2>Top 3 Products</h2>
          <ul className="top-products">
            {dashboardData.topProducts.map((product) => (
              <li key={product.name}>
                <div>
                  <strong>{product.name}</strong>
                  <span>{product.unitsSold} units sold</span>
                </div>
                <p>{currency.format(product.revenue)}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <h2>Category Revenue Mix</h2>
          <div className="category-bars">
            {dashboardData.categorySales.map((item) => {
              const width = Math.max(8, Math.round((item.amount / maxCategoryAmount) * 100));
              return (
                <div key={item.category} className="category-row">
                  <div className="category-head">
                    <span>{item.category}</span>
                    <strong>{currency.format(item.amount)}</strong>
                  </div>
                  <div className="category-track">
                    <div className="category-fill" style={{ width: `${width}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <article className="panel">
          <h2>Order Status</h2>
          <div className="status-grid">
            {dashboardData.ordersByStatus.map((entry) => (
              <div key={entry.status} className="status-card">
                <span>{entry.status}</span>
                <strong>{numberFormatter.format(entry.count)}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="bottom-grid">
        <article className="panel">
          <h2>Conversion Funnel</h2>
          <div className="funnel-grid">
            <div>
              <span>Visitors</span>
              <strong>{numberFormatter.format(dashboardData.funnel.visitors)}</strong>
            </div>
            <div>
              <span>Product Views</span>
              <strong>{numberFormatter.format(dashboardData.funnel.productViews)}</strong>
            </div>
            <div>
              <span>Add to Cart</span>
              <strong>{numberFormatter.format(dashboardData.funnel.addToCart)}</strong>
            </div>
            <div>
              <span>Checkout</span>
              <strong>{numberFormatter.format(dashboardData.funnel.checkout)}</strong>
            </div>
            <div>
              <span>Purchased</span>
              <strong>{numberFormatter.format(dashboardData.funnel.purchased)}</strong>
            </div>
          </div>
        </article>

        <article className="panel">
          <h2>Recent Orders</h2>
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Placed</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentOrders.map((order) => (
                  <tr key={order.orderId}>
                    <td>{order.orderId}</td>
                    <td>{order.customer}</td>
                    <td>{order.payment}</td>
                    <td>{order.status}</td>
                    <td>{currency.format(order.amount)}</td>
                    <td>{order.placedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      {dashboardLoading && <div className="refreshing">Refreshing dashboard...</div>}
    </div>
  );
}

export default App;
