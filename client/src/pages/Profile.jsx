import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Profile() {
  const userId = localStorage.getItem("userId");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    education: "",
    experience: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get(`/auth/profile/${userId}`);
      setFormData(res.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.put(`/auth/profile/${userId}`, formData);

      alert(res.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Profile Update Failed");
    }
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          width: "450px",
          margin: "40px auto",
        }}
      >
        <h1>My Profile</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
          />

          <input
            type="text"
            name="skills"
            placeholder="Skills"
            value={formData.skills}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
          />

          <input
            type="text"
            name="education"
            placeholder="Education"
            value={formData.education}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
          />

          <input
            type="text"
            name="experience"
            placeholder="Experience"
            value={formData.experience}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              background: "green",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Update Profile
          </button>
        </form>
      </div>
    </>
  );
}

export default Profile;