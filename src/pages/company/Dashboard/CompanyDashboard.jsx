import React, { useState, useEffect, useContext } from 'react';
import { CompanyContext } from '../../../context/CompanyContext';
import {
    ShoppingBag,
    FileText,
    FileSpreadsheet,
    Users,
    Briefcase,
    TrendingUp,
    TrendingDown,
    Activity,
    Package
} from 'lucide-react';
import dashboardService from '../../../services/dashboardService';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import './CompanyDashboard.css';

import GetCompanyId from '../../../api/GetCompanyId';

const CompanyDashboard = () => {
    const { formatCurrency } = useContext(CompanyContext);
    const companyId = GetCompanyId();
    const [stats, setStats] = useState({
        totalRevenue: 683250,
        totalExpenses: 422180,
        netProfit: 261070,
        customerCount: 47,
        vendorCount: 23,
        productCount: 64,
        saleInvoiceCount: 156,
        purchaseBillCount: 89,
        recentTransactions: [
            { description: 'Invoice #1042 - ABC Corp', type: 'SALES_INVOICE', date: '2026-03-03', amount: 12500 },
            { description: 'Office Supplies Purchase', type: 'EXPENSE', date: '2026-03-02', amount: 3200 },
            { description: 'Invoice #1041 - XYZ Ltd', type: 'SALES_INVOICE', date: '2026-03-01', amount: 8750 },
            { description: 'Monthly Rent Payment', type: 'EXPENSE', date: '2026-02-28', amount: 18000 },
            { description: 'Invoice #1040 - Bright Solutions', type: 'INCOME', date: '2026-02-27', amount: 22400 },
        ],
        chartData: [],
        topProducts: [
            { name: 'Wireless Bluetooth Speaker', salePrice: 1299, quantity: 142, image: '' },
            { name: 'USB-C Hub Adapter', salePrice: 599, quantity: 118, image: '' },
            { name: 'LED Desk Lamp', salePrice: 450, quantity: 95, image: '' },
            { name: 'Ergonomic Mouse Pad', salePrice: 199, quantity: 87, image: '' },
        ],
        lowStockProducts: [
            { name: 'HDMI Cable 2m', quantity: 3, minQty: 10, image: '' },
            { name: 'Screen Protector', quantity: 5, minQty: 15, image: '' },
            { name: 'Phone Stand', quantity: 2, minQty: 8, image: '' },
        ],
        topCustomers: [
            { name: 'ABC Corporation', email: 'billing@abccorp.co.za', totalSales: 145600, profileImage: '' },
            { name: 'XYZ Trading Ltd', email: 'accounts@xyztrading.co.za', totalSales: 98200, profileImage: '' },
            { name: 'Bright Solutions', email: 'info@brightsolutions.co.za', totalSales: 76400, profileImage: '' },
            { name: 'Metro Supplies', email: 'orders@metrosupplies.co.za', totalSales: 52800, profileImage: '' },
        ]
    });
    const [loading, setLoading] = useState(true);

    // Dummy data for charts
    const dummyMonthlyData = [
        { name: 'Jan', revenue: 42000, expense: 28000 },
        { name: 'Feb', revenue: 38000, expense: 25000 },
        { name: 'Mar', revenue: 51000, expense: 32000 },
        { name: 'Apr', revenue: 47000, expense: 30000 },
        { name: 'May', revenue: 53000, expense: 34000 },
        { name: 'Jun', revenue: 60000, expense: 37000 },
        { name: 'Jul', revenue: 55000, expense: 35000 },
        { name: 'Aug', revenue: 62000, expense: 38000 },
        { name: 'Sep', revenue: 58000, expense: 36000 },
        { name: 'Oct', revenue: 67000, expense: 40000 },
        { name: 'Nov', revenue: 72000, expense: 42000 },
        { name: 'Dec', revenue: 78000, expense: 45000 },
    ];

    const dummyExpenseBreakdown = [
        { name: 'Salaries', value: 45000 },
        { name: 'Rent', value: 18000 },
        { name: 'Utilities', value: 8000 },
        { name: 'Marketing', value: 12000 },
        { name: 'Other', value: 7000 },
    ];

    const dummyCashFlow = [
        { name: 'Week 1', inflow: 18000, outflow: 12000 },
        { name: 'Week 2', inflow: 22000, outflow: 15000 },
        { name: 'Week 3', inflow: 19000, outflow: 17000 },
        { name: 'Week 4', inflow: 25000, outflow: 14000 },
        { name: 'Week 5', inflow: 28000, outflow: 16000 },
        { name: 'Week 6', inflow: 24000, outflow: 18000 },
        { name: 'Week 7', inflow: 30000, outflow: 19000 },
        { name: 'Week 8', inflow: 27000, outflow: 15000 },
    ];

    const dummyInvoiceStatus = [
        { name: 'Paid', value: 68 },
        { name: 'Pending', value: 22 },
        { name: 'Overdue', value: 10 },
    ];

    const EXPENSE_COLORS = ['#54b1a6', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];
    const INVOICE_COLORS = ['#10b981', '#f59e0b', '#ef4444'];

    const chartData = stats.chartData && stats.chartData.length > 0 ? stats.chartData : dummyMonthlyData;

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await dashboardService.getCompanyStats();
                if (response.success) {
                    setStats(response.data);
                }
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // const formatCurrency = (val) => {
    //     return new Intl.NumberFormat('en-IN', {
    //         style: 'currency',
    //         currency: 'INR'
    //     }).format(val);
    // };

    return (
        <div className="company-dashboard">
            <div className="dashboard-header">
                <div className="dashboard-title">Invoice360 Dashboard</div>
            </div>

            {/* Top Metrics Grid */}
            <div className="metrics-grid">
                <div className="metric-card">
                    <div className="metric-info">
                        <h3>{formatCurrency(stats.totalRevenue)}</h3>
                        <p>Total Revenue</p>
                    </div>
                    <div className="metric-icon"  style={{backgroundColor: "#d8f1e9ff"}}>
                        <TrendingUp size={24}  color='#10b981'/>
                    </div>
                </div>
                <div className="metric-card">
                    <div className="metric-info">
                        <h3>{formatCurrency(stats.totalExpenses)}</h3>
                        <p>Total Expenses</p>
                    </div>
                    <div className="metric-icon" style={{backgroundColor: "#fef2f2ff"}}>
                        <TrendingDown size={24} color='#ef4444' />
                    </div>
                </div>
                <div className="metric-card">
                    <div className="metric-info">
                        <h3>{formatCurrency(stats.netProfit)}</h3>
                        <p>Net Profit</p>
                    </div>
                    <div className="metric-icon" style={{backgroundColor: "#e0f2feff"}}>
                        <FileSpreadsheet size={24} color='#3b82f6' />
                    </div>
                </div>
                <div className="metric-card">
                    <div className="metric-info">
                        <h3>{stats.recentTransactions.length}</h3>
                        <p>Recent Activities</p>
                    </div>
                    <div className="metric-icon icon-yellow">
                        <Activity size={24} />
                    </div>
                </div>
            </div>

            {/* Counts Grid */}
            <div className="secondary-metrics-grid">
                <div className="secondary-card">
                    <div className="secondary-info">
                        <h4>{stats.customerCount}</h4>
                        <span>Customers</span>
                    </div>
                    <div className="secondary-icon text-warning">
                        <Users size={24} color="#f59e0b" />
                    </div>
                </div>
                <div className="secondary-card">
                    <div className="secondary-info">
                        <h4>{stats.vendorCount}</h4>
                        <span>Vendors</span>
                    </div>
                    <div className="secondary-icon text-info">
                        <Briefcase size={24} color="#3b82f6" />
                    </div>
                </div>
                <div className="secondary-card">
                    <div className="secondary-info">
                        <h4>{stats.purchaseBillCount}</h4>
                        <span>Purchase Bills</span>
                    </div>
                    <div className="secondary-icon text-primary">
                        <FileText size={24} color="#54b1a6" />
                    </div>
                </div>
                <div className="secondary-card">
                    <div className="secondary-info">
                        <h4>{stats.saleInvoiceCount}</h4>
                        <span>Sales Invoices</span>
                    </div>
                    <div className="secondary-icon text-success">
                        <FileText size={24} color="#10b981" />
                    </div>
                </div>
            </div>

            {/* Sales & Purchase Report Chart */}
            <div className="charts-section">
                <div className="chart-card">
                    <div className="chart-header">
                        <h3 className="chart-title">Sales & Purchase Report</h3>
                        <div className="chart-actions">
                            <select defaultValue="2025">
                                <option value="2025">2025</option>
                                <option value="2024">2024</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="expense" fill="#54b1a6" radius={[4, 4, 0, 0]} barSize={20} name="Purchase/Expense" />
                                <Bar dataKey="revenue" fill="#1e293b" radius={[4, 4, 0, 0]} barSize={20} name="Sales/Revenue" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Dummy Charts Grid */}
            <div className="charts-grid">
                {/* Monthly Revenue vs Expenses — Line Chart */}
                <div className="chart-card">
                    <div className="chart-header" style={{ borderLeftColor: '#3b82f6' }}>
                        <h3 className="chart-title">Monthly Revenue vs Expenses</h3>
                    </div>
                    <div style={{ width: '100%', height: 280 }}>
                        <ResponsiveContainer>
                            <LineChart data={dummyMonthlyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                <Line type="monotone" dataKey="revenue" stroke="#54b1a6" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Revenue" />
                                <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Expenses" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Expense Breakdown — Donut Chart */}
                <div className="chart-card">
                    <div className="chart-header" style={{ borderLeftColor: '#8b5cf6' }}>
                        <h3 className="chart-title">Expense Breakdown</h3>
                    </div>
                    <div style={{ width: '100%', height: 280 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={dummyExpenseBreakdown}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={95}
                                    paddingAngle={4}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {dummyExpenseBreakdown.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Cash Flow Trend — Area Chart */}
                <div className="chart-card">
                    <div className="chart-header" style={{ borderLeftColor: '#10b981' }}>
                        <h3 className="chart-title">Cash Flow Trend</h3>
                    </div>
                    <div style={{ width: '100%', height: 280 }}>
                        <ResponsiveContainer>
                            <AreaChart data={dummyCashFlow}>
                                <defs>
                                    <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#54b1a6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#54b1a6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                <Area type="monotone" dataKey="inflow" stroke="#54b1a6" strokeWidth={2} fillOpacity={1} fill="url(#colorInflow)" name="Inflow" />
                                <Area type="monotone" dataKey="outflow" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorOutflow)" name="Outflow" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Invoice Status — Donut Chart */}
                <div className="chart-card">
                    <div className="chart-header" style={{ borderLeftColor: '#f59e0b' }}>
                        <h3 className="chart-title">Invoice Status</h3>
                    </div>
                    <div style={{ width: '100%', height: 280 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={dummyInvoiceStatus}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={95}
                                    paddingAngle={4}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {dummyInvoiceStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={INVOICE_COLORS[index % INVOICE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Widgets Grid */}
            <div className="widgets-grid">
                {/* Top Selling Products */}
                <div className="list-card">
                    <div className="list-header" style={{ borderLeftColor: '#10b981' }}>
                        <div className="list-title">Top Selling Products</div>
                    </div>
                    <div className="list-body">
                        {stats.topProducts.length > 0 ? (
                            <div className="data-list">
                                {stats.topProducts.map((p, i) => (
                                    <div key={i} className="list-item">
                                        <div className="list-info">
                                            {p.image ? (
                                                <img
                                                    src={p.image}
                                                    className="list-img"
                                                    alt={p.name}
                                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/40?text=📦'; }}
                                                />
                                            ) : (
                                                <div className="list-img-placeholder"><Package size={20} /></div>
                                            )}
                                            <div className="list-details">
                                                <span className="list-name">{p.name}</span>
                                                <span className="list-sub">{formatCurrency(p.salePrice)}</span>
                                            </div>
                                        </div>
                                        <div className="list-value">{p.quantity} sold</div>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="empty-message">No sales data yet</p>}
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="list-card">
                    <div className="list-header" style={{ borderLeftColor: '#3b82f6' }}>
                        <div className="list-title">Recent Transactions</div>
                    </div>
                    <div className="list-body">
                        {stats.recentTransactions.length > 0 ? (
                            <div className="recent-list">
                                {stats.recentTransactions.map((tx, idx) => (
                                    <div key={idx} className="recent-item">
                                        <div className="recent-info">
                                            <p className="recent-desc">{tx.description || tx.type}</p>
                                            <p className="recent-date">{new Date(tx.date).toLocaleDateString()}</p>
                                        </div>
                                        <div className={`recent-amount ${tx.type === 'INCOME' || tx.type === 'SALES_INVOICE' ? 'text-success' : 'text-danger'}`}>
                                            {formatCurrency(tx.amount)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="empty-message">No recent activity</p>}
                    </div>
                </div>

                {/* Low Stock */}
                <div className="list-card">
                    <div className="list-header" style={{ borderLeftColor: '#f59e0b' }}>
                        <div className="list-title">Low Stock Products</div>
                    </div>
                    <div className="list-body">
                        {stats.lowStockProducts.length > 0 ? (
                            <div className="data-list">
                                {stats.lowStockProducts.map((p, i) => (
                                    <div key={i} className="list-item">
                                        <div className="list-info">
                                            {p.image ? (
                                                <img
                                                    src={p.image}
                                                    className="list-img"
                                                    alt={p.name}
                                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/40?text=📦'; }}
                                                />
                                            ) : (
                                                <div className="list-img-placeholder"><Package size={20} /></div>
                                            )}
                                            <div className="list-details">
                                                <span className="list-name">{p.name}</span>
                                                <span className="list-sub">Stock: {p.quantity}</span>
                                            </div>
                                        </div>
                                        <div className="list-value text-danger">Min: {p.minQty}</div>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="empty-message">Stock levels are healthy</p>}
                    </div>
                </div>

                {/* Sales Statistics */}
                <div className="chart-card">
                    <div className="chart-header" style={{ borderLeftColor: '#ef4444' }}>
                        <h3 className="chart-title">Sales Statistics</h3>
                        <div className="chart-actions">
                            <select defaultValue="2025">
                                <option>2025</option>
                            </select>
                        </div>
                    </div>
                    <div className="stats-summary">
                        <div className="stat-item">
                            <p className="stat-label">Revenue</p>
                            <p className="stat-value">{formatCurrency(stats.totalRevenue)}</p>
                        </div>
                        <div className="stat-item">
                            <p className="stat-label">Expense</p>
                            <p className="stat-value">{formatCurrency(stats.totalExpenses)}</p>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: 200 }}>
                        <ResponsiveContainer>
                            <BarChart data={stats.chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} barSize={15} name="Revenue" />
                                <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={15} name="Expense" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Customers */}
                <div className="list-card">
                    <div className="list-header" style={{ borderLeftColor: '#ec4899' }}>
                        <div className="list-title">Top Customers</div>
                    </div>
                    <div className="list-body">
                        {stats.topCustomers.length > 0 ? (
                            <div className="data-list">
                                {stats.topCustomers.map((c, i) => (
                                    <div key={i} className="list-item">
                                        <div className="list-info">
                                            {c.profileImage ? <img src={c.profileImage} className="list-img" alt="" /> : <div className="list-img" />}
                                            <div className="list-details">
                                                <span className="list-name">{c.name}</span>
                                                <span className="list-sub">{c.email}</span>
                                            </div>
                                        </div>
                                        <div className="list-value">{formatCurrency(c.totalSales)}</div>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="empty-message">No customer data yet</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDashboard;
