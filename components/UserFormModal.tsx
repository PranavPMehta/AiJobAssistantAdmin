import React, { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";

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
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /* LOAD USER */

  useEffect(() => {

    if (user) {

      const userSkills = user.skills ?? [];

      setSkills(userSkills);

      setForm({
        name: user.name ?? "",
        email: user.email ?? "",
        contactNumber: user.contactNumber ?? "",
        jobTitle: user.jobTitle ?? "",
        jobLocation: user.jobLocation ?? "",
        jobType: user.jobType ?? "",
        salary: user.salary ?? "",
        experience: user.experience ?? "",
        skills: "",
        password: (user as any).password ?? "",   // admin can see password
        status: user.status ?? UserStatus.APPROVED,
        isPremium: (user as any).isPremium ?? (user as any).is_premium ?? false
      });

    } else {

      setForm(emptyForm);
      setSkills([]);

    }

  }, [user, open]);

  if (!open) return null;

  /* SKILLS HANDLER */

  const handleSkillKey = (e: React.KeyboardEvent<HTMLInputElement>) => {

    if (e.key === "," || e.key === "Enter") {

      e.preventDefault();

      const value = skillInput.trim();

      if (!value) return;

      if (!skills.includes(value)) {
        setSkills([...skills, value]);
      }

      setSkillInput("");

    }

  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  /* SUBMIT */

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
        skills: skills,
        password: form.password,
        status: form.status,
        isPremium: form.isPremium
      };

      if (isEdit) {

        const userId = user?.userId || (user as any)?.user_id;

        if (!userId) {
          console.error("Missing userId", user);
          return;
        }

        await updateUser(userId, data);

      } else {

        await createUser({
          name: form.name,
          email: form.email,
          contactNumber: form.contactNumber,
          jobTitle: form.jobTitle,   
          password: form.password,
          status: form.status,
          isPremium: form.isPremium
        });

      }

      if (onSuccess) await onSuccess();

      onClose();

    } catch (err) {

      console.error("USER SAVE FAILED", err);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">

      <div className="bg-surface-card border border-slate-700 rounded-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">

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

        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          className="p-6 space-y-4"
        >

          <Input
            label="Full Name"
            autoComplete="off"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <Input
            label="Email Address"
            type="email"
            autoComplete="new-email"
            value={form.email}
            disabled={isEdit}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <Input
            label="Mobile Number"
            autoComplete="off"
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

          {/* EDIT ONLY FIELDS */}

          {isEdit && (
            <>
              

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

              {/* SKILLS */}

              <div>

                <label className="text-sm text-slate-400 block mb-1">
                  Skills
                </label>

                <div className="flex flex-wrap gap-2 mb-2">

                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-slate-700 px-2 py-1 rounded text-sm flex items-center gap-1"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                      >
                        ×
                      </button>
                    </span>
                  ))}

                </div>

                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKey}
                  placeholder="Type skill and press comma"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />

              </div>

            </>
          )}

          {/* PASSWORD */}

          <div>

            <label className="text-sm text-slate-400 mb-1 block">
              Password
            </label>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                autoComplete="new-password"
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

            </div>

          </div>

          <Toggle
            label="Premium User Account"
            checked={form.isPremium}
            onChange={(checked) =>
              setForm({ ...form, isPremium: checked })
            }
          />

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