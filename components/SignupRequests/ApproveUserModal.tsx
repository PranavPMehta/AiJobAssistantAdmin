import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Input, Button, Toggle } from "../UI";
import { User } from "../../types";

/* =====================================================
   MODAL WRAPPER
===================================================== */

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">

      <div className="w-full max-w-md bg-surface-card border border-slate-700 rounded-xl">

        {/* HEADER */}

        <div className="flex justify-between items-center p-4 border-b border-slate-800">

          <h2 className="text-lg font-semibold text-white">{title}</h2>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X size={18} />
          </button>

        </div>

        {/* BODY */}

        <div className="p-6">{children}</div>

      </div>

    </div>
  );
};

/* =====================================================
   APPROVE USER MODAL
===================================================== */

interface ApproveUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string, isPremium: boolean) => void;
  user: User | null;
}

export const ApproveUserModal: React.FC<ApproveUserModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  user,
}) => {

  const [password, setPassword] = useState("");
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPassword("");
      setIsPremium(false);
    }
  }, [isOpen]);

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(password, isPremium);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Approve Registration">

      {/* USER INFO */}

      <div className="mb-6 bg-slate-800/50 p-4 rounded-lg border border-slate-700">

        <h3 className="text-sm font-semibold text-slate-300 mb-1">
          Applicant: {user.name}
        </h3>

        <p className="text-xs text-slate-500">
          {user.email} | {user.jobTitle || "Job Seeker"}
        </p>

      </div>

      {/* FORM */}

      <form onSubmit={handleSubmit} className="space-y-5">

        <Input
          label="Set Account Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter a secure password"
          required
        />

        <div className="bg-surface-main p-3 rounded-lg border border-slate-800">
          <Toggle
            label="Enable Premium Status"
            checked={isPremium}
            onChange={setIsPremium}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">

          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
          >
            Approve & Activate
          </Button>

        </div>

      </form>

    </Modal>
  );
};

/* =====================================================
   REJECT USER MODAL
===================================================== */

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export const RejectModal: React.FC<RejectModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {

  const [reason, setReason] = useState("");

  useEffect(() => {
    if (isOpen) {
      setReason("");
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(reason);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reject Application">

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>

          <label className="text-sm text-slate-400 mb-2 block">
            Reason for Rejection
          </label>

          <textarea
            className="w-full bg-surface-main border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 h-32 resize-none text-sm"
            placeholder="e.g., Incomplete documentation..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />

        </div>

        <div className="flex justify-end gap-3 pt-3">

          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="danger"
          >
            Reject User
          </Button>

        </div>

      </form>

    </Modal>
  );
};