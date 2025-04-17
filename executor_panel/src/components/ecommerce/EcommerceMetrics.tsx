import { useEffect, useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import { baseUrl } from "../../utils/constants";
import { calculateDaysAgo } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import { ApplicationStatus } from "../../enum/ApplicationStatus";

const NotificationCard = ({ notification }) => {
  const navigate = useNavigate();

  // Generalized action texts
  const actionText =
    notification.applicationStatus === 0
      ? `${notification.documentType.title} application received from user`
      : notification.applicationStatus === 1
      ? `Approved ${notification.documentType.title} for ${notification.user.name}`
      : `Rejected ${notification.documentType.title} for ${notification.user.name}`;

  const daysAgo = calculateDaysAgo(notification.updatedAt); // Calculate days ago

  const borderClass =
    notification.applicationStatus === ApplicationStatus.PENDING
      ? `text-orange-400`
      : notification.applicationStatus === ApplicationStatus.APPROVED
      ? "text-green-800"
      : "text-red-800";
  return (
    <div
      className={`cursor-pointer w-full bg-gray-800 text-white border border-gray-600 p-4 mb-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ${""}`}
      onClick={() => {
        navigate("/applications");
      }}
    >
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h3 className={`text-lg font-semibold ${borderClass}`}>
            {actionText}
          </h3>
          <p className="text-sm text-gray-200 mt-2">
            User: {notification.user.email}
          </p>
          <p className="mt-2">
            {notification.applicationStatus === 0
              ? notification.coverLetter
              : notification.remarks}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-xs text-gray-400">{daysAgo} days ago</p>
          {notification.applicationStatus === 0 && (
            <ArrowDownIcon className="w-5 h-5 text-yellow-400" />
          )}
          {notification.applicationStatus === 1 && (
            <ArrowUpIcon className="w-5 h-5 text-green-500" />
          )}
          {notification.applicationStatus === 2 && (
            <ArrowDownIcon className="w-5 h-5 text-red-500" />
          )}
        </div>
      </div>
    </div>
  );
};

export default function EcommerceMetrics() {
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const [notifications, setNotifications] = useState([]);

  const init = async () => {
    try {
      let res = await fetch(baseUrl + "/executive/stats", {
        credentials: "include",
      });
      let data = await res.json();
      setStats(data.body.stats);

      res = await fetch(baseUrl + "/executive/notifications", {
        credentials: "include",
      });
      data = await res.json();
      setNotifications(data.body);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-white">Stats</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        {/* <!-- Metric Item Start --> */}
        <div className="rounded-2xl border border-orange-300 bg-white p-5 dark:border-orange-400 dark:bg-white/[0.03] md:p-6 hover:bg-orange-200 hover:shadow-orange-200 hover:dark:shadow-orange-500 hover:shadow-lg  hover:border-orange-100 duration-300">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-200 dark:text-gray-200">
                Pending Applications
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {stats.pending}
              </h4>
            </div>
          </div>
        </div>
        {/* <!-- Metric Item End --> */}

        {/* <!-- Metric Item Start --> */}
        <div className="rounded-2xl border border-green-500  dark:border-green-800 bg-white p-5 dark:bg-white/[0.03] md:p-6 hover:bg-green-200 hover:shadow-green-200 hover:dark:shadow-green-800 hover:shadow-lg hover:border-red-100 duration-300">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-200">
                Approved Applications
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {stats.approved}
              </h4>
            </div>
          </div>
        </div>
        {/* <!-- Metric Item End --> */}
        <div className="rounded-2xl border border-red-500 bg-white p-5 dark:border-red-800 dark:bg-white/[0.03] md:p-6 hover:bg-red-200 hover:shadow-red-200 hover:dark:shadow-red-800 hover:shadow-lg hover:border-green-100 duration-300">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-200">
                Rejected Applications
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {stats.rejected}
              </h4>
            </div>

            {/* <Badge color="error">
            <ArrowDownIcon />
            9.05%
          </Badge> */}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-6 text-white">Updates</h2>
        {notifications.map((notification) => (
          <NotificationCard key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  );
}
