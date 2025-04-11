import { Application } from "../../enum/ApplicationsResponse";

interface PendingCardProps {
  data: Application;
  onView: (application: Application) => void;
}

export default function PendingCard({ data, onView }: PendingCardProps) {
  return (
    <div className="relative p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-start">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
            {data.user.email}
          </h4>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Application ID
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                {data.id}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Document
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                {data.documentType.title}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            onClick={() => onView(data)}
            className="rounded-full border border-gray-300 bg-blue-100 text-blue-700 px-4 py-2 text-sm font-medium hover:bg-blue-200"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
