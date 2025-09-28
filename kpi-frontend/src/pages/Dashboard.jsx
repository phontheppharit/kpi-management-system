import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Layout from "../components/Navbar";

// Export utilities
const exportToCSV = (data, filename = 'kpi_report') => {
  const headers = ['Title', 'Description', 'Target Value', 'Actual Value', 'Status', 'Assigned User', 'Start Date', 'End Date', 'Progress %'];
  
  const csvContent = [
    headers.join(','),
    ...data.map(kpi => [
      `"${kpi.title || ''}"`,
      `"${kpi.description || ''}"`,
      kpi.target_value || 0,
      kpi.actual_value || 0,
      `"${kpi.status || ''}"`,
      `"${kpi.assigned_user?.username || 'Unassigned'}"`,
      kpi.start_date ? new Date(kpi.start_date).toLocaleDateString() : '',
      kpi.end_date ? new Date(kpi.end_date).toLocaleDateString() : '',
      kpi.target_value ? Math.round((kpi.actual_value / kpi.target_value) * 100) : 0
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportToPDF = (data, chartRef = 'kpi_report') => {
  // Create a new window for PDF generation
  const printWindow = window.open('', '_blank');
  
  const currentDate = new Date().toLocaleDateString('th-TH');
  const totalKPI = data.length;
  const achievedCount = data.filter(k => k.status === "On Track").length;
  const riskCount = data.filter(k => k.status === "At Risk").length;
  const offCount = data.filter(k => k.status === "Off Track").length;

  // Get chart image if available
  let chartImage = '';
  if (chartRef && chartRef.current) {
    try {
      chartImage = chartRef.current.toBase64Image();
    } catch (error) {
      console.warn('Could not capture chart:', error);
    }
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>KPI Report - ${currentDate}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
          font-family: 'Inter', sans-serif;
          line-height: 1.6;
          color: #1f2937;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 20px;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px;
          text-align: center;
        }
        
        .header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 10px;
        }
        
        .header p {
          font-size: 1.2rem;
          opacity: 0.9;
        }
        
        .summary {
          padding: 40px;
          background: #f8fafc;
        }
        
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .summary-card {
          background: white;
          padding: 25px;
          border-radius: 15px;
          text-align: center;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border-left: 4px solid;
        }
        
        .summary-card.total { border-left-color: #3b82f6; }
        .summary-card.achieved { border-left-color: #10b981; }
        .summary-card.risk { border-left-color: #f59e0b; }
        .summary-card.off { border-left-color: #ef4444; }
        
        .summary-card h3 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 5px;
        }
        
        .summary-card p {
          color: #6b7280;
          font-weight: 500;
        }
        
        .chart-section {
          padding: 40px;
          text-align: center;
        }
        
        .chart-section h2 {
          font-size: 1.8rem;
          margin-bottom: 20px;
          color: #1f2937;
        }
        
        .chart-section img {
          max-width: 100%;
          height: auto;
          border-radius: 10px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .table-section {
          padding: 40px;
        }
        
        .table-section h2 {
          font-size: 1.8rem;
          margin-bottom: 20px;
          color: #1f2937;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        th, td {
          padding: 15px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }
        
        th {
          background: #f9fafb;
          font-weight: 600;
          color: #374151;
        }
        
        tr:hover {
          background: #f9fafb;
        }
        
        .status-badge {
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-align: center;
          display: inline-block;
          min-width: 80px;
        }
        
        .status-on-track {
          background: #d1fae5;
          color: #065f46;
        }
        
        .status-at-risk {
          background: #fef3c7;
          color: #92400e;
        }
        
        .status-off-track {
          background: #fee2e2;
          color: #991b1b;
        }
        
        .footer {
          padding: 30px 40px;
          background: #f8fafc;
          text-align: center;
          color: #6b7280;
          border-top: 1px solid #e5e7eb;
        }
        
        @media print {
          body { background: white !important; padding: 0 !important; }
          .container { box-shadow: none !important; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📊 KPI Performance Report</h1>
          <p>Generated on ${currentDate}</p>
        </div>
        
        <div class="summary">
          <h2 style="margin-bottom: 20px; color: #1f2937;">Executive Summary</h2>
          <div class="summary-grid">
            <div class="summary-card total">
              <h3>${totalKPI}</h3>
              <p>Total KPIs</p>
            </div>
            <div class="summary-card achieved">
              <h3>${achievedCount}</h3>
              <p>On Track</p>
            </div>
            <div class="summary-card risk">
              <h3>${riskCount}</h3>
              <p>At Risk</p>
            </div>
            <div class="summary-card off">
              <h3>${offCount}</h3>
              <p>Off Track</p>
            </div>
          </div>
        </div>
        
        ${chartImage ? `
        <div class="chart-section">
          <h2>Performance Overview</h2>
          <img src="${chartImage}" alt="KPI Performance Chart" />
        </div>
        ` : ''}
        
        <div class="table-section">
          <h2>Detailed KPI Analysis</h2>
          <table>
            <thead>
              <tr>
                <th>KPI Title</th>
                <th>Target</th>
                <th>Actual</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Owner</th>
                <th>Timeline</th>
              </tr>
            </thead>
            <tbody>
              ${data.map(kpi => `
                <tr>
                  <td style="font-weight: 600;">${kpi.title || 'N/A'}</td>
                  <td>${kpi.target_value || 0}</td>
                  <td style="font-weight: 600;">${kpi.actual_value || 0}</td>
                  <td>${kpi.target_value ? Math.round((kpi.actual_value / kpi.target_value) * 100) : 0}%</td>
                  <td>
                    <span class="status-badge ${
                      kpi.status === 'On Track' ? 'status-on-track' :
                      kpi.status === 'At Risk' ? 'status-at-risk' : 'status-off-track'
                    }">
                      ${kpi.status || 'Unknown'}
                    </span>
                  </td>
                  <td>${kpi.assigned_user?.username || 'Unassigned'}</td>
                  <td style="font-size: 0.9rem;">
                    ${kpi.start_date ? new Date(kpi.start_date).toLocaleDateString() : 'N/A'} - 
                    ${kpi.end_date ? new Date(kpi.end_date).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="footer">
          <p>This report was automatically generated from the KPI Management System</p>
          <p>© ${new Date().getFullYear()} - Confidential Business Information</p>
        </div>
      </div>
      
      <script>
        window.onload = function() {
          setTimeout(() => {
            window.print();
          }, 1000);
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

// Register chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [kpis, setKpis] = useState([]);
  const [, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const chartRef = React.useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await fetchKPIs(),fetchUsers();
    setIsLoading(false);
  };

  // โหลด KPI จาก backend
  const fetchKPIs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/kpis", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setKpis(res.data);
    } catch (err) {
      console.error("โหลด KPI ไม่ได้", err);
    }
  };

  // โหลด Users จาก backend
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("โหลด Users ไม่ได้", err);
    }
  };

  // Analytics
  const totalKPI = kpis.length;
  const achievedCount = kpis.filter((k) => k.status === "On Track").length;
  const riskCount = kpis.filter((k) => k.status === "At Risk").length;
  const offCount = kpis.filter((k) => k.status === "Off Track").length;
  
  // Chart data with modern styling
  const labels = kpis.map((k) => k.title);
  const data = {
    labels,
    datasets: [
      {
        label: "Target",
        data: kpis.map((k) => Number(k.target_value) || 0),
        backgroundColor: "rgba(99, 102, 241, 0.8)",
        borderColor: "rgb(99, 102, 241)",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: "Actual",
        data: kpis.map((k) => Number(k.actual_value) || 0),
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderColor: "rgb(34, 197, 94)",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 14,
            family: "'Inter', sans-serif"
          }
        }
      },
      title: { 
        display: true, 
        text: "KPI Performance Analysis",
        font: {
          size: 18,
          weight: 'bold',
          family: "'Inter', sans-serif"
        },
        color: '#1f2937',
        padding: {
          top: 10,
          bottom: 30
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif"
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
        },
        ticks: {
          stepSize: 10,
          font: {
            family: "'Inter', sans-serif"
          }
        },
        suggestedMax: 100,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Dashboard Overview
              </h1>
              <p className="text-gray-600 text-lg">Monitor your KPIs and track performance in real-time</p>
            </div>
            
            {/* Export Button */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-4 text-white font-semibold shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <div className="relative flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Export Report</span>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${showExportMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              {/* Export Menu */}
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white/90 backdrop-blur-sm shadow-xl border border-white/20 py-2 z-50">
                  <button
                    onClick={() => {
                      exportToCSV(kpis, 'kpi_dashboard_report');
                      setShowExportMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-indigo-50/50 transition-colors duration-200 flex items-center space-x-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Export as CSV</div>
                      <div className="text-sm text-gray-500">Spreadsheet format</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      exportToPDF(kpis, chartRef, 'kpi_dashboard_report');
                      setShowExportMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-indigo-50/50 transition-colors duration-200 flex items-center space-x-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Export as PDF</div>
                      <div className="text-sm text-gray-500">Professional report</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/20 blur-xl transition-all group-hover:scale-150"></div>
            <div className="relative">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-blue-100 text-sm font-medium">Total KPIs</p>
                <div className="rounded-full bg-white/20 p-2">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-bold">{totalKPI}</h2>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/20 blur-xl transition-all group-hover:scale-150"></div>
            <div className="relative">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-emerald-100 text-sm font-medium">On Track</p>
                <div className="rounded-full bg-white/20 p-2">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-bold">{achievedCount}</h2>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 p-6 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/20 blur-xl transition-all group-hover:scale-150"></div>
            <div className="relative">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-amber-100 text-sm font-medium">At Risk</p>
                <div className="rounded-full bg-white/20 p-2">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5C3.498 20.333 4.46 22 6 22z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-bold">{riskCount}</h2>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-500 to-pink-500 p-6 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/20 blur-xl transition-all group-hover:scale-150"></div>
            <div className="relative">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-red-100 text-sm font-medium">Off Track</p>
                <div className="rounded-full bg-white/20 p-2">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-bold">{offCount}</h2>
            </div>
          </div>
        </div>

 

        {/* KPI Trends Chart */}
        <div className="rounded-3xl bg-white/70 backdrop-blur-sm p-8 shadow-xl border border-white/20">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Performance Trends</h2>
            <p className="text-gray-600">Visual comparison of targets vs actual performance</p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-2xl"></div>
            <div className="relative w-full h-96 p-4">
              <Bar ref={chartRef} options={options} data={data} />
            </div>
          </div>
        </div>
               {/* KPI Overview Table */}
        <div className="mb-8 rounded-3xl bg-white/70 backdrop-blur-sm p-8 shadow-xl border border-white/20">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">KPI Overview</h2>
            <div className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2">
              <span className="text-white text-sm font-medium">Live Data</span>
            </div>
          </div>
          
          <div className="overflow-hidden rounded-2xl border border-gray-200/50 shadow-lg">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Target</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actual</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Assigned User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50">
                {kpis.map((kpi) => (
                  <tr key={kpi._id} className="transition-all duration-200 hover:bg-indigo-50/30 hover:scale-[1.01]">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{kpi.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-gray-700">{kpi.target_value}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-gray-900">{kpi.actual_value}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
                          kpi.status === "On Track"
                            ? "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border border-emerald-300"
                            : kpi.status === "At Risk"
                            ? "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border border-amber-300"
                            : "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300"
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          kpi.status === "On Track" ? "bg-emerald-500" :
                          kpi.status === "At Risk" ? "bg-amber-500" : "bg-red-500"
                        }`}></div>
                        {kpi.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                          {kpi.assigned_user?.username?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <span className="text-gray-700 font-medium">{kpi.assigned_user?.username || "Unassigned"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="space-y-1">
                        <div>{kpi.start_date?.substring(0, 10)}</div>
                        <div className="text-gray-400">to</div>
                        <div>{kpi.end_date?.substring(0, 10)}</div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}