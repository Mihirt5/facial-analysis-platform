"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { CopyEmailButton } from "~/components/ui/copy-email-button";

type SubscriptionUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  createdAt: Date;
  subscription: {
    id: string;
    plan: string;
    status: string | null;
    periodStart: Date | null;
    periodEnd: Date | null;
  } | null;
};

interface SubscriptionUsersTableProps {
  users: SubscriptionUser[];
}

/**
 * This component is used to display a table of users who have active
 * subscriptions but haven't created any analyses yet.
 *
 * @param users - The users to display in the table.
 * @returns A table of users who have active subscriptions but haven't created
 * any analyses yet.
 */
export function SubscriptionUsersTable({ users }: SubscriptionUsersTableProps) {
  const formatUserId = (id: string) => {
    return id.substring(0, 8);
  };

  const calculateDelay = (periodStart: Date | null): string => {
    if (!periodStart) return "N/A";

    const now = new Date();
    const start = new Date(periodStart);
    const diffMs = now.getTime() - start.getTime();

    if (diffMs < 0) return "N/A";

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-md">
      <div className="px-4 py-4 sm:px-6 sm:py-5">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Subscribed Users Without Analyses
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Users who have active subscriptions but haven&apos;t created any
          analyses yet
        </p>
      </div>

      {/* Mobile Card Layout */}
      <div className="block sm:hidden">
        <div className="space-y-4 p-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="block rounded-lg border bg-gray-50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {user.image ? (
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={user.image}
                      alt={user.name}
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <span className="text-sm font-medium text-blue-600">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <div className="text-sm text-gray-500">
                      <CopyEmailButton email={user.email} />
                    </div>
                    <p className="text-sm text-gray-500">
                      ID: {formatUserId(user.id)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Period Start</p>
                  <p className="font-medium">
                    {user.subscription?.periodStart
                      ? new Date(
                          user.subscription.periodStart,
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Period End</p>
                  <p className="font-medium">
                    {user.subscription?.periodEnd
                      ? new Date(
                          user.subscription.periodEnd,
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Delay</p>
                  <p className="font-medium">
                    {calculateDelay(user.subscription?.periodStart ?? null)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden overflow-x-auto sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">User ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Period Start</TableHead>
              <TableHead>Period End</TableHead>
              <TableHead>Delay</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  {formatUserId(user.id)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {user.image ? (
                      <img
                        className="mr-3 h-8 w-8 rounded-full object-cover"
                        src={user.image}
                        alt={user.name}
                      />
                    ) : (
                      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                        <span className="text-sm font-medium text-blue-600">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span>{user.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <CopyEmailButton email={user.email} />
                </TableCell>
                <TableCell>
                  {user.subscription?.periodStart
                    ? new Date(user.subscription.periodStart).toLocaleString()
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {user.subscription?.periodEnd
                    ? new Date(user.subscription.periodEnd).toLocaleString()
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {calculateDelay(user.subscription?.periodStart ?? null)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
