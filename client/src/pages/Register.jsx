import { useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Register() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "jobseeker",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/register", formData);

      alert(res.data.message);

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "jobseeker",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          width: "350px",
          margin: "80px auto",
          textAlign: "center",
        }}
      >
        <h2>Register</h2>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
            }}
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
            }}
          />

          {/* Password with Eye Icon */}
          <div
            style={{
              position: "relative",
              marginBottom: "15px",
            }}
          >
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                paddingRight: "45px",
                boxSizing: "border-box",
              }}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#555",
                fontSize: "18px",
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Role */}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
            }}
          >
            <option value="jobseeker">Job Seeker</option>
            <option value="employer">Employer</option>
          </select>

          {/* Register Button */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              background: "#2563eb",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Register
          </button>
        </form>
      </div>
    </>
  );
}

export default Register;