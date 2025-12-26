import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/Layout/Layout';
import { Search, Filter, Plus, Users, Eye, Edit, Trash2, Download, Calendar, Phone, Mail } from 'lucide-react';
import { useCustomers, useCustomerStatistics } from '../../../hooks/useCustomer';
import type { Customer } from '../../../api/customerApi';
import AddCustomerModal from '../../../components/AddCustomer';
const CustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Expired'>('All');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false)
  // Fetch data using TanStack Query
  const { data: statistics, isLoading: statsLoading, isError: statsError } = useCustomerStatistics();
  const { data: customersData, isLoading: customersLoading, isError: customersError } = useCustomers();
  // Transform API data to match component interface
  const customers = customersData?.map((customer: Customer) => ({
    id: customer.id,
    customerCode: customer.customer_code,
    fullName: `${customer.first_name} ${customer.last_name}`,
    email: customer.email,
    phone: customer.phone,
    dateOfBirth: customer.date_of_birth || '',
    gender: customer.gender as 'Male' | 'Female',
    registrationDate: customer.created_at,
    expiryDate: customer.expiry_date || '',
    status: customer.is_active ? 'Active' : 'Expired',
    profileImage: customer.profile_image,
    productId: customer.product_id,
    officerId: customer.officer_id,
    lastVisit: customer.last_visit,
    product_name:customer.product.product_name
  })) || [];

  const filteredCustomers = customers?.filter(customer => {
    const matchesSearch = 
      customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.customerCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    return status === 'Active'
      ? 'bg-green-100 text-green-700'
      : 'bg-amber-100 text-amber-700';
  };

  const handleViewCustomer = (id: string) => {
    navigate(`/customers/${id}`);
  };

  // Loading state
  if (statsLoading || customersLoading) {
    return (
      <Layout
        activePage="customers"
        pageTitle="Manage Customers"
        pageSubtitle="View and manage all registered customers"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading customers...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (statsError || customersError) {
    return (
      <Layout
        activePage="customers"
        pageTitle="Manage Customers"
        pageSubtitle="View and manage all registered customers"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 font-semibold mb-2">Error loading customers</p>
            <p className="text-slate-600">Please try again later</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      activePage="customers"
      pageTitle="Manage Customers"
      pageSubtitle="View and manage all registered customers"
    >
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-80"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Export</span>
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 mb-6 animate-enter">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Filter Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Gender</label>
              <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option>All Genders</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Registration Date</label>
              <input
                type="date"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 font-mono mb-1">
            {statistics?.total_customers || 0}
          </div>
          <div className="text-sm text-slate-500 font-medium">Total Customers</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-green-50 text-green-600">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 font-mono mb-1">
            {statistics?.active_customers || 0}
          </div>
          <div className="text-sm text-slate-500 font-medium">Active IDs</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 font-mono mb-1">
            {statistics?.expired_customers || 0}
          </div>
          <div className="text-sm text-slate-500 font-medium">Expired IDs</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 font-mono mb-1">
            {statistics?.registered_this_month || 0}
          </div>
          <div className="text-sm text-slate-500 font-medium">This Month</div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Registration
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Expiry
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-slate-500">No customers found</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                          {customer.fullName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{customer.fullName}</p>
                          <p className="text-sm text-slate-500 font-mono">{customer.customerCode}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <Mail className="w-4 h-4 text-slate-400" />
                          {customer.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <Phone className="w-4 h-4 text-slate-400" />
                          {customer.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {new Date(customer.registrationDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {customer.expiryDate ? new Date(customer.expiryDate).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {customer.product_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getStatusBadge(customer.status)}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewCustomer(customer.id)}
                          className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600 hover:text-emerald-600"
                          title="View customer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600 hover:text-blue-600"
                          title="Edit customer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600 hover:text-red-600"
                          title="Delete customer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Showing <span className="font-semibold">1</span> to <span className="font-semibold">{filteredCustomers.length}</span> of{' '}
            <span className="font-semibold">{customers.length}</span> results
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
        {showAddModal && (
          <AddCustomerModal onClose={()=>setShowAddModal(false)}/>
        )}
      </div>
    </Layout>
  );
};

export default CustomersPage;