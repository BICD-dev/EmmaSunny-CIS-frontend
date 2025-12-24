import React, { useState } from "react";
import * as yup from "yup";
import { type CreateProductData } from "../api/productApi";
import { useCreateProduct } from "../hooks/useProduct";
import { X } from "lucide-react";
interface AddProductModalProps {
  onClose: () => void;
}
const productSchema = yup.object({
  name: yup.string().trim().required("Product name is required"),
  price: yup.string().trim().required("Product Price is required"),
  description: yup.string().trim().required("Product description is required"),
});
const AddProductModal: React.FC<AddProductModalProps> = ({ onClose }) => {
  const createProduct = useCreateProduct();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate with Yup
      await productSchema.validate(formData, { abortEarly: false });
      setErrors({});

      createProduct.mutate(formData, {
        onSuccess: () => {
          onClose();
        },
      });
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const formErrors: Record<string, string> = {};

        err.inner.forEach((error) => {
          if (error.path) {
            formErrors[error.path] = error.message;
          }
        });

        setErrors(formErrors);
      }
    }
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Add New Product</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            disabled={createProduct.isPending}
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                onChange={handleChange}
                placeholder="e.g., Premium Health Insurance"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Product description..."
                name="description"
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Price (NGN)
                </label>
                <input
                  type="number"
                  placeholder="5000"
                  name="price"
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {errors.price && (
                <p className="text-red-500 text-xs mt-1">{errors.price}</p>
              )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Validity (years)
                </label>
                <input
                  type="number"
                  name="valid_period"
                  value="1"
                  placeholder="1"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
              {/* API Error Message */}
          {createProduct.isError && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm">
                {createProduct.error?.response?.data?.message ||
                  'Failed to create Product. Please try again.'}
              </p>
            </div>
          )}
             {/* Action Buttons */}
          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              disabled={createProduct.isPending}
              className="flex-1 px-6 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createProduct.isPending}
              className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createProduct.isPending ? 'Creating Product...' : 'Create Product'}
            </button>
          </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
