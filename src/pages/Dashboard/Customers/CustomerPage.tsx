import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/Layout/Layout';
import { Search, Filter, Plus, Users, Eye, Edit, Trash2, Download, Calendar, Phone, Mail, MoveRight, MoveLeft } from 'lucide-react';
import { useCustomers, useCustomerStatistics, useDeleteCustomer, useDownloadCustomerCsv } from '../../../hooks/useCustomer';
import { customerApi, type Customer } from '../../../api/customerApi';
import AddCustomerModal from '../../../components/AddCustomer';
import EditCustomerModal from '../../../components/EditCustomerModal';
const CustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Expired'>('All');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  // Fetch data using TanStack Query
  const { data: statistics, isLoading: statsLoading, isError: statsError } = useCustomerStatistics();
  const { data: customersData, isLoading: customersLoading, isError: customersError } = useCustomers();
  const downloadCsv = useDownloadCustomerCsv()
  const {mutateAsync:deleteMutation} = useDeleteCustomer()
  
  // Transform API data to match component interface
  const customers = customersData?.map((customer: Customer) => ({
    id: customer.id,
    customerCode: customer.customer_code,
    fullName: `${customer.first_name} ${customer.last_name}`,
    email: customer.email,
    phone: customer.phone,
    dateOfBirth: customer.DateOfBirth || '',
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

    // Pagination logic
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex);

  // handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
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
          <button
          onClick={()=>downloadCsv.mutate()}
          className="cursor-pointer flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
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
                currentCustomers.map((customer) => (
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
                        onClick={()=>deleteMutation(customer.id)}
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
        {filteredCustomers.length > 0 && (
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
                  {Math.min(endIndex, filteredCustomers.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-900">
                  {filteredCustomers.length}
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
                  <MoveLeft className="w-5 h-5 text-slate-600" />
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
                  <MoveRight className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>
          </div>
        )}

        {showAddModal && (
          <AddCustomerModal onClose={()=>setShowAddModal(false)}/>
        )}
        {/* {editModal && (
          // <EditCustomerModal onClose={()=>setEditModal(false)} customer_id={} />
        )} */}
      </div>
    </Layout>
  );
};

export default CustomersPage;