import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import API from "./api";


// =========================
// STUDENT DASHBOARD
// =========================

function StudentDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchJobs = async () => {
    try {
      const response = await API.get("/jobs");
      setJobs(response.data.jobs || []);
    } catch (error) {
      setMessage("Unable to load jobs");
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await API.get("/applications/my-applications");
      setApplications(response.data.applications || []);
    } catch (error) {
      setMessage("Unable to load applications");
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      await fetchJobs();
      await fetchApplications();
      setLoading(false);
    };

    loadDashboard();
  }, []);

  const handleApply = async (jobId) => {
    try {
      const response = await API.post(
        `/applications/apply/${jobId}`
      );

      setMessage(response.data.message);

      await fetchApplications();

    } catch (error) {
      setMessage(
        error.response?.data?.message || "Application failed"
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  if (loading) {
    return <h2>Loading Dashboard...</h2>;
  }

  return (
    <div style={{ padding: "30px" }}>

      <h1>CareerConnect AI</h1>

      <p>
        Welcome, <strong>{user?.name}</strong>
      </p>

      <p>
        Role: <strong>{user?.role}</strong>
      </p>

      <button onClick={handleLogout}>
        Logout
      </button>

      <hr />

      {message && (
        <p>
          <strong>{message}</strong>
        </p>
      )}

      {/* AVAILABLE JOBS */}

      <h2>Available Jobs</h2>

      {jobs.length === 0 ? (
        <p>No jobs available currently.</p>
      ) : (
        jobs.map((job) => (
          <div
            key={job._id}
            style={{
              border: "1px solid #ccc",
              padding: "20px",
              marginBottom: "15px",
              borderRadius: "8px",
            }}
          >

            <h3>{job.title}</h3>

            <p>
              <strong>Company:</strong> {job.company}
            </p>

            <p>
              <strong>Location:</strong> {job.location}
            </p>

            <p>
              <strong>Salary:</strong> {job.salary}
            </p>

            <p>
              {job.description}
            </p>

            <button
              onClick={() => handleApply(job._id)}
            >
              Apply Now
            </button>

          </div>
        ))
      )}

      <hr />

      {/* MY APPLICATIONS */}

      <h2>My Applications</h2>

      {applications.length === 0 ? (
        <p>
          You haven't applied for any jobs yet.
        </p>
      ) : (
        applications.map((application) => (
          <div
            key={application._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >

            <h3>
              {application.job?.title}
            </h3>

            <p>
              Company: {application.job?.company}
            </p>

            <p>
              Status: <strong>
                {application.status}
              </strong>
            </p>

          </div>
        ))
      )}

    </div>
  );
}


// =========================
function RecruiterDashboard() {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");

  const [message, setMessage] = useState("");
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState({});

  const user = JSON.parse(localStorage.getItem("user"));

  // =========================
  // FETCH RECRUITER JOBS
  // =========================

  const fetchJobs = async () => {
    try {
      const response = await API.get("/jobs");

      const allJobs = response.data.jobs || [];

      const myJobs = allJobs.filter(
        (job) =>
          job.recruiter?._id === user?._id ||
          job.recruiter === user?._id
      );

      setJobs(myJobs);
    } catch (error) {
      setMessage("Unable to load jobs");
    }
  };

  // =========================
  // FETCH APPLICANTS
  // =========================

  const fetchApplicants = async (jobId) => {
    try {
      const response = await API.get(
        `/applications/job/${jobId}`
      );

      setApplicants((prev) => ({
        ...prev,
        [jobId]: response.data.applications || [],
      }));
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Unable to load applicants"
      );
    }
  };

  // =========================
  // CREATE JOB
  // =========================

  const handleCreateJob = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      const response = await API.post(
        "/jobs/create",
        {
          title,
          company,
          location,
          salary,
          description,
        }
      );

      setMessage(
        response.data.message ||
        "Job posted successfully"
      );

      setTitle("");
      setCompany("");
      setLocation("");
      setSalary("");
      setDescription("");

      await fetchJobs();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Failed to create job"
      );
    }
  };

  // =========================
  // UPDATE APPLICATION STATUS
  // =========================

  const updateApplicationStatus = async (
    applicationId,
    jobId,
    status
  ) => {
    try {
      const response = await API.put(
        `/applications/status/${applicationId}`,
        {
          status,
        }
      );

      setMessage(
        response.data.message ||
        "Application status updated successfully"
      );

      // Refresh applicants after update
      await fetchApplicants(jobId);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Unable to update application"
      );
    }
  };

  // =========================
  // LOAD JOBS
  // =========================

  useEffect(() => {
    fetchJobs();
  }, []);

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <div style={{ padding: "30px" }}>

      <h1>CareerConnect AI</h1>

      <p>
        Welcome, <strong>{user?.name}</strong>
      </p>

      <p>
        Role: <strong>{user?.role}</strong>
      </p>

      <button onClick={handleLogout}>
        Logout
      </button>

      <hr />

      {/* =========================
          CREATE JOB
      ========================= */}

      <h2>Create New Job</h2>

      <form onSubmit={handleCreateJob}>

        <input
          type="text"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Salary"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          required
        />

        <br />
        <br />

        <textarea
          placeholder="Job Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="5"
          required
        />

        <br />
        <br />

        <button type="submit">
          Create Job
        </button>

      </form>

      {message && (
        <p>
          <strong>{message}</strong>
        </p>
      )}

      <hr />

      {/* =========================
          MY POSTED JOBS
      ========================= */}

      <h2>My Posted Jobs</h2>

      {jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        jobs.map((job) => (
          <div
            key={job._id}
            style={{
              border: "1px solid #ccc",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "8px",
            }}
          >

            <h3>{job.title}</h3>

            <p>
              <strong>Company:</strong>{" "}
              {job.company}
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {job.location}
            </p>

            <p>
              <strong>Salary:</strong>{" "}
              {job.salary}
            </p>

            <p>
              {job.description}
            </p>

            <button
              onClick={() =>
                fetchApplicants(job._id)
              }
            >
              View Applicants
            </button>

            {/* =========================
                APPLICANTS
            ========================= */}

            {applicants[job._id] && (
              <div style={{ marginTop: "20px" }}>

                <h3>Applicants</h3>

                {applicants[job._id].length === 0 ? (
                  <p>No applicants yet.</p>
                ) : (
                  applicants[job._id].map(
                    (application) => (
                      <div
                        key={application._id}
                        style={{
                          border: "1px solid #aaa",
                          padding: "15px",
                          marginTop: "10px",
                          borderRadius: "6px",
                        }}
                      >

                        <p>
                          <strong>Name:</strong>{" "}
                          {application.student?.name}
                        </p>

                        <p>
                          <strong>Email:</strong>{" "}
                          {application.student?.email}
                        </p>

                        <p>
                          <strong>Status:</strong>{" "}
                          {application.status}
                        </p>

                        <button
                          onClick={() =>
                            updateApplicationStatus(
                              application._id,
                              job._id,
                              "Selected"
                            )
                          }
                        >
                          Accept
                        </button>

                        {" "}

                        <button
                          onClick={() =>
                            updateApplicationStatus(
                              application._id,
                              job._id,
                              "Rejected"
                            )
                          }
                        >
                          Reject
                        </button>

                      </div>
                    )
                  )
                )}

              </div>
            )}

          </div>
        ))
      )}

    </div>
  );
}
// =========================
// APP / ROUTING
// =========================

function App() {

  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch (error) {
    user = null;
  }

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={
            <Navigate to="/login" />
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/dashboard"
          element={
            !user ? (
              <Navigate to="/login" />
            ) : user.role === "recruiter" ? (
              <RecruiterDashboard />
            ) : (
              <StudentDashboard />
            )
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;