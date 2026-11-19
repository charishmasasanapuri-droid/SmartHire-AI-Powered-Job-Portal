import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

function Dashboard() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    totalEmployers: 0,
    totalJobSeekers: 0,
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await API.get("/dashboard");

      setStats({
        totalJobs: res.data.totalJobs,
        totalApplications: res.data.totalApplications,
        totalEmployers: res.data.totalEmployers,
        totalJobSeekers: res.data.totalJobSeekers,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const cardStyle = {
    width: "220px",
    padding: "25px",
    borderRadius: "10px",
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
  };

  const barData = {
    labels: [
      "Jobs",
      "Applications",
      "Employers",
      "Job Seekers",
    ],
    datasets: [
      {
        label: "Statistics",
        data: [
          stats.totalJobs,
          stats.totalApplications,
          stats.totalEmployers,
          stats.totalJobSeekers,
        ],
        backgroundColor: [
          "#2563eb",
          "#16a34a",
          "#7c3aed",
          "#d97706",
        ],
      },
    ],
  };

  const pieData = {
    labels: [
      "Employers",
      "Job Seekers",
    ],
    datasets: [
      {
        data: [
          stats.totalEmployers,
          stats.totalJobSeekers,
        ],
        backgroundColor: [
          "#7c3aed",
          "#16a34a",
        ],
      },
    ],
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          width: "90%",
          margin: "40px auto",
          textAlign: "center",
        }}
      >
        <h1>📊 SmartHire Dashboard</h1>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "20px",
            marginTop: "40px",
          }}
        >
          <div
            style={{
              ...cardStyle,
              background: "#2563eb",
            }}
          >
            <h2>{stats.totalJobs}</h2>
            <p>Total Jobs</p>
          </div>

          <div
            style={{
              ...cardStyle,
              background: "#16a34a",
            }}
          >
            <h2>{stats.totalApplications}</h2>
            <p>Total Applications</p>
          </div>

          <div
            style={{
              ...cardStyle,
              background: "#7c3aed",
            }}
          >
            <h2>{stats.totalEmployers}</h2>
            <p>Total Employers</p>
          </div>

          <div
            style={{
              ...cardStyle,
              background: "#d97706",
            }}
          >
            <h2>{stats.totalJobSeekers}</h2>
            <p>Total Job Seekers</p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            marginTop: "60px",
          }}
        >
          <div
            style={{
              width: "500px",
            }}
          >
            <h2>Bar Chart</h2>
            <Bar data={barData} />
          </div>

          <div
            style={{
              width: "350px",
            }}
          >
            <h2>Pie Chart</h2>
            <Pie data={pieData} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;