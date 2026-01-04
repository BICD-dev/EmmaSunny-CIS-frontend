import { useState, useMemo } from "react";
import { useActivityLogs } from "../../../hooks/useOfficer";
import {
  Activity,
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar,
  AlertCircle,
  Loader2,
  Filter,
} from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import type { ActivityPayload } from "../../../api/officerApi";
import Layout from "../../../components/Layout/Layout";

const ActivityLogPage = () => {
  const { data: response, isLoading, isError, error, isSuccess } = useActivityLogs();
  
  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Format and map the data (memoized)
  const officers = useMemo(() => {
    
    const activityData = response || [];
    console.log("inside memo",activityData)
    return activityData.map((officer:ActivityPayload) => ({
      id: officer.id,
      officer_id: officer.officer_id,
      officer_name: officer.fullname,
      action: officer.action,
      created_at: officer.timestamp,
    }));
  }, [response]);
  // Filter based on search
  const filteredOfficers = useMemo(() => {
    if (!searchTerm) return officers;
    
    const lowerSearch = searchTerm.toLowerCase();
    return officers.filter(
      (officer) =>
        officer.officer_name.toLowerCase().includes(lowerSearch) ||
        officer.action.toLowerCase().includes(lowerSearch)
    );
  }, [officers, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredOfficers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOfficers = filteredOfficers.slice(startIndex, endIndex);

  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (isValid(date)) {
        return format(date, "MMM dd, yyyy 'at' hh:mm a");
      }
      return dateString;
    } catch {
      return dateString;
    }
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Loading State
  if (isLoading) {
    return (
      <Layout
                activePage="activity"
                pageTitle="View Activity Logs"
                pageSubtitle="View all activity made on the system by officers"
              >
      <div className="w-full">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {/* Header Skeleton */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse" />
              <div className="h-10 w-64 bg-slate-200 rounded-lg animate-pulse" />
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-200 rounded-lg animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/4 animate-pulse" />
                  <div className="h-3 bg-slate-200 rounded w-1/3 animate-pulse" />
                </div>
                <div className="h-4 bg-slate-200 rounded w-1/6 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
      </Layout>
    );
  }

  // Error State
  if (isError) {
    return (
      <Layout
                activePage="activity"
                pageTitle="View Activity Logs"
                pageSubtitle="View all activity made on the system by officers"
              >
      <div
        className="w-full"
      >
        <div className="bg-white rounded-2xl border border-red-200 p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Failed to Load Activity Logs
            </h3>
            <p className="text-slate-600 mb-4">
              {error?.message || "An error occurred while fetching the data."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
      </Layout>
    );
  }

  // Empty State
  if (officers.length === 0) {
    return (
      <Layout
                activePage="activity"
                pageTitle="View Activity Logs"
                pageSubtitle="View all activity made on the system by officers"
              >
      <div
        className="w-full"
      >
        <div className="bg-white rounded-2xl border border-slate-200 p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Activity className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              No Activity Logs Yet
            </h3>
            <p className="text-slate-600 max-w-md">
              Activity logs will appear here once officers start performing actions in the system.
            </p>
          </div>
        </div>
      </div>
      </Layout>
    );
  }
  return (
    <Layout
                activePage="activity"
                pageTitle="View Activity Logs"
                pageSubtitle="View all activity made on the system by officers"
              >
    <div
      className="w-full"
    >
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Header Section */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Activity Logs</h2>
                <p className="text-sm text-slate-600">
                  {filteredOfficers.length} total {filteredOfficers.length === 1 ? "activity" : "activities"}
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by officer name or action..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Officer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Action Taken
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
                {currentOfficers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Filter className="w-12 h-12 text-slate-300 mb-3" />
                        <p className="text-slate-600 font-medium">No results found</p>
                        <p className="text-sm text-slate-500 mt-1">
                          Try adjusting your search criteria
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentOfficers.map((officer, index) => (
                    <tr key={officer.id}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      {/* Officer Info */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:shadow-lg transition-shadow">
                            {getInitials(officer.officer_name)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {officer.officer_name}
                            </p>
                            <p className="text-xs text-slate-500">
                              Order of Activity: {officer.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-2">
                          <Activity className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-slate-700 line-clamp-2">
                            {officer.action}
                          </span>
                        </div>
                      </td>

                      {/* Timestamp */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {formatDate(officer.created_at)}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredOfficers.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Results Info */}
              <div className="text-sm text-slate-600">
                Showing{" "}
                <span className="font-semibold text-slate-900">
                  {startIndex + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-slate-900">
                  {Math.min(endIndex, filteredOfficers.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-900">
                  {filteredOfficers.length}
                </span>{" "}
                results
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 border border-slate-300 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-600" />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    // Show first page, last page, current page, and pages around current
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? "bg-emerald-600 text-white shadow-md"
                              : "border border-slate-300 hover:bg-white text-slate-700"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      pageNum === currentPage - 2 ||
                      pageNum === currentPage + 2
                    ) {
                      return (
                        <span key={pageNum} className="px-2 text-slate-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-slate-300 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </Layout>
  );
};

export default ActivityLogPage;