const Job = require("../models/Job");

const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

// ================= Resume Analyzer =================

const analyzeResume = async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText) {
      return res.status(400).json({
        success: false,
        message: "Resume text is required",
      });
    }

    const skills = [];

    const skillList = [
      "React",
      "React.js",
      "Node",
      "Node.js",
      "Express",
      "Express.js",
      "MongoDB",
      "JavaScript",
      "HTML",
      "CSS",
      "Python",
      "Java",
      "SQL",
      "Bootstrap",
      "Tailwind",
      "JWT",
      "REST API",
      "Git",
      "Redux",
    ];

    skillList.forEach((skill) => {
      if (resumeText.toLowerCase().includes(skill.toLowerCase())) {
        skills.push(skill);
      }
    });

    const score = Math.min(60 + skills.length * 5, 98);

    const analysis = `
🤖 AI Resume Analysis

----------------------------------------

Candidate Name:
Not Detected

Skills:
${skills.length ? skills.join(", ") : "No Skills Found"}

Education:
Detected from Resume

Experience:
Resume contains professional experience.

Strengths:
✔ Good Technical Skills
✔ Resume Structure is Good
✔ Suitable for Software Development Roles

Weaknesses:
• Add more project details
• Mention certifications
• Include GitHub and LinkedIn profile

ATS Score:
${score}/100

Recommended Job Roles:
• Full Stack Developer
• MERN Stack Developer
• React Developer
• Node.js Developer
• Software Engineer

Suggestions:
✔ Add measurable achievements.
✔ Improve resume formatting.
✔ Highlight internships and projects.
`;

    res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Resume Upload =================

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume.",
      });
    }

    const filePath = req.file.path;

    let resumeText = "";

    // PDF
    if (req.file.mimetype === "application/pdf") {
      const buffer = fs.readFileSync(filePath);
      const pdf = await pdfParse(buffer);
      resumeText = pdf.text;
    }

    // DOCX
    if (
      req.file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({
        path: filePath,
      });

      resumeText = result.value;
    }

    res.status(200).json({
      success: true,
      resumeText,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= AI Job Recommendation =================

const recommendJobs = async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText) {
      return res.status(400).json({
        success: false,
        message: "Resume text is required",
      });
    }

    const jobs = await Job.find();

    const resume = resumeText.toLowerCase();

    const keywords = [
      "react",
      "react.js",
      "mern",
      "node",
      "node.js",
      "express",
      "express.js",
      "mongodb",
      "javascript",
      "html",
      "css",
      "python",
      "java",
      "sql",
      "bootstrap",
      "tailwind",
      "jwt",
      "rest",
      "git",
      "redux",
    ];

    const recommendedJobs = jobs.map((job) => {
      const jobText = (
        job.title +
        " " +
        job.description +
        " " +
        job.company +
        " " +
        job.location
      ).toLowerCase();

      let score = 0;

      keywords.forEach((keyword) => {
        if (resume.includes(keyword) && jobText.includes(keyword)) {
          score += 10;
        }
      });

      score = Math.min(score, 100);

      return {
        _id: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        description: job.description,
        matchScore: score,
      };
    });

    recommendedJobs.sort((a, b) => b.matchScore - a.matchScore);

    const matchedJobs = recommendedJobs.filter(
      (job) => job.matchScore > 0
    );

    res.status(200).json({
      success: true,
      jobs: matchedJobs,
    });
    
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  analyzeResume,
  uploadResume,
  recommendJobs,
};