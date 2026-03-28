import React, { useEffect, useState } from "react";
import { Check, X, Edit, Power, RotateCcw } from "lucide-react";

import { User, UserStatus } from "../types";
import { StatusBadge, Toggle } from "./UI";
import { getAllUsers } from "../api/adminUserApi";

interface UserTableProps {
  users?: User[];
  onApprove: (user: User) => void;
  onReject: (user: User) => void;
  onEdit: (user: User) => void;
  onDeactivate: (user: User) => void;
  onReactivate: (user: User) => void;
  onTogglePremium: (user: User, newValue: boolean) => void;
  isPendingView: boolean;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onApprove,
  onReject,
  onEdit,
  onDeactivate,
  onReactivate,
  onTogglePremium,
  isPendingView
}) => {

  const [internalUsers, setInternalUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH USERS ================= */

  useEffect(() => {

    console.log("Users prop received:", users);

    if (users && users.length > 0) {
      console.log("Using users from props");
      setInternalUsers(users);
      return;
    }

    const fetchUsers = async () => {

      try {

        setLoading(true);

        console.log("Fetching users from API...");

        const fetchedUsers = await getAllUsers();

        console.log("Fetched Users:", fetchedUsers);

        setInternalUsers(fetchedUsers);

      } catch (err) {

        console.error("❌ Failed to load users:", err);

      } finally {

        setLoading(false);

      }

    };

    fetchUsers();

  }, [users]);

  /* ================= FINAL DATA ================= */

  const rawData =
  users && users.length > 0
    ? users
    : internalUsers;

/* hide deactivated users from UI */
const data = rawData.filter(
  (u) => u.status !== UserStatus.DEACTIVATED
);
  console.log("TABLE DATA:", data);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-400">
        Loading users...
      </div>
    );
  }

  /* ================= EMPTY ================= */

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-20 bg-surface-card rounded-xl border border-slate-800 border-dashed">
        <div className="text-slate-500 mb-2">No users found</div>
        <div className="text-sm text-slate-600">
          Try adding a new user.
        </div>
      </div>
    );
  }

  

  /* ================= TABLE ================= */

  return (

    <div className="bg-surface-card border border-slate-800 rounded-xl overflow-hidden shadow-sm">

      <div className="overflow-x-auto">

        <table className="min-w-full divide-y divide-slate-800">

          {/* HEADER */}

          <thead className="bg-slate-900/50">

            <tr>

              <th className="px-6 py-4 text-left text-xs text-slate-400 uppercase">
                User
              </th>

              <th className="px-6 py-4 text-left text-xs text-slate-400 uppercase">
                Contact
              </th>

              <th className="px-6 py-4 text-left text-xs text-slate-400 uppercase">
                Position
              </th>

              <th className="px-6 py-4 text-left text-xs text-slate-400 uppercase">
                Location
              </th>

              <th className="px-6 py-4 text-left text-xs text-slate-400 uppercase">
                Experience
              </th>

              <th className="px-6 py-4 text-left text-xs text-slate-400 uppercase">
                Salary
              </th>

              <th className="px-6 py-4 text-left text-xs text-slate-400 uppercase">
                Joined
              </th>

              <th className="px-6 py-4 text-left text-xs text-slate-400 uppercase">
                Status
              </th>

              <th className="px-6 py-4 text-left text-xs text-slate-400 uppercase">
                Premium
              </th>

              <th className="px-6 py-4 text-right text-xs text-slate-400 uppercase">
                Actions
              </th>

            </tr>

          </thead>

          {/* BODY */}

          <tbody className="divide-y divide-slate-800">

            {data.map((user) => {

              console.log("Rendering User Row:", user);

              if (!user?.user_id) {

                console.warn("User missing userId:", user);

                return null;

              }

              const firstLetter =
                user.name?.charAt(0).toUpperCase() || "?";

              return (

                <tr key={user.user_id} className="hover:bg-slate-800/50">

                  {/* USER */}

                  <td className="px-6 py-4">

                    <div className="flex items-center">

                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-neon-green font-bold">
                        {firstLetter}
                      </div>

                      <div className="ml-4">

                        <div className="text-sm text-white">
                          {user.name || "-"}
                        </div>

                        <div className="text-xs text-slate-500">
                          {user.email}
                        </div>

                      </div>

                    </div>

                  </td>

                  {/* CONTACT */}

                  <td className="px-6 py-4 text-sm text-slate-300">
                    {user.contact_number || "-"}
                  </td>

                  {/* JOB */}

                  <td className="px-6 py-4 text-sm text-slate-300">
                    {user.job_title || "-"}
                  </td>

                  {/* LOCATION */}

                  <td className="px-6 py-4 text-sm text-slate-300">
                    {user.job_location || "-"}
                  </td>

                  {/* EXPERIENCE */}

                  <td className="px-6 py-4 text-sm text-slate-300">
                    {user.experience || "-"}
                  </td>

                  {/* SALARY */}

                  <td className="px-6 py-4 text-sm text-slate-300">
                    {user.salary || "-"}
                  </td>

                  {/* JOINED */}

                  <td className="px-6 py-4 text-slate-400">

  {(user.createdAt ?? user.created_at)
    ? new Date(user.createdAt ?? user.created_at).toLocaleDateString()
    : "-"}

</td>

                  {/* STATUS */}

                  <td className="px-6 py-4">
                    <StatusBadge status={user.status} />
                  </td>

                  {/* PREMIUM */}

                  <td className="px-6 py-4">

  {!isPendingView &&
  user.status !== UserStatus.REJECTED ? (

    <Toggle
      checked={Boolean(user.isPremium ?? user.is_premium)}
      onChange={(val) =>
        onTogglePremium(user, val)
      }
      disabled={
        user.status === UserStatus.DEACTIVATED
      }
    />

  ) : (

    <span className="text-slate-600 text-xs">-</span>

  )}

</td>

                  {/* ACTIONS */}

                  <td className="px-6 py-4 text-right">

                    <div className="flex justify-end gap-2">

                      {isPendingView ? (

                        <>
                          <button onClick={() => onApprove(user)}>
                            <Check size={18} />
                          </button>

                          <button onClick={() => onReject(user)}>
                            <X size={18} />
                          </button>
                        </>

                      ) : (

                        <>
                          <button onClick={() => onEdit(user)}>
                            <Edit size={18} />
                          </button>

                          {user.status === UserStatus.DEACTIVATED ? (

                            <button onClick={() => onReactivate(user)}>
                              <RotateCcw size={18} />
                            </button>

                          ) : (

                            <button onClick={() => onDeactivate(user)}>
                              <Power size={18} />
                            </button>

                          )}

                        </>

                      )}

                    </div>

                  </td>

                </tr>

              );

            })}

          </tbody>

        </table>

      </div>

    </div>

  );

};