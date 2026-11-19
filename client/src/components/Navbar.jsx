import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");

    alert("Logged Out Successfully");
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 40px",
        background: "#8120d0",
        color: "white",
      }}
    >
      <h2>SmartHire</h2>

      <div>
        {/* Public Links */}

        <Link
          to="/"
          style={{
            color: "white",
            marginRight: "20px",
            textDecoration: "none",
          }}
        >
          Home
        </Link>

        <Link
          to="/jobs"
          style={{
            color: "white",
            marginRight: "20px",
            textDecoration: "none",
          }}
        >
          Jobs
        </Link>

        {token && (
          <>
            {/* Dashboard */}

            <Link
              to="/dashboard"
              style={{
                color: "white",
                marginRight: "20px",
                textDecoration: "none",
              }}
            >
              Dashboard
            </Link>

            {/* Employer Menu */}

            {role === "employer" && (
              <>
                <Link
                  to="/post-job"
                  style={{
                    color: "white",
                    marginRight: "20px",
                    textDecoration: "none",
                  }}
                >
                  Post Job
                </Link>

                <Link
                  to="/applications"
                  style={{
                    color: "white",
                    marginRight: "20px",
                    textDecoration: "none",
                  }}
                >
                  Applications
                </Link>
              </>
            )}

            {/* Job Seeker Menu */}

            {role !== "employer" && (
              <Link
                to="/my-applications"
                style={{
                  color: "white",
                  marginRight: "20px",
                  textDecoration: "none",
                }}
              >
                My Applications
              </Link>
            )}

            {/* AI Resume */}

            <Link
              to="/resume-analyzer"
              style={{
                color: "white",
                marginRight: "20px",
                textDecoration: "none",
              }}
            >
              AI Resume
            </Link>

            {/* AI Jobs */}

            <Link
              to="/job-recommendations"
              style={{
                color: "white",
                marginRight: "20px",
                textDecoration: "none",
              }}
            >
              AI Jobs
            </Link>

            {/* AI Resume Generator */}

            {/* Profile */}

            <Link
              to="/profile"
              style={{
                color: "white",
                marginRight: "20px",
                textDecoration: "none",
              }}
            >
              Profile
            </Link>

            {/* Logout */}

            <button
              onClick={handleLogout}
              style={{
                marginLeft: "10px",
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        )}

        {!token && (
          <>
            <Link
              to="/login"
              style={{
                color: "white",
                marginRight: "20px",
                textDecoration: "none",
              }}
            >
              Login
            </Link>

            <Link
              to="/register"
              style={{
                color: "white",
                textDecoration: "none",
              }}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;