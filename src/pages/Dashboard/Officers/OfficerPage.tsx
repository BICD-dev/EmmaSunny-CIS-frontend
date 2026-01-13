import React, { useState } from "react";
import Layout from "../../../components/Layout/Layout";
import {
  Search,
  Filter,
  Plus,
  Shield,
  Mail,
  Phone,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  Package,
} from "lucide-react";
import { useDeleteOfficer, useOfficers } from "../../../hooks/useOfficer";
import type { Officer } from "../../../api/officerApi";
import AddOfficerModal from "../../../components/AddOfficer";
interface Officers {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: "admin" | "staff";
  createdAt: string;
}

const OfficersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const {
    data: officerData,
    isError,
    isLoading,
    isSuccess,
    error,
  } = useOfficers();
  const changeStatusMutation = useDeleteOfficer();

  const officers =
    officerData?.map((officer: Officer) => ({
      id: officer.id,
      fullName: officer.first_name + " " + officer.last_name,
      phoneNumber: officer.phone,
      role: officer.role as "admin" | "staff",
      email: officer.email,
      status: officer.status,
      createdAt: officer.created_at,
    })) || [];

  const filteredOfficers = officers.filter(
    (officer) =>
      officer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      officer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalResults = filteredOfficers.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalResults);
  const paginatedOfficers = filteredOfficers.slice(startIndex, endIndex);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const getRoleBadge = (role: string) => {
    return role === "Admin"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-blue-100 text-blue-700";
  };

  const getStatusBadge = (status: string) => {
    return status === "Active"
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-700";
  };

  // Loading State
  if (isLoading) {
    return (
      <Layout
        activePage="officers"
        pageTitle="Manage Officers"
        pageSubtitle="Manage system users and their permissions"
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
  if (isError) {
    return (
      <Layout
        activePage="officers"
        pageTitle="Manage Officers"
        pageSubtitle="Manage system users and their permissions"
      >
        <div className="w-full">
          <div className="bg-white rounded-2xl border border-red-200 p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Failed to Load Officers details
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
    const handleDelete = async (id:string)=>{
    changeStatusMutation.mutate(id);
  }
  return (
    <Layout
      activePage="officers"
      pageTitle="Manage Officers"
      pageSubtitle="Manage system users and their permissions"
    >
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search officers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-80"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
          </button>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Officer
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <Shield className="w-6 h-6" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 font-mono mb-1">
            {officers.length}
          </div>
          <div className="text-sm text-slate-500 font-medium">
            Total Officers
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <Shield className="w-6 h-6" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 font-mono mb-1">
            {officers.filter((o) => o.role === "admin").length}
          </div>
          <div className="text-sm text-slate-500 font-medium">
            Administrators
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <Shield className="w-6 h-6" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 font-mono mb-1">
            {officers.filter((o) => o.role === "staff").length}
          </div>
          <div className="text-sm text-slate-500 font-medium">
            Staff Members
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-green-50 text-green-600">
              <Shield className="w-6 h-6" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 font-mono mb-1">
            3
          </div>
          <div className="text-sm text-slate-500 font-medium">Active Now</div>
        </div>
      </div>

      {/* Officers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Officer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedOfficers.map((officer) => (
                <tr
                  key={officer.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                        {officer.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {officer.fullName}
                        </p>
                        <p className="text-sm text-slate-500">
                          Joined{" "}
                          {new Date(officer.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <Mail className="w-4 h-4 text-slate-400" />
                        {officer.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <Phone className="w-4 h-4 text-slate-400" />
                        {officer.phoneNumber}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${getRoleBadge(
                        officer.role
                      )}`}
                    >
                      {officer.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      

                        <span
                          className={`px-4 py-2 rounded-xl text-sm font-semibold mt-2 ${
                            officer?.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {officer?.status === "active" ? "Active" : "Inactive"}
                        </span>
                      <button
                      onClick={()=>handleDelete(officer.id)}
                      className="flex items-center gap-2 center p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600 hover:text-blue-600 cursor-pointer">
                        <Edit className="w-4 h-4" />
                        Change Officer Status
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Showing <span className="font-semibold">{totalResults === 0 ? 0 : startIndex + 1}</span> to <span className="font-semibold">{endIndex}</span> of <span className="font-semibold">{totalResults}</span> results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage <= 1}
            >
              Previous
            </button>

            {/* Page numbers (show up to 7 buttons) */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 50).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${p === currentPage ? 'bg-emerald-600 text-white' : 'border border-slate-200 hover:bg-slate-50'}`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Officer Modal Placeholder */}
      {showAddModal && (
        <AddOfficerModal onClose={() => setShowAddModal(false)} />
      )}
    </Layout>
  );
};

export default OfficersPage;
