const Application = require("../models/Application");
const transporter = require("../config/email");

// ================= Apply for Job =================

const applyJob = async (req, res) => {
  try {
    const { job, applicant } = req.body;

    // Check if already applied
    const existingApplication = await Application.findOne({
      job,
      applicant,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    // Resume upload required
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload your resume",
      });
    }

    const application = await Application.create({
      job,
      applicant,
      resume: req.file.filename,
    });

    res.status(201).json({
      success: true,
      message: "Application Submitted Successfully",
      application,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Get All Applications =================

const getApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("job", "title company location salary")
      .populate("applicant", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Get My Applications =================

const getMyApplications = async (req, res) => {
  try {
    const { userId } = req.params;

    const applications = await Application.find({
      applicant: userId,
    })
      .populate("job", "title company location salary")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Update Status =================

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findById(req.params.id)
      .populate("applicant", "name email")
      .populate("job", "title company");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application Not Found",
      });
    }

    application.status = status;

    await application.save();

    // Send email only if rejected
    if (status === "Rejected") {

      console.log("Sending rejection email...");

      const info = await transporter.sendMail({
        from: `"SmartHire Recruitment" <${process.env.EMAIL_USER}>`,
        to: application.applicant.email,
        subject: "Application Status Update | SmartHire",

        html: `
        <div style="font-family:Arial;padding:20px;background:#f4f4f4">
          <div style="max-width:600px;margin:auto;background:white;padding:25px;border-radius:10px">

            <h2 style="color:#dc2626;">
              Application Update
            </h2>

            <p>Dear <b>${application.applicant.name}</b>,</p>

            <p>
              Thank you for applying for the
              <b>${application.job.title}</b>
              position at
              <b>${application.job.company}</b>.
            </p>

            <p>
              After carefully reviewing your application,
              we have decided to move forward with another candidate.
            </p>

            <p>
              We truly appreciate your interest in our company and
              encourage you to apply again in the future.
            </p>

            <br>

            <p>
              Best Regards,<br>
              <b>SmartHire Recruitment Team</b>
            </p>

          </div>
        </div>
        `,
      });

      console.log("Rejection Email Sent!");
      console.log(info.response);
    }

    res.status(200).json({
      success: true,
      message: "Application Status Updated Successfully",
      application,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ================= Schedule Interview =================

const scheduleInterview = async (req, res) => {
  try {
    const { date, time, mode, meetingLink } = req.body;

    console.log("========== INTERVIEW ==========");

    // Fetch application with applicant and job details
    const application = await Application.findById(req.params.id)
      .populate("applicant", "name email")
      .populate("job", "title company");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application Not Found",
      });
    }

    // Save interview details
    application.interview = {
      date,
      time,
      mode,
      meetingLink,
    };

    application.status = "Shortlisted";

    await application.save();

    console.log("Sending email to:", application.applicant.email);

    // Send Email
    const info = await transporter.sendMail({
      from: `"SmartHire Recruitment" <${process.env.EMAIL_USER}>`,
      to: application.applicant.email,
      subject: "Interview Invitation | SmartHire Recruitment",

      html: `
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">
</head>

<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,sans-serif;">

<table width="100%" cellspacing="0" cellpadding="0">
<tr>
<td align="center">

<table width="650"
style="background:white;margin:30px;border-radius:12px;
overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,.15);">

<tr>
<td style="background:#6d28d9;color:white;padding:30px;text-align:center;">

<h1 style="margin:0;">SmartHire</h1>

<p style="margin-top:10px;font-size:18px;">
Interview Invitation
</p>

</td>
</tr>

<tr>
<td style="padding:35px;">

<h2 style="color:#2563eb;">
Congratulations ${application.applicant.name}! 🎉
</h2>

<p style="font-size:17px;">
We are delighted to inform you that your application has been
<b>Shortlisted</b>.
</p>

<p style="font-size:16px;">
Your interview has been successfully scheduled.
</p>

<hr>

<h3 style="color:#6d28d9;">
Interview Details
</h3>

<table width="100%" cellpadding="10">

<tr>
<td width="35%"><b>Job Role</b></td>
<td>${application.job.title}</td>
</tr>

<tr>
<td><b>Company</b></td>
<td>${application.job.company}</td>
</tr>

<tr>
<td><b>Date</b></td>
<td>${date}</td>
</tr>

<tr>
<td><b>Time</b></td>
<td>${time}</td>
</tr>

<tr>
<td><b>Mode</b></td>
<td>${mode}</td>
</tr>

<tr>
<td><b>Meeting Link</b></td>
<td>
<a href="${meetingLink}">
${meetingLink}
</a>
</td>
</tr>

</table>

<br>

<div style="text-align:center;">

<a href="${meetingLink}"
style="
background:#6d28d9;
color:white;
padding:15px 35px;
text-decoration:none;
border-radius:8px;
font-size:18px;
display:inline-block;
">

Join Interview

</a>

</div>

<br>

<p style="font-size:16px;">
Please join the interview at least
<b>10 minutes before</b>
the scheduled time.
</p>

<p>
We wish you the very best!
</p>

<br>

<p>
Regards,
<br><br>
<b>SmartHire Recruitment Team</b>
</p>

</td>
</tr>

<tr>
<td style="background:#f4f6f9;padding:20px;text-align:center;font-size:13px;color:#666;">
© 2026 SmartHire Recruitment Portal
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`,
    });

    console.log("===================================");
    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log("Accepted:", info.accepted);
    console.log("Rejected:", info.rejected);
    console.log("Response:", info.response);
    console.log("===================================");

    res.status(200).json({
      success: true,
      message: "Interview Scheduled Successfully",
      application,
    });
  } catch (error) {
    console.log("========== INTERVIEW ERROR ==========");
    console.log(error);
    console.log("====================================");

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Send Offer Letter =================

const sendOffer = async (req, res) => {
  try {
    const { joiningDate } = req.body;

    const application = await Application.findById(req.params.id)
      .populate("applicant", "name email")
      .populate("job", "title company salary location");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application Not Found",
      });
    }

    // Update Offer Details
application.status = "Offer Sent";

application.interview.offer = {
  joiningDate,
  status: "Pending",
};

await application.save();
    

    console.log("Sending offer letter to:", application.applicant.email);

    const info = await transporter.sendMail({
      from: `"SmartHire Recruitment" <${process.env.EMAIL_USER}>`,
      to: application.applicant.email,
      subject: "🎉 Offer Letter | SmartHire Recruitment",

      html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>

<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,sans-serif;">

<table width="100%" cellspacing="0" cellpadding="0">
<tr>
<td align="center">

<table width="650"
style="background:white;margin:30px;border-radius:12px;
overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,.15);">

<tr>
<td style="background:#16a34a;color:white;padding:30px;text-align:center;">
<h1>🎉 SmartHire</h1>
<h2>Offer Letter</h2>
</td>
</tr>

<tr>
<td style="padding:35px;">

<h2 style="color:#16a34a;">
Congratulations ${application.applicant.name}!
</h2>

<p>
We are delighted to offer you the position of
<b>${application.job.title}</b>
at
<b>${application.job.company}</b>.
</p>

<table width="100%" cellpadding="10">

<tr>
<td><b>Job Role</b></td>
<td>${application.job.title}</td>
</tr>

<tr>
<td><b>Company</b></td>
<td>${application.job.company}</td>
</tr>

<tr>
<td><b>Salary</b></td>
<td>₹${application.job.salary}</td>
</tr>

<tr>
<td><b>Location</b></td>
<td>${application.job.location}</td>
</tr>

<tr>
<td><b>Joining Date</b></td>
<td>${joiningDate}</td>
</tr>

</table>

<br>

<p>
We look forward to welcoming you to our team.
Please report on your joining date with the required documents.
</p>

<br>

<p>
Congratulations once again, and we wish you a successful career with us.
</p>

<br>

<p>
Regards,<br><br>
<b>SmartHire Recruitment Team</b>
</p>

</td>
</tr>

<tr>
<td style="background:#f4f6f9;padding:20px;text-align:center;font-size:13px;color:#666;">
© 2026 SmartHire Recruitment Portal
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`,
    });

    console.log("===================================");
    console.log("Offer Letter Sent!");
    console.log("Message ID:", info.messageId);
    console.log("Accepted:", info.accepted);
    console.log("Rejected:", info.rejected);
    console.log("Response:", info.response);
    console.log("===================================");

    res.status(200).json({
      success: true,
      message: "Offer Letter Sent Successfully",
      application,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Accept Offer =================

const acceptOffer = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("applicant", "name email")
      .populate("job", "title company");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application Not Found",
      });
    }

    application.interview.offer.status = "Accepted";
    application.status = "Offer Accepted";

    await application.save();

    const info = await transporter.sendMail({
      from: `"SmartHire Recruitment" <${process.env.EMAIL_USER}>`,
      to: application.applicant.email,
      subject: "🎉 Offer Accepted Successfully",

      html: `
      <div style="font-family:Arial;padding:25px;background:#f4f6f9">

      <div style="max-width:650px;margin:auto;background:white;padding:30px;border-radius:10px">

      <h2 style="color:#16a34a">
      Congratulations ${application.applicant.name}! 🎉
      </h2>

      <p>

      Your offer for the position of

      <b>${application.job.title}</b>

      at

      <b>${application.job.company}</b>

      has been marked as <b>Accepted</b>.

      </p>

      <p>

      We look forward to welcoming you to our team.

      </p>

      <br>

      <p>

      Regards,

      <br><br>

      <b>SmartHire Recruitment Team</b>

      </p>

      </div>

      </div>
      `,
    });

    console.log("Offer Accepted Email Sent");
    console.log(info.response);

    res.status(200).json({
      success: true,
      message: "Offer Accepted Successfully",
      application,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ================= Decline Offer =================

const declineOffer = async (req, res) => {
  try {

    const application = await Application.findById(req.params.id)
      .populate("applicant", "name email")
      .populate("job", "title company");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application Not Found",
      });
    }

    application.interview.offer.status = "Declined";
application.status = "Offer Declined";

    await application.save();

    const info = await transporter.sendMail({
      from: `"SmartHire Recruitment" <${process.env.EMAIL_USER}>`,
      to: application.applicant.email,
      subject: "Offer Declined | SmartHire Recruitment",

      html: `
      <div style="font-family:Arial;padding:25px;background:#f4f6f9">

      <div style="max-width:650px;margin:auto;background:white;padding:30px;border-radius:10px">

      <h2 style="color:#dc2626">
      Offer Declined
      </h2>

      <p>

      Dear <b>${application.applicant.name}</b>,

      </p>

      <p>

      We have recorded your decision to decline the offer for the position of

      <b>${application.job.title}</b>

      at

      <b>${application.job.company}</b>.

      </p>

      <p>

      Thank you for considering SmartHire.
      We wish you all the very best for your future career.

      </p>

      <br>

      <p>

      Regards,

      <br><br>

      <b>SmartHire Recruitment Team</b>

      </p>

      </div>

      </div>
      `,
    });

    console.log("Offer Declined Email Sent");
    console.log(info.response);

    res.status(200).json({
      success: true,
      message: "Offer Declined Successfully",
      application,
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
  applyJob,
  getApplications,
  getMyApplications,
  updateApplicationStatus,
  scheduleInterview,
  sendOffer,
  acceptOffer,
  declineOffer,
};