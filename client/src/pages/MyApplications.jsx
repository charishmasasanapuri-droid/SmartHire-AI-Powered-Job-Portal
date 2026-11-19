import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

function MyApplications() {
  const [applications, setApplications] = useState([]);

  const fetchApplications = async () => {
    try {
      const userId = localStorage.getItem("userId");

      const res = await API.get(`/applications/my/${userId}`);

      setApplications(res.data.applications);
    } catch (error) {
      console.log(error);
      alert("Failed to load applications");
    }
  };

  // ================= Accept Offer =================

const acceptOffer = async (id) => {
  try {
    const res = await API.put(`/applications/${id}/accept`);

    alert(res.data.message);

    fetchApplications();
  } catch (error) {
    alert(error.response?.data?.message || "Failed");
  }
};

// ================= Decline Offer =================

const declineOffer = async (id) => {
  try {
    const res = await API.put(`/applications/${id}/decline`);

    alert(res.data.message);

    fetchApplications();
  } catch (error) {
    alert(error.response?.data?.message || "Failed");
  }
};

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <>
      <Navbar />

      <div
        style={{
          width: "80%",
          margin: "40px auto",
        }}
      >
        <h1 style={{ textAlign: "center" }}>📄 My Applications</h1>

        {applications.length === 0 ? (
          <h3 style={{ textAlign: "center" }}>
            You haven't applied for any jobs yet.
          </h3>
        ) : (
          applications.map((application) => (
            <div
              key={application._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "20px",
                marginTop: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <h2>{application.job.title}</h2>

              <p>
                <strong>🏢 Company:</strong> {application.job.company}
              </p>

              <p>
                <strong>📍 Location:</strong> {application.job.location}
              </p>

              <p>
                <strong>💰 Salary:</strong> ₹{application.job.salary}
              </p>

              <h3>
                Status:{" "}
                <span
                  style={{
                    color:
  application.status === "Applied"
    ? "#f59e0b"
    : application.status === "Shortlisted"
    ? "green"
    : application.status === "Offer Sent"
    ? "#2563eb"
    : application.status === "Offer Accepted"
    ? "green"
    : application.status === "Offer Declined"
    ? "red"
    : "red",
                  }}
                >
                  {application.status}
                </span>
              </h3>

              <p>
                <strong>Resume:</strong>{" "}
                <a
                  href={`http://localhost:5000/uploads/${application.resume}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Resume
                </a>
              </p>

              {/* ================= Interview Details ================= */}

{application.interview?.date && (
  <>
    <hr />

    <h3>📅 Interview Details</h3>

    <p>
      <strong>Date:</strong> {application.interview.date}
    </p>

    <p>
      <strong>Time:</strong> {application.interview.time}
    </p>

    <p>
      <strong>Mode:</strong> {application.interview.mode}
    </p>

    <p>
      <strong>Meeting Link:</strong>{" "}
      <a
        href={application.interview.meetingLink}
        target="_blank"
        rel="noreferrer"
      >
        Join Meeting
      </a>
    </p>
  </>
)}

{/* ================= Offer Letter ================= */}

{application.status === "Offer Sent" && (
  <>
    <hr />

    <h2 style={{ color: "green" }}>
      🎉 Congratulations!
    </h2>

    <p>
      SmartHire has offered you this position.
    </p>

    <p>
  <strong>Joining Date:</strong>{" "}
  {application.interview?.offer?.joiningDate}
</p>

    <button
      onClick={() => acceptOffer(application._id)}
      style={{
        background: "green",
        color: "white",
        border: "none",
        padding: "12px 22px",
        marginRight: "15px",
        cursor: "pointer",
        borderRadius: "6px",
      }}
    >
      ✅ Accept Offer
    </button>

    <button
      onClick={() => declineOffer(application._id)}
      style={{
        background: "red",
        color: "white",
        border: "none",
        padding: "12px 22px",
        cursor: "pointer",
        borderRadius: "6px",
      }}
    >
      ❌ Decline Offer
    </button>
  </>
)}

{application.status === "Offer Accepted" && (
  <h2 style={{ color: "green" }}>
    ✅ You have accepted the offer.
  </h2>
)}

{application.status === "Offer Declined" && (
  <h2 style={{ color: "red" }}>
    ❌ You declined the offer.
  </h2>
)}
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default MyApplications;