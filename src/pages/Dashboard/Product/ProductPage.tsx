import React, { useState } from 'react';
import Layout from '../../../components/Layout/Layout';
import { 
  Search, 
  Filter, 
  Plus, 
  Package, 
  Edit, 
  Trash2, 
  Eye,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { useProducts, useDeleteProduct } from '../../../hooks/useProduct';
import type { Product  } from '../../../api/productApi';
import AddProductModal from '../../../components/AddProduct';


const ProductPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { data: productResponse, isLoading: isLoadingProducts , isError: isErrorProducts, isSuccess: isSuccessProducts } = useProducts();
  const deleteMutation = useDeleteProduct(); //to delete

  // using data from api
const products:Product[] = productResponse?.map((product) => ({
  id: product.id,
  product_name: product.product_name,
  description: product.description,
  price: product.price,
  valid_period: product.valid_period,
  created_at: product.created_at,
  updated_at:product.updated_at
})) || [];
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });


  const formatCurrency = (amount: number, currency: string) => {
    return `${currency} ${amount.toLocaleString()}`;
  };
  const handleDelete = async (id:string)=>{
    deleteMutation.mutate(id);
  }
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
      <div className="grid grid-cols-1 gap-6 mb-6">
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

        

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group  w-[20rem]"
          >
            {/* Product Header */}
            <div className="p-6 border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white">
              <div className="flex items-start justify-between mb-3">
                <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <Package className="w-6 h-6" />
                </div>
                
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{product.product_name}</h3>
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
                    {formatCurrency(Number(product.price), "NGN")}
                  </p>
                </div>
                {product.valid_period > 0 && (
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Validity
                    </p>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-semibold">{product.valid_period} {`year(s)`}</span>
                    </div>
                  </div>
                )}
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
                <button
                onClick={()=>handleDelete(product.id)}
                className="p-2.5 border border-slate-200 rounded-xl hover:bg-red-50 hover:border-red-200 transition-colors text-slate-600 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <AddProductModal onClose={()=>setShowAddModal(false)}/>
      )}
      </div>
    </Layout>
  );
};

export default ProductPage;