import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
  });

  useEffect(() => {
    fetchJob();
  }, []);

  const fetchJob = async () => {
    try {
      const res = await API.get(`/jobs/${id}`);
      setFormData(res.data.job);
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
      const res = await API.put(`/jobs/${id}`, formData);

      alert(res.data.message);

      navigate("/jobs");
    } catch (error) {
      alert(error.response?.data?.message || "Update Failed");
    }
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          width: "400px",
          margin: "40px auto",
          textAlign: "center",
        }}
      >
        <h1>Edit Job</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={formData.title}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
          />

          <input
            type="text"
            name="company"
            placeholder="Company"
            value={formData.company}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
          />

          <input
            type="number"
            name="salary"
            placeholder="Salary"
            value={formData.salary}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
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
            Update Job
          </button>
        </form>
      </div>
    </>
  );
}

export default EditJob;