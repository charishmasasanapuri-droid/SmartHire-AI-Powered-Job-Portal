import { useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

function PostJob() {
  const [job, setJob] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
  });

  const handleChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/jobs", job);

      alert(res.data.message);

      setJob({
        title: "",
        company: "",
        location: "",
        salary: "",
        description: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Error creating job");
    }
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          width: "500px",
          margin: "40px auto",
        }}
      >
        <h1>Post Job</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={job.title}
            onChange={handleChange}
            required
          />

          <br /><br />

          <input
            type="text"
            name="company"
            placeholder="Company"
            value={job.company}
            onChange={handleChange}
            required
          />

          <br /><br />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={job.location}
            onChange={handleChange}
            required
          />

          <br /><br />

          <input
            type="number"
            name="salary"
            placeholder="Salary"
            value={job.salary}
            onChange={handleChange}
            required
          />

          <br /><br />

          <textarea
            name="description"
            placeholder="Description"
            value={job.description}
            onChange={handleChange}
            required
          />

          <br /><br />

          <button type="submit">
            Post Job
          </button>
        </form>
      </div>
    </>
  );
}

export default PostJob;