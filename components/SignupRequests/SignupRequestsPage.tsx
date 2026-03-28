import React from "react";
import { User } from "../../types";
import { PendingUsersTable } from "./PendingUsersTable";

interface Props {
  users: User[];
  onApprove: (user: User) => void;
  onReject: (user: User) => void;
  onEdit: (user: User) => void;
}

export const SignupRequestsPage: React.FC<Props> = ({
  users,
  onApprove,
  onReject,
  onEdit
}) => {

  return (
    <div className="animate-fadeIn">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">
          Signup Requests
        </h1>
      </div>

      <PendingUsersTable
        users={users}
        onApprove={onApprove}
        onReject={onReject}
        onEdit={onEdit}
      />

    </div>
  );
};