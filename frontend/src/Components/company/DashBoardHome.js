import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardHome = () => {
  const [dashboardData, setDashboardData] = useState({
    employeeCount: 0,
    totalProjects: 0,
    completedProjects: 0,
    ongoingProjects: 0
  });
  
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const companyId = localStorage.getItem('companyId');
      const userRole = localStorage.getItem('role'); // Assuming the role is stored in local storage
      setRole(userRole);
      
      try {
        const response = await axios.get('http://localhost:3001/api/dashboard-data', {
          params: { companyId }
        });
        setDashboardData(response.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchDashboardData();
  }, []);

  const chartData = {
    labels: ['Total Projects', 'Completed Projects', 'Ongoing Projects'],
    datasets: [
      {
        label: 'Projects',
        data: [dashboardData.totalProjects, dashboardData.completedProjects, dashboardData.ongoingProjects],
        backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(255, 206, 86, 0.2)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)', 'rgba(255, 206, 86, 1)'],
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      }
    }
  };

  return (
    <div>
      {role !== 'company' ? (
        <h3>Welcome to your dashboard!</h3>
      ) : (
        <div>
          <div className="row g-6 mb-6">
            <div className="col-xl-3 col-sm-6 col-12">
              <div className="card shadow border-0">
                <div className="card-body">
                  <div className="row">
                    <div className="col">
                      <span className="h6 font-semibold text-muted text-sm d-block mb-2">Employee Count</span>
                      <span className="h3 font-bold mb-0">{dashboardData.employeeCount}</span>
                    </div>
                    <div className="col-auto">
                      <div className="icon icon-shape bg-tertiary text-white text-lg rounded-circle">
                        <i className="bi bi-person"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-sm-6 col-12">
              <div className="card shadow border-0">
                <div className="card-body">
                  <div className="row">
                    <div className="col">
                      <span className="h6 font-semibold text-muted text-sm d-block mb-2">Total<br />Projects</span>
                      <span className="h3 font-bold mb-0">{dashboardData.totalProjects}</span>
                    </div>
                    <div className="col-auto">
                      <div className="icon icon-shape bg-primary text-white text-lg rounded-circle">
                        <i className="bi bi-folder"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-sm-6 col-12">
              <div className="card shadow border-0">
                <div className="card-body">
                  <div className="row">
                    <div className="col">
                      <span className="h6 font-semibold text-muted text-sm d-block mb-2">Completed Projects</span>
                      <span className="h3 font-bold mb-0">{dashboardData.completedProjects}</span>
                    </div>
                    <div className="col-auto">
                      <div className="icon icon-shape bg-success text-white text-lg rounded-circle">
                        <i className="bi bi-check-circle"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-sm-6 col-12">
              <div className="card shadow border-0">
                <div className="card-body">
                  <div className="row">
                    <div className="col">
                      <span className="h6 font-semibold text-muted text-sm d-block mb-2">Ongoing Projects</span>
                      <span className="h3 font-bold mb-0">{dashboardData.ongoingProjects}</span>
                    </div>
                    <div className="col-auto">
                      <div className="icon icon-shape bg-warning text-white text-lg rounded-circle">
                        <i className="bi bi-hourglass-split"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow border-0">
            <div className="card-body">
              <h5 className="h3 mb-4">Project Statistics</h5>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
