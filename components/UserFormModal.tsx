import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

import { Input, Button, Toggle } from "./UI";
import { User, UserStatus } from "../types";

import { createUser, updateUser } from "../api/adminUserApi";

interface Props {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const UserFormModal: React.FC<Props> = ({
  open,
  user,
  onClose,
  onSuccess
}) => {

  const isEdit = !!user;

  const emptyForm = {
    name: "",
    email: "",
    contactNumber: "",
    jobTitle: "",
    jobLocation: "",
    jobType: "",
    salary: "",
    experience: "",
    skills: "",
    password: "",
    status: UserStatus.APPROVED,
    isPremium: false
  };

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD USER ================= */

  useEffect(() => {

    if (user) {
      setForm({
        name: user.name ?? "",
        email: user.email ?? "",
        contactNumber: user.contactNumber ?? "",
        jobTitle: user.jobTitle ?? "",
        jobLocation: user.jobLocation ?? "",
        jobType: user.jobType ?? "",
        salary: user.salary ?? "",
        experience: user.experience ?? "",
        skills: (user.skills ?? []).join(", "),
        password: "",
        status: user.status ?? UserStatus.APPROVED,
        isPremium: (user as any).isPremium ?? (user as any).is_premium ?? false
      });
    } else {
      setForm(emptyForm);
    }

  }, [user, open]);

  if (!open) return null;

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    try {

      setLoading(true);

      const data = {
        name: form.name,
        email: form.email,
        contactNumber: form.contactNumber,
        jobTitle: form.jobTitle,
        jobLocation: form.jobLocation,
        jobType: form.jobType,
        salary: form.salary,
        experience: form.experience,
        skills: form.skills
          ? form.skills.split(",").map((s) => s.trim())
          : [],
        password: form.password,
        status: form.status,
        isPremium: form.isPremium
      };

      if (isEdit) {

        const userId = user?.userId || (user as any)?.user_id;

if (!userId) {
  console.error("❌ Missing userId", user);
  return;
}

await updateUser(userId, data);

        await updateUser(user.userId, data);
        console.log("✅ USER UPDATED");

      } else {

        await createUser(data);
        console.log("✅ USER CREATED");

      }

      if (onSuccess) await onSuccess();

      onClose();

    } catch (err) {

      console.error("❌ USER SAVE FAILED", err);

    } finally {

      setLoading(false);

    }

  };

  /* ================= UI ================= */

  return (

    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">

      <div className="bg-surface-card border border-slate-700 rounded-xl w-full max-w-xl">

        {/* HEADER */}

        <div className="flex justify-between items-center p-4 border-b border-slate-800">

          <h2 className="text-lg font-semibold text-white">
            {isEdit ? "Edit User" : "Create New User"}
          </h2>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>

        </div>

        {/* FORM */}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          <Input
            label="Full Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <Input
            label="Email Address"
            type="email"
            value={form.email}
            disabled={isEdit}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <Input
            label="Mobile Number"
            value={form.contactNumber}
            onChange={(e) =>
              setForm({ ...form, contactNumber: e.target.value })
            }
          />

          <Input
            label="Job Title"
            value={form.jobTitle}
            onChange={(e) =>
              setForm({ ...form, jobTitle: e.target.value })
            }
          />

          <Input
            label="Job Location"
            value={form.jobLocation}
            onChange={(e) =>
              setForm({ ...form, jobLocation: e.target.value })
            }
          />

          <Input
            label="Job Type"
            value={form.jobType}
            onChange={(e) =>
              setForm({ ...form, jobType: e.target.value })
            }
          />

          <Input
            label="Salary"
            value={form.salary}
            onChange={(e) =>
              setForm({ ...form, salary: e.target.value })
            }
          />

          <Input
            label="Experience"
            value={form.experience}
            onChange={(e) =>
              setForm({ ...form, experience: e.target.value })
            }
          />

          <Input
            label="Skills (comma separated)"
            value={form.skills}
            onChange={(e) =>
              setForm({ ...form, skills: e.target.value })
            }
          />

          <Input
            label={isEdit ? "Reset Password" : "Password"}
            type="password"
            value={form.password}
            placeholder={isEdit ? "Leave blank to keep current" : ""}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <div className="pt-2">
            <Toggle
              label="Premium User Account"
              checked={form.isPremium}
              onChange={(checked) =>
                setForm({ ...form, isPremium: checked })
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
                ? "Save Changes"
                : "Create User"}
            </Button>

          </div>

        </form>

      </div>

    </div>

  );

};