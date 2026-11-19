import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      const res = await API.post("/auth/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);
      localStorage.setItem("role", res.data.user.role);

      alert("Login Successful");

      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
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
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
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
            Login
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;