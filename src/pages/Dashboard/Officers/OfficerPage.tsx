import React, { useState } from 'react';
import Layout from '../../../components/Layout/Layout';
import { Search, Filter, Plus, Shield, Mail, Phone, Edit, Trash2, Eye } from 'lucide-react';
import { useOfficers } from '../../../hooks/useOfficer';
import type { Officer } from '../../../api/officerApi';
import AddOfficerModal from '../../../components/AddOfficer';
interface Officers {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: 'Admin' | 'Staff';
  createdAt: string;
}

const OfficersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const {data:officerData, isError, isLoading, isSuccess} = useOfficers();
  const officers = officerData?.map((officer: Officer)=>({
    id: officer.id,
    fullName: officer.first_name + ' ' + officer.last_name,
    phoneNumber: officer.phone,
    role: officer.role as 'Admin' | 'Staff',
    email: officer.email,
    createdAt: officer.created_at,
  })) || [];

  const filteredOfficers = officers.filter(officer =>
    officer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    officer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    return role === 'Admin'
      ? 'bg-emerald-100 text-emerald-700'
      : 'bg-blue-100 text-blue-700';
  };

  const getStatusBadge = (status: string) => {
    return status === 'Active'
      ? 'bg-green-100 text-green-700'
      : 'bg-gray-100 text-gray-700';
  };

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
          <div className="text-3xl font-bold text-slate-900 font-mono mb-1">4</div>
          <div className="text-sm text-slate-500 font-medium">Total Officers</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <Shield className="w-6 h-6" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 font-mono mb-1">1</div>
          <div className="text-sm text-slate-500 font-medium">Administrators</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <Shield className="w-6 h-6" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 font-mono mb-1">3</div>
          <div className="text-sm text-slate-500 font-medium">Staff Members</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-green-50 text-green-600">
              <Shield className="w-6 h-6" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 font-mono mb-1">3</div>
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
              {filteredOfficers.map((officer) => (
                <tr key={officer.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                        {officer.fullName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{officer.fullName}</p>
                        <p className="text-sm text-slate-500">
                          Joined {new Date(officer.createdAt).toLocaleDateString()}
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
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getRoleBadge(officer.role)}`}>
                      {officer.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600 hover:text-emerald-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600 hover:text-blue-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
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
            Showing <span className="font-semibold">1</span> to <span className="font-semibold">4</span> of{' '}
            <span className="font-semibold">4</span> results
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed" disabled>
              Previous
            </button>
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
              1
            </button>
            <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed" disabled>
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Officer Modal Placeholder */}
      {showAddModal && (
        <AddOfficerModal onClose={() => setShowAddModal(false)}/>
      )}
    </Layout>
  );
};

export default OfficersPage;