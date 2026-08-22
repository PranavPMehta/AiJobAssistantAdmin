import React, { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { JobStatus } from "../api/types";
import { Input, Select, Button } from "./UI";

import { createJob, updateJob } from "../api/adminJobApi";

interface Connection {
  name: string;
  title: string;
  emailOrLinkedIn: string;
  email: string;
  mobileNumber: string;
  contact?: string;
}

interface Props {
  open: boolean;
  job: any | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const JobFormModal: React.FC<Props> = ({
  open,
  job,
  onClose,
  onSuccess
}) => {

  const isEdit = !!job;

  const [form, setForm] = useState<any>({
    jobTitle: "",
    company: "",
    location: "",
    jobType: "Full-time",
    salary: "",
    experience: "",
    keySkills: [],
    applicationUrl: "",
    status: JobStatus.SAVED,
    description: "",
    remarks: "",
    connections: [],
    resume: "",
    proofs: []
  });

  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= LOAD JOB ================= */

  useEffect(() => {

    if (job) {

      console.log("📥 LOADING JOB INTO MODAL:", job);

      setForm({
        jobTitle: job.jobTitle || "",
        company: job.company || "",
        location: job.location || "",
        jobType: job.jobType || "Full-time",
        salary: job.salary || "",
        experience: job.experience || "",
        keySkills: job.keySkills || [],
        applicationUrl: job.applicationUrl || "",
        status: job.status || JobStatus.SAVED,
        description: job.description || "",
        remarks: job.remarks || "",
        connections: (job.connections || []).map((conn: any) => ({
          name: conn.name || "",
          title: conn.title || "",
          emailOrLinkedIn: conn.emailOrLinkedIn || conn.contact || conn.linkedin || conn.linkedIn || conn.url || "",
          email: conn.email || conn.email_address || conn.email_id || "",
          mobileNumber: conn.mobileNumber || conn.mobile || conn.mobile_number || conn.mobilenumber || conn.phone || "",
        })),
        resume: job.resume || "",
        proofs: job.proofs || []
      });

    } else {

      setForm({
        jobTitle: "",
        company: "",
        location: "",
        jobType: "Full-time",
        salary: "",
        experience: "",
        keySkills: [],
        applicationUrl: "",
        status: JobStatus.SAVED,
        description: "",
        remarks: "",
        connections: [],
        resume: "",
        proofs: []
      });

    }

  }, [job, open]);

  if (!open) return null;

  /* ================= SKILLS ================= */

  const addSkill = (e: React.KeyboardEvent) => {

    if (e.key === "Enter" && skillInput.trim()) {

      e.preventDefault();

      setForm({
        ...form,
        keySkills: [...form.keySkills, skillInput]
      });

      setSkillInput("");

    }

  };

  const removeSkill = (skill: string) => {

    setForm({
      ...form,
      keySkills: form.keySkills.filter((s: string) => s !== skill)
    });

  };

  /* ================= CONNECTIONS ================= */

  const addConnection = () => {

    if (form.connections.length < 5) {

      setForm({
        ...form,
        connections: [
          ...form.connections,
          { name: "", title: "", emailOrLinkedIn: "", email: "", mobileNumber: "" }
        ]
      });

    }

  };

  const updateConnection = (
    index: number,
    field: string,
    value: string
  ) => {

    const updated = [...form.connections];

    updated[index][field] = value;

    setForm({
      ...form,
      connections: updated
    });

  };

  const removeConnection = (index: number) => {

    setForm({
      ...form,
      connections: form.connections.filter(
        (_: any, i: number) => i !== index
      )
    });

  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {

  e.preventDefault();

  try {

    setLoading(true);

    console.log("📦 FORM DATA BEFORE API:", form);

    if (isEdit) {

      console.log("📡 UPDATE REQUEST PAYLOAD:");
      console.log({
        jobId: job.id,
        body: form
      });

      const res = await updateJob(job.id, form);

      console.log("📥 UPDATE API RESPONSE:", res);

      console.log("✅ JOB UPDATED SUCCESSFULLY");

    } else {

      console.log("📡 CREATE REQUEST PAYLOAD:");
      console.log({
        body: form
      });

      const res = await createJob(form);

      console.log("📥 CREATE API RESPONSE:", res);

      console.log("✅ JOB CREATED SUCCESSFULLY");

    }

    console.log("🔄 Refreshing jobs list...");

    if (onSuccess) {
      await onSuccess();
    }

    console.log("✅ Jobs list refreshed");

    onClose();

  } catch (err) {

    console.error("❌ JOB SAVE FAILED");

    console.error("Error Object:", err);

    if ((err as any)?.response) {
      console.error("API Error Response:", (err as any).response.data);
    }

  } finally {

    setLoading(false);

  }

};

  /* ================= UI ================= */

  return (

    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">

      <div className="bg-surface-card border border-slate-700 rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">

        {/* HEADER */}

        <div className="flex justify-between items-center p-4 border-b border-slate-800">

          <h2 className="text-lg font-semibold text-white">
            {isEdit ? "Edit Job Details" : "Add New Job"}
          </h2>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>

        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* BASIC INFO */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Input
              label="Job Title *"
              value={form.jobTitle || ""}
              onChange={(e) =>
                setForm({ ...form, jobTitle: e.target.value })
              }
            />

            <Input
              label="Company *"
              value={form.company || ""}
              onChange={(e) =>
                setForm({ ...form, company: e.target.value })
              }
            />

            <Input
              label="Location / Remote"
              value={form.location || ""}
              onChange={(e) =>
                setForm({ ...form, location: e.target.value })
              }
            />

            <Select
              label="Job Type"
              value={form.jobType || "Full-time"}
              onChange={(e) =>
                setForm({ ...form, jobType: e.target.value })
              }
              options={[
                { label: "Full-time", value: "Full-time" },
                { label: "Part-time", value: "Part-time" },
                { label: "Contract", value: "Contract" },
                { label: "Internship", value: "Internship" }
              ]}
            />

            <Input
              label="Salary"
              value={form.salary || ""}
              onChange={(e) =>
                setForm({ ...form, salary: e.target.value })
              }
            />

            <Input
              label="Experience Required"
              value={form.experience || ""}
              onChange={(e) =>
                setForm({ ...form, experience: e.target.value })
              }
            />

            <Input
              label="Application URL"
              type="url"
              value={form.applicationUrl || ""}
              onChange={(e) =>
                setForm({ ...form, applicationUrl: e.target.value })
              }
            />

            <Select
              label="Status"
              value={form.status || JobStatus.SAVED}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
              options={Object.values(JobStatus).map((status) => ({
                label: status,
                value: status
              }))}
            />

          </div>

          {/* SKILLS */}

          <div>

            <label className="text-xs text-slate-400 mb-1 block">
              Key Roles / Skills
            </label>

            <div className="flex flex-wrap gap-2 mb-2 min-h-[32px] p-2 bg-surface-main border border-slate-700 rounded-lg">

              {(form.keySkills || []).map((skill: string) => (

                <span
                  key={skill}
                  className="flex items-center gap-1 px-2 py-1 bg-neon-green/10 text-neon-green text-xs rounded border border-neon-green/20"
                >

                  {skill}

                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                  >
                    <X size={12} />
                  </button>

                </span>

              ))}

            </div>

            <Input
              placeholder="Type a skill and press Enter"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={addSkill}
            />

          </div>

          {/* CONNECTIONS */}

          <div>

            <div className="flex justify-between items-center mb-2">

              <label className="text-xs text-slate-400">
                Connections (up to 5)
              </label>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={addConnection}
                icon={<Plus size={14} />}
              >
                Add Connection
              </Button>

            </div>

            <div className="space-y-3">

              {(form.connections || []).map(
                (conn: Connection, i: number) => (

                  <div
                    key={i}
                    className="grid grid-cols-12 gap-2 bg-surface-main p-2 rounded-lg border border-slate-800"
                  >

                    <div className="col-span-12 md:col-span-3">
                      <Input
                        placeholder="Name"
                        value={conn.name || ""}
                        onChange={(e) =>
                          updateConnection(i, "name", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-span-12 md:col-span-3">
                      <Input
                        placeholder="Title / Position"
                        value={conn.title || ""}
                        onChange={(e) =>
                          updateConnection(i, "title", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-span-12 md:col-span-2">
                      <Input
                        placeholder="LinkedIn URL"
                        value={conn.emailOrLinkedIn || conn.contact || ""}
                        onChange={(e) =>
                          updateConnection(i, "emailOrLinkedIn", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-span-12 md:col-span-2">
                      <Input
                        placeholder="Email"
                        value={conn.email || ""}
                        onChange={(e) =>
                          updateConnection(i, "email", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-span-10 md:col-span-1">
                      <Input
                        placeholder="Mobile Number"
                        value={conn.mobileNumber || ""}
                        onChange={(e) =>
                          updateConnection(i, "mobileNumber", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-span-2 md:col-span-1 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeConnection(i)}
                        className="text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                  </div>

                )
              )}

            </div>

          </div>

          {/* REMARKS */}

          <div>

            <label className="text-xs text-slate-400 mb-1 block">
              Insights / Description
            </label>

            <textarea
              className="w-full bg-surface-main border border-slate-700 rounded-lg p-3 text-slate-200 h-24 outline-none focus:border-neon-green"
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

          </div>

          <div>

            <label className="text-xs text-slate-400 mb-1 block">
              Remarks / Notes
            </label>

            <textarea
              className="w-full bg-surface-main border border-slate-700 rounded-lg p-3 text-slate-200 h-24 outline-none focus:border-neon-green"
              value={form.remarks || ""}
              onChange={(e) =>
                setForm({ ...form, remarks: e.target.value })
              }
            />

          </div>

          {/* FOOTER */}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">

            <Button
              variant="ghost"
              type="button"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="bg-white text-black font-bold"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : isEdit
                ? "Update Job"
                : "Add Job"}
            </Button>

          </div>

        </form>

      </div>

    </div>
  );
};
