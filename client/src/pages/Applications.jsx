import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Applications() {
  const [applications, setApplications] = useState([]);

  // Interview Form
  const [interview, setInterview] = useState({
    date: "",
    time: "",
    mode: "Online",
    meetingLink: "",
  });

  const [joiningDate, setJoiningDate] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await API.get("/applications");
      setApplications(res.data.applications);
    } catch (error) {
      console.log(error);
    }
  };

  // Update Status
  const updateStatus = async (id, status) => {
    try {
      const res = await API.put(`/applications/${id}`, {
        status,
      });

      alert(res.data.message);

      fetchApplications();
    } catch (error) {
      alert(error.response?.data?.message || "Update Failed");
    }
  };

  // Schedule Interview
  const scheduleInterview = async (id) => {
    try {
      const res = await API.put(`/applications/${id}/interview`, interview);

      alert(res.data.message);

      fetchApplications();

      setInterview({
        date: "",
        time: "",
        mode: "Online",
        meetingLink: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Interview Scheduling Failed");
    }
  };

  // ================= Send Offer =================

const sendOffer = async (id) => {
  try {
    const res = await API.put(`/applications/${id}/offer`, {
      joiningDate,
    });

    alert(res.data.message);

    fetchApplications();

    setJoiningDate("");
  } catch (error) {
    alert(error.response?.data?.message || "Offer Sending Failed");
  }
};

  return (
    <>
      <Navbar />

      <div
        style={{
          width: "85%",
          margin: "40px auto",
        }}
      >
        <h1>📄 Job Applications</h1>

        <hr />

        {applications.length === 0 ? (
          <h3>No Applications Found</h3>
        ) : (
          applications.map((app) => (
            <div
              key={app._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "20px",
                marginTop: "25px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <h2>{app.job.title}</h2>

              <p>
                <strong>🏢 Company:</strong> {app.job.company}
              </p>

              <p>
                <strong>📍 Location:</strong> {app.job.location}
              </p>

              <p>
                <strong>💰 Salary:</strong> ₹{app.job.salary}
              </p>

              <hr />

              <p>
                <strong>👤 Applicant:</strong> {app.applicant.name}
              </p>

              <p>
                <strong>📧 Email:</strong> {app.applicant.email}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color:
                      app.status === "Applied"
                        ? "#f59e0b"
                        : app.status === "Shortlisted"
                        ? "green"
                        : "red",
                    fontWeight: "bold",
                  }}
                >
                  {app.status}
                </span>
              </p>

              {/* Resume */}

              {app.resume && (
                <div style={{ margin: "15px 0" }}>
                  <a
                    href={`http://localhost:5000/uploads/${app.resume}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: "#2563eb",
                      color: "white",
                      padding: "10px 15px",
                      borderRadius: "5px",
                      textDecoration: "none",
                    }}
                  >
                    📄 View Resume
                  </a>
                </div>
              )}

              {/* Buttons */}

              <button
                onClick={() => updateStatus(app._id, "Shortlisted")}
                style={{
                  background: "green",
                  color: "white",
                  border: "none",
                  padding: "10px 15px",
                  marginRight: "10px",
                  cursor: "pointer",
                }}
              >
                Shortlist
              </button>

              <button
                onClick={() => updateStatus(app._id, "Rejected")}
                style={{
                  background: "red",
                  color: "white",
                  border: "none",
                  padding: "10px 15px",
                  cursor: "pointer",
                }}
              >
                Reject
              </button>

              {app.status !== "Offer Sent" && (
  <>
    <hr style={{ margin: "25px 0" }} />

    <h3>📅 Schedule Interview</h3>

    <input
      type="date"
      value={interview.date}
      onChange={(e) =>
        setInterview({
          ...interview,
          date: e.target.value,
        })
      }
      style={{
        padding: "10px",
        marginRight: "10px",
      }}
    />

    <input
      type="time"
      value={interview.time}
      onChange={(e) =>
        setInterview({
          ...interview,
          time: e.target.value,
        })
      }
      style={{
        padding: "10px",
        marginRight: "10px",
      }}
    />

    <select
      value={interview.mode}
      onChange={(e) =>
        setInterview({
          ...interview,
          mode: e.target.value,
        })
      }
      style={{
        padding: "10px",
        marginRight: "10px",
      }}
    >
      <option>Online</option>
      <option>Offline</option>
    </select>

    <br />
    <br />

    <input
      type="text"
      placeholder="Meeting Link / Venue"
      value={interview.meetingLink}
      onChange={(e) =>
        setInterview({
          ...interview,
          meetingLink: e.target.value,
        })
      }
      style={{
        width: "100%",
        padding: "10px",
      }}
    />

    <br />
    <br />

    <button
      onClick={() => scheduleInterview(app._id)}
      style={{
        background: "#7c3aed",
        color: "white",
        border: "none",
        padding: "12px 18px",
        cursor: "pointer",
        borderRadius: "5px",
      }}
    >
      Schedule Interview
    </button>
  </>
)}

              {/* Existing Interview Details */}

              {(app.status === "Shortlisted" ||
  app.status === "Offer Sent") &&
 app.interview?.date && (
                <>
                    <hr />

                    <h3>Interview Details</h3>

                    <p>
                      <strong>Date:</strong> {app.interview.date}
                    </p>

                    <p>
                      <strong>Time:</strong> {app.interview.time}
                    </p>

                    <p>
                      <strong>Mode:</strong> {app.interview.mode}
                    </p>

                    <p>
                      <strong>Meeting Link:</strong>{" "}
                      {app.interview.meetingLink}
                    </p>

                    <hr />

{app.status === "Shortlisted" && (
  <>
    <hr />

    <h3>🎉 Send Offer Letter</h3>

    <input
      type="date"
      value={joiningDate}
      onChange={(e) => setJoiningDate(e.target.value)}
      style={{
        padding: "10px",
      }}
    />

    <br />
    <br />

    <button
      onClick={() => sendOffer(app._id)}
      style={{
        background: "#16a34a",
        color: "white",
        border: "none",
        padding: "12px 20px",
        borderRadius: "6px",
        cursor: "pointer",
      }}
    >
      🎉 Send Offer
    </button>
  </>
)}
                  </>
                )}
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Applications;