import React, { useState } from 'react';
import Layout from '../../../components/Layout/layout';
import { 
  Search, 
  Filter, 
  Plus, 
  Package, 
  Edit, 
  Trash2, 
  Eye,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  ShoppingCart
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  category: 'ID Card' | 'Renewal' | 'Replacement' | 'Add-on';
  price: number;
  currency: string;
  validityPeriod: number; // in months
  status: 'Active' | 'Inactive';
  soldCount: number;
  createdAt: string;
  features: string[];
}

const ProductPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data
  const products: Product[] = [
    {
      id: '1',
      name: 'Standard ID Card',
      description: 'Basic identification card valid for 1 year',
      category: 'ID Card',
      price: 5000,
      currency: 'NGN',
      validityPeriod: 12,
      status: 'Active',
      soldCount: 1847,
      createdAt: '2024-01-01',
      features: ['Photo ID', 'QR Code', 'Barcode', '1 Year Validity'],
    },
    {
      id: '2',
      name: 'Premium ID Card',
      description: 'Enhanced ID card with extended validity',
      category: 'ID Card',
      price: 8500,
      currency: 'NGN',
      validityPeriod: 24,
      status: 'Active',
      soldCount: 542,
      createdAt: '2024-01-01',
      features: ['Photo ID', 'QR Code', 'Barcode', '2 Years Validity', 'Priority Support'],
    },
    {
      id: '3',
      name: 'ID Card Renewal',
      description: 'Renew existing ID card for another year',
      category: 'Renewal',
      price: 3500,
      currency: 'NGN',
      validityPeriod: 12,
      status: 'Active',
      soldCount: 823,
      createdAt: '2024-01-15',
      features: ['Same Customer Code', 'Updated Photo', '1 Year Extension'],
    },
    {
      id: '4',
      name: 'Replacement Card',
      description: 'Replace lost or damaged ID card',
      category: 'Replacement',
      price: 4000,
      currency: 'NGN',
      validityPeriod: 0,
      status: 'Active',
      soldCount: 156,
      createdAt: '2024-02-01',
      features: ['Same Expiry Date', 'New Physical Card', 'Urgent Processing'],
    },
    {
      id: '5',
      name: 'Digital ID Copy',
      description: 'Digital backup of ID card',
      category: 'Add-on',
      price: 1000,
      currency: 'NGN',
      validityPeriod: 0,
      status: 'Active',
      soldCount: 389,
      createdAt: '2024-03-01',
      features: ['PDF Download', 'Email Delivery', 'Watermarked'],
    },
    {
      id: '6',
      name: 'Corporate Package',
      description: 'Bulk ID cards for organizations',
      category: 'ID Card',
      price: 4200,
      currency: 'NGN',
      validityPeriod: 12,
      status: 'Active',
      soldCount: 94,
      createdAt: '2024-04-01',
      features: ['Minimum 10 Cards', 'Company Branding', 'Dedicated Support', 'Bulk Discount'],
    },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const totalRevenue = products.reduce((sum, product) => sum + (product.price * product.soldCount), 0);
  const totalSold = products.reduce((sum, product) => sum + product.soldCount, 0);
  const activeProducts = products.filter(p => p.status === 'Active').length;

  const getCategoryBadge = (category: string) => {
    const categoryConfig: Record<string, { bg: string; text: string }> = {
      'ID Card': { bg: 'bg-emerald-100', text: 'text-emerald-700' },
      'Renewal': { bg: 'bg-blue-100', text: 'text-blue-700' },
      'Replacement': { bg: 'bg-amber-100', text: 'text-amber-700' },
      'Add-on': { bg: 'bg-purple-100', text: 'text-purple-700' },
    };
    return categoryConfig[category] || categoryConfig['ID Card'];
  };

  const getStatusBadge = (status: string) => {
    return status === 'Active'
      ? 'bg-green-100 text-green-700'
      : 'bg-gray-100 text-gray-700';
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${currency} ${amount.toLocaleString()}`;
  };

  return (
    <Layout
      activePage="products"
      pageTitle="Products & Services"
      pageSubtitle="Manage ID card products, pricing, and packages"
    >
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
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
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 mb-6 animate-enter">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Filter Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Categories</option>
                <option value="ID Card">ID Card</option>
                <option value="Renewal">Renewal</option>
                <option value="Replacement">Replacement</option>
                <option value="Add-on">Add-on</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
              <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Price Range</label>
              <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option>All Prices</option>
                <option>Under ₦5,000</option>
                <option>₦5,000 - ₦10,000</option>
                <option>Above ₦10,000</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <Package className="w-6 h-6" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900 font-mono mb-1">{products.length}</div>
          <div className="text-sm text-slate-500 font-medium">Total Products</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-green-50 text-green-600">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 font-mono mb-1">{activeProducts}</div>
          <div className="text-sm text-slate-500 font-medium">Active Products</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900 font-mono mb-1">{totalSold.toLocaleString()}</div>
          <div className="text-sm text-slate-500 font-medium">Total Sales</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
              <DollarSign className="w-6 h-6" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono mb-1">
            ₦{(totalRevenue / 1000000).toFixed(2)}M
          </div>
          <div className="text-sm text-slate-500 font-medium">Total Revenue</div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
          >
            {/* Product Header */}
            <div className="p-6 border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white">
              <div className="flex items-start justify-between mb-3">
                <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <Package className="w-6 h-6" />
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getCategoryBadge(product.category).bg} ${getCategoryBadge(product.category).text}`}>
                    {product.category}
                  </span>
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getStatusBadge(product.status)}`}>
                    {product.status}
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{product.name}</h3>
              <p className="text-sm text-slate-600 line-clamp-2">{product.description}</p>
            </div>

            {/* Product Body */}
            <div className="p-6">
              {/* Price and Validity */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Price
                  </p>
                  <p className="text-2xl font-bold text-emerald-600 font-mono">
                    {formatCurrency(product.price, product.currency)}
                  </p>
                </div>
                {product.validityPeriod > 0 && (
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Validity
                    </p>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-semibold">{product.validityPeriod} months</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Features
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.features.slice(0, 3).map((feature, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-slate-100 rounded-lg text-xs text-slate-700 font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                  {product.features.length > 3 && (
                    <span className="px-2 py-1 bg-slate-100 rounded-lg text-xs text-slate-700 font-medium">
                      +{product.features.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Sales Info */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-600">Sales</span>
                </div>
                <span className="text-sm font-bold text-slate-900 font-mono">
                  {product.soldCount.toLocaleString()}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium">
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-sm font-medium">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button className="p-2.5 border border-slate-200 rounded-xl hover:bg-red-50 hover:border-red-200 transition-colors text-slate-600 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Add New Product</h3>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Premium ID Card"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Category
                  </label>
                  <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option>ID Card</option>
                    <option>Renewal</option>
                    <option>Replacement</option>
                    <option>Add-on</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Product description..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Price (NGN)
                  </label>
                  <input
                    type="number"
                    placeholder="5000"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Validity (months)
                  </label>
                  <input
                    type="number"
                    placeholder="12"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Features (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Photo ID, QR Code, Barcode"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-6 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium">
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ProductPage;