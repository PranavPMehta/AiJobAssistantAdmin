import React, { useState, useEffect } from "react";
import { Layout } from "./components/Layout";
import { UserTable } from "./components/UserTable";
import { JobTable } from "./components/JobTable";
import { Card, Button, Input } from "./components/UI";
import { UserFormModal } from "./components/UserFormModal";
import { JobFormModal } from "./components/Modals";
import{ApproveUserModal, RejectModal} from "./components/SignupRequests/ApproveUserModal";
import { SignupRequestsPage } from "./components/SignupRequests/SignupRequestsPage";
import { updateUserStatus } from "./api/adminUserApi";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  Users,
  CheckCircle2,
  FileCheck,
  Briefcase,
  Search,
  Download,
  Plus,
} from "lucide-react";

import { User, UserStatus, ViewState, Job, JobStatus } from "./types";
import { adminLogin as loginAdmin } from "./api/adminApi";
import axiosClient from "./api/axiosClient";
/* =====================================================
   LOGIN SCREEN
===================================================== */

const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res: any = await loginAdmin({ username, password });

      localStorage.setItem("admin_token", res?.token || "logged_in");

      onLogin();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-main p-4">
      <div className="w-full max-w-md bg-surface-card border border-slate-800 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Admin Panel
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <Button className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Access Dashboard"}
          </Button>
        </form>
      </div>
    </div>
  );
};

/* =====================================================
   DASHBOARD STATS
===================================================== */

const DashboardStats = ({ users, jobs }: { users: User[]; jobs: Job[] }) => {
  const stats = [
    {
      label: "Total Seekers",
      value: users.length,
      icon: Users,
    },
    {
      label: "Active Jobs",
      value: jobs.length,
      icon: Briefcase,
    },
    {
      label: "Active Users",
      value: users.filter(
        (u: any) => u.status === "ACTIVE" || u.status === UserStatus.APPROVED,
      ).length,
      icon: CheckCircle2,
    },
    {
      label: "Offers Given",
      value: jobs.filter(
        (j: any) => j.status === "OFFER" || j.status === JobStatus.OFFER,
      ).length,
      icon: FileCheck,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-surface-card border border-slate-800 rounded-xl p-6 flex justify-between"
        >
          <div>
            <p className="text-slate-400 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>

          <stat.icon className="text-neon-cyan" size={24} />
        </div>
      ))}
    </div>
  );
};

/* =====================================================
   MAIN APP
===================================================== */

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("admin_token"),
  );

  const [view, setView] = useState<ViewState>("dashboard");

  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  
  const [loadingStats, setLoadingStats] = useState(true);

  const [jobSearch, setJobSearch] = useState("");

  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  /* ================= EXPORT JOBS ================= */

  const exportJobs = () => {
    const headers = ["ID", "Title", "Company", "Location", "Type", "Salary"];

    const rows = jobs.map((j: any) => [
      j.job_id || j.id,
      j.job_title || j.title,
      j.company,
      j.location,
      j.job_type || j.jobType,
      j.salary,
    ]);

    const csv =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      rows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csv);

    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `jobs_export_${Date.now()}.csv`);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* ================= EXCEL EXPORT ================= */

  const exportJobsExcel = () => {
    const data = jobs.map((j: any) => ({
      ID: j.job_id || j.id,
      Title: j.job_title || j.title,
      Company: j.company,
      Location: j.location,
      Type: j.job_type || j.jobType,
      Salary: j.salary,
      Experience: j.experience,
      Skills: (j.key_skills || []).join(", "),
      ApplicationURL: j.application_url,
      Insights: j.insights,
      Remarks: j.remarks,
      Connections: (j.connections || []).join(", "),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Jobs");

    XLSX.writeFile(workbook, `jobs_export_${Date.now()}.xlsx`);
  };

  /* ================= PDF EXPORT ================= */

  const exportJobsPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });

    const columns = [
      "ID",
      "Title",
      "Company",
      "Location",
      "Type",
      "Salary",
      "Experience",
      "Skills",
      "ApplicationURL",
      "Insights",
      "Remarks",
      "Connections",
    ];

    const rows = jobs.map((j: any) => [
      j.job_id || j.id,
      j.job_title || j.title,
      j.company,
      j.location,
      j.job_type || j.jobType,
      j.salary,
      j.experience,
      (j.key_skills || []).join(", "),
      j.application_url,
      j.insights,
      j.remarks,
      (j.connections || []).join(", "),
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 20,
      styles: { fontSize: 7 },
    });

    doc.text("Jobs Export", 14, 15);

    doc.save(`jobs_export_${Date.now()}.pdf`);
  };

  /* ================= USER STATUS ACTIONS ================= */

  const handleApprove = (user: User) => {
  setSelectedUser(user);
  setIsApproveModalOpen(true);
};

  const handleReject  = (user: User) => {
  setSelectedUser(user);
  setIsRejectModalOpen(true);
};

  /* ================= ADD JOB BUTTON ================= */

  const handleAddJob = () => {
    setJobModalOpen(true);
  };

  /* ================= USER ACTIONS ================= */

  const handleCreateInit = () => {
    setSelectedUser(null);
    setUserModalOpen(true);
  };

  const handleEditInit = (user: User) => {
    setSelectedUser(user);
    setUserModalOpen(true);
  };


 const handleDeactivate = async (user: User) => {

  const confirmDeactivate = window.confirm(
    `Are you sure you want to deactivate ${user.name}?`
  );

  if (!confirmDeactivate) return;

  const id =
    (user as any).id ||
    (user as any).userId ||
    (user as any).user_id;

  await updateUserStatus(id, "Deactivated");

  setUsers(prev =>
    prev.map(u =>
      ((u as any).user_id || (u as any).id) === id
        ? { ...u, status: UserStatus.DEACTIVATED }
        : u
    )
  );

};
const handleReactivate = async (user: User) => {

  const confirmReactivate = window.confirm(
    `Are you sure you want to reactivate ${user.name}?`
  );

  if (!confirmReactivate) return;

  const id =
    (user as any).id ||
    (user as any).userId ||
    (user as any).user_id;

  await updateUserStatus(id, "Approved");

  loadStats();
};

const handleTogglePremium = async (user: User, value: boolean) => {

  const id =
    (user as any).id ||
    (user as any).userId ||
    (user as any).user_id;

  await updateUserStatus(id, "Approved", undefined, value);

  setUsers(prev =>
    prev.map(u =>
      ((u as any).user_id || (u as any).id) === id
        ? { ...u, isPremium: value }
        : u
    )
  );
};

  /* ================= SAFE RESPONSE NORMALIZER ================= */

  const unwrap = (res: any) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.users)) return res.users;
    if (Array.isArray(res.jobs)) return res.jobs;
    if (Array.isArray(res.data?.users)) return res.data.users;
    if (Array.isArray(res.data?.jobs)) return res.data.jobs;
    return [];
  };

  /* ================= LOAD STATS ================= */

  const loadStats = async () => {
    try {
      setLoadingStats(true);

      const usersRes = await axiosClient.get("/admin/users");
      const jobsRes = await axiosClient.get("/admin/jobs");

      const usersData = unwrap(usersRes);
      const jobsData = unwrap(jobsRes);

      setUsers(usersData);
      setJobs(jobsData);
    } catch (err) {
      console.error("Stats load failed", err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    loadStats();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <>
      <Layout
        currentView={view}
        onChangeView={setView}
        onLogout={() => setIsAuthenticated(false)}
      >
        {view === "dashboard" && (
          <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white">
                Dashboard Overview
              </h1>

              <Button onClick={handleCreateInit} icon={<Plus size={16} />}>
                Create User
              </Button>
            </div>
            {!loadingStats && <DashboardStats users={users} jobs={jobs} />}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Recent Users">
                <UserTable users={users.slice(0, 5)} onEdit={handleEditInit} />
              </Card>

              <Card title="Recent Jobs Added">
                <JobTable jobs={jobs.slice(0, 5)} />
              </Card>
            </div>
          </div>
        )}
        {view === "requests" && (
          <SignupRequestsPage
            users={users.filter(
              (u: any) =>
                u.status === "PENDING" ||
                u.status === "Pending" ||
                u.status === UserStatus.PENDING,
            )}
            onApprove={handleApprove}
            onReject={handleReject}
            onEdit={handleEditInit}
          />
        )}

        {view === "users" && (
          <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white">All Users</h1>

              <Button onClick={handleCreateInit}>Create User Manually</Button>
            </div>

            <UserTable
  users={users}
  onApprove={handleApprove}
  onReject={handleReject}
  onEdit={handleEditInit}
  onDeactivate={handleDeactivate}
  onReactivate={handleReactivate}
  onTogglePremium={handleTogglePremium}
  isPendingView={false}
/>
          </div>
        )}

        {view === "jobs" && (
          <div className="animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Application Tracker
                </h1>
                <p className="text-sm text-slate-500">
                  Manage and track your job applications
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={exportJobs}
                  variant="secondary"
                  icon={<Download size={16} />}
                >
                  Export CSV
                </Button>

                <Button
                  onClick={exportJobsExcel}
                  variant="secondary"
                  icon={<Download size={16} />}
                >
                  Export Excel
                </Button>

                <Button
                  onClick={exportJobsPDF}
                  variant="secondary"
                  icon={<Download size={16} />}
                >
                  Export PDF
                </Button>

                <Button
                  onClick={handleAddJob}
                  className="bg-white text-black font-bold hover:bg-slate-200"
                  icon={<Plus size={16} />}
                >
                  Add Job
                </Button>
              </div>
            </div>

            <JobTable />
          </div>
        )}
      </Layout>
      <UserFormModal
        open={userModalOpen}
        user={selectedUser}
        onClose={() => setUserModalOpen(false)}
        onSuccess={loadStats}
      />
      <JobFormModal
        open={jobModalOpen}
        job={null}
        onClose={() => setJobModalOpen(false)}
        onSuccess={loadStats}
      />
      {/* APPROVE USER MODAL */}
      <ApproveUserModal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        onConfirm={async (password: string, isPremium: boolean) => {
          if (!selectedUser) return;

          await updateUserStatus(
  (selectedUser as any).userId || (selectedUser as any).user_id,
  "Approved",
  password,
  isPremium
);
          setIsApproveModalOpen(false);
          loadStats();
        }}
        user={selectedUser}
      />

      {/* REJECT USER MODAL */}
      <RejectModal
  isOpen={isRejectModalOpen}
  onClose={() => setIsRejectModalOpen(false)}
  onConfirm={async (reason: string) => {
    if (!selectedUser) return;

    const userId =
      (selectedUser as any).id ||
      (selectedUser as any).userId ||
      (selectedUser as any).user_id;

    await updateUserStatus(
      userId,
      "Rejected",
      undefined,
      undefined,
      reason
    );

    setIsRejectModalOpen(false);
    loadStats();
  }}
  user={selectedUser}
/>   
    </>
  );
}
