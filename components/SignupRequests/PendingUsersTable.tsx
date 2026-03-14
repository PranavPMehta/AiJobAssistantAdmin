import React from "react";
import { User } from "../../types";
import { UserTable } from "../UserTable";

interface Props {
  users: User[];
  onApprove: (user: User) => void;
  onReject: (user: User) => void;
  onEdit: (user: User) => void;
}

export const PendingUsersTable: React.FC<Props> = ({
  users,
  onApprove,
  onReject,
  onEdit
}) => {
  return (
    <UserTable
      users={users}
      isPendingView={true}
      onApprove={onApprove}
      onReject={onReject}
      onEdit={onEdit}
      onDeactivate={() => {}}
      onReactivate={() => {}}
      onTogglePremium={() => {}}
    />
  );
};