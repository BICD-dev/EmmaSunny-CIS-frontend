import React, { useState, useEffect, useRef } from 'react';
import { X, User, Mail, Phone, Shield, MapPin, Calendar, Package, Camera } from 'lucide-react';
import * as yup from 'yup';
import { useCustomer, useUpdateCustomer } from '../hooks/useCustomer';
import { useProducts } from '../hooks/useProduct';
import type { Product } from '../api/productApi';
import { toast } from 'react-hot-toast';

interface AddCustomerModalProps {
  onClose: () => void;
  customer_id: string;
}

/**
 * Yup validation schema
 */
const customerSchema = yup.object({
  profile_image: yup.mixed().required('Profile image is required'),
  first_name: yup.string().trim().required('First name is required'),
  last_name: yup.string().trim().required('Last name is required'),
  address: yup.string().trim().required('Address is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  phone: yup
    .string()
    .matches(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number format')
    .required('Phone is required'),
  gender: yup.string().required('Gender is required'),
  DateOfBirth: yup.string().required('Date of birth is required'),
  product_id: yup.string().required('A Product must be selected'),
});

const EditCustomerModal: React.FC<AddCustomerModalProps> = ({ onClose, customer_id }) => {
  const updateCustomer = useUpdateCustomer();
  const { data: productResponse, isLoading: productLoading, isError: productError } = useProducts();
  const { data: customerData, isLoading: customerLoading, isError: customerError } = useCustomer(customer_id);

  const initializedRef = useRef(false);
  const originalDataRef = useRef<Record<string, any> | null>(null);
  const [formData, setFormData] = useState(() => ({
    profile_image: undefined as unknown as File | string | undefined,
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    gender: '',
    DateOfBirth: '',
    address: '',
    product_id: '',
  }));

  // Populate form once when customerData loads
  useEffect(() => {
    if (customerData && !initializedRef.current) {
      initializedRef.current = true;
      setFormData((prev) => ({
        ...prev,
        profile_image: (customerData as any).profile_image ?? prev.profile_image,
        first_name: (customerData as any).first_name ?? prev.first_name,
        last_name: (customerData as any).last_name ?? prev.last_name,
        email: (customerData as any).email ?? prev.email,
        phone: (customerData as any).phone ?? prev.phone,
        gender: (customerData as any).gender ?? prev.gender,
        DateOfBirth: (customerData as any).DateOfBirth ?? prev.DateOfBirth,
        address: (customerData as any).address ?? prev.address,
        product_id: (customerData as any).product_id ?? prev.product_id,
      }));
      // store a plain snapshot for change detection
      originalDataRef.current = {
        profile_image: (customerData as any).profile_image,
        first_name: (customerData as any).first_name,
        last_name: (customerData as any).last_name,
        email: (customerData as any).email,
        phone: (customerData as any).phone,
        gender: (customerData as any).gender,
        DateOfBirth: (customerData as any).DateOfBirth,
        address: (customerData as any).address,
        product_id: (customerData as any).product_id,
      };
    }
  }, [customerData]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type (JPG, JPEG, PNG)
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, profile_image: 'Only JPG or PNG images are allowed' }));
      setFormData((prev: any) => ({ ...prev, profile_image: undefined }));
      setImagePreview(null);
      return;
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      setErrors((prev) => ({ ...prev, profile_image: 'Image size must be less than 2MB' }));
      setFormData((prev: any) => ({ ...prev, profile_image: undefined }));
      setImagePreview(null);
      return;
    }

    setFormData((prev: any) => ({ ...prev, profile_image: file }));
    setErrors((prev) => ({ ...prev, profile_image: '' }));

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate by merging original values with current form so required fields pass
      const mergedForValidation = {
        ...(originalDataRef.current || {}),
        ...formData,
      };
      await customerSchema.validate(mergedForValidation, { abortEarly: false });
      setErrors({});

      // Convert DateOfBirth to ISO-8601 DateTime
      const safeDob = (() => {
        try {
          const d = new Date(formData.DateOfBirth as string);
          const t = d.getTime();
          return Number.isFinite(t) ? d.toISOString() : undefined;
        } catch {
          return undefined;
        }
      })();

      // Build a diff object with only changed fields
      const original = originalDataRef.current || {};
      const changed: Record<string, any> = {};

      // helper to normalize string for comparison
      const norm = (v: any) => (v === undefined || v === null ? '' : String(v));

      Object.keys(formData).forEach((key) => {
        const newVal = (formData as any)[key];

        if (key === 'profile_image') {
          // include if user selected a new File
          if (newVal && typeof newVal !== 'string') {
            changed.profile_image = newVal;
          } else if (typeof newVal === 'string') {
            // compare paths (strip leading slashes)
            const a = (newVal || '').replace(/^\/+/, '');
            const b = (original.profile_image || '').replace(/^\/+/, '');
            if (a !== b) changed.profile_image = newVal;
          }
          return;
        }

        if (key === 'DateOfBirth') {
          // compare ISO strings
          const newIso = safeDob;
          const origIso = original.DateOfBirth || '';
          if ((newIso || '') !== String(origIso || '')) {
            changed.DateOfBirth = newIso;
          }
          return;
        }

        if (norm(newVal) !== norm((original as any)[key])) {
          changed[key] = newVal;
        }
      });

      if (Object.keys(changed).length === 0) {
        toast('No changes to update');
        return;
      }

      updateCustomer.mutate(
        { id: customer_id, data: changed },
        {
          onSuccess: () => {
            toast.success('Customer updated successfully!');
            onClose();
          },
          onError: (err: any) => {
            toast.error(err?.message || 'Failed to update customer');
          },
        }
      );
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

  if (customerLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Edit Customer Details</h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors" disabled={updateCustomer.isPending}>
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
          <div className="border border-red-500 bg-red-300 rounded-lg h-[60%] flex items-center justify-center">
            <span className="w-full text-center font-semibold text-2xl ">fetching Customer details</span>
          </div>
        </div>
      </div>
    );
  }

  if (customerError) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Edit Customer Details</h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors" disabled={updateCustomer.isPending}>
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
          <div className="border border-red-500 bg-red-300 rounded-lg h-[60%] flex items-center justify-center">
            <span className="w-full text-center font-semibold text-2xl ">Error fetching Customer details</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Edit Customer Details</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors" disabled={updateCustomer.isPending}>
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          {/* Profile Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                ) : typeof formData.profile_image === 'string' && formData.profile_image ? (
                  <img src={`${import.meta.env.VITE_API_URL}${formData.profile_image.replace(/^\/+/, '')}`} alt={`${formData.first_name ?? ''} ${formData.last_name ?? ''}`} className="w-32 h-32 rounded-2xl object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <User className="w-12 h-12" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-1 right-1 bg-emerald-600 p-2 rounded-full cursor-pointer hover:bg-emerald-700">
                <Camera className="w-4 h-4 text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
            <p className="text-xs text-slate-500 mt-2">Upload a clear passport-sized photo (JPG or PNG, max 2MB)</p>
            {errors.profile_image && <p className="text-red-500 text-xs mt-1">{errors.profile_image}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">First Name <span className="text-red-500">*</span></label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input type="text" name="first_name" value={formData.first_name ?? ''} onChange={handleChange} disabled={updateCustomer.isPending} className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.first_name ? 'border-red-500' : 'border-slate-200'}`} placeholder="John" />
              </div>
              {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name <span className="text-red-500">*</span></label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input type="text" name="last_name" value={formData.last_name ?? ''} onChange={handleChange} disabled={updateCustomer.isPending} className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.last_name ? 'border-red-500' : 'border-slate-200'}`} placeholder="Doe" />
              </div>
              {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email <span className="text-red-500">*</span></label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input type="email" name="email" value={formData.email ?? ''} onChange={handleChange} disabled={updateCustomer.isPending} className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.email ? 'border-red-500' : 'border-slate-200'}`} placeholder="john.doe@personal.com" />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Phone <span className="text-red-500">*</span></label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input type="tel" name="phone" value={formData.phone ?? ''} onChange={handleChange} disabled={updateCustomer.isPending} className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.phone ? 'border-red-500' : 'border-slate-200'}`} placeholder="+234-800-000-0000" />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Address - Full Width */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">House Address <span className="text-red-500">*</span></label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input type="text" name="address" value={formData.address ?? ''} onChange={handleChange} disabled={updateCustomer.isPending} className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.address ? 'border-red-500' : 'border-slate-200'}`} placeholder="123 Main Street, City, State" />
              </div>
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Gender <span className="text-red-500">*</span></label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <select name="gender" value={formData.gender ?? ''} onChange={handleChange} disabled={updateCustomer.isPending} className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none bg-white ${errors.gender ? 'border-red-500' : 'border-slate-200'}`}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Date Of Birth <span className="text-red-500">*</span></label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input type="date" name="DateOfBirth" value={formData.DateOfBirth ?? ''} onChange={handleChange} disabled={updateCustomer.isPending} className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.DateOfBirth ? 'border-red-500' : 'border-slate-200'}`} />
              </div>
              {errors.DateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.DateOfBirth}</p>}
            </div>

            {/* Product List */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Product <span className="text-red-500">*</span></label>
              {productLoading ? (
                <div className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 text-center">Loading products...</div>
              ) : productError ? (
                <div className="w-full px-4 py-2.5 border border-red-200 rounded-xl bg-red-50 text-red-600 text-center text-sm">Error loading products</div>
              ) : (
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <select name="product_id" value={formData.product_id ?? ''} onChange={handleChange} disabled={updateCustomer.isPending} className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none bg-white ${errors.product_id ? 'border-red-500' : 'border-slate-200'}`}>
                    <option value="">Select a product</option>
                    {(Array.isArray(productResponse) ? productResponse.filter((product) => product.status === 'active') : []).map((product: Product) => (
                      <option key={product.id} value={product.id}>
                        {product.product_name} - ₦{parseInt(String(product.price || '0')).toLocaleString()} ({product.valid_period} year{product.valid_period > 1 ? 's' : ''})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {errors.product_id && <p className="text-red-500 text-xs mt-1">{errors.product_id}</p>}
            </div>
          </div>

          {/* API Error Message */}
          {updateCustomer.isError && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm">{updateCustomer.error?.response?.data?.message || 'Failed to update Customer. Please try again.'}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8">
            <button type="button" onClick={onClose} disabled={updateCustomer.isPending} className="flex-1 px-6 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
            <button type="submit" disabled={updateCustomer.isPending || productLoading} className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">{updateCustomer.isPending ? 'Updating Customer...' : 'Update Customer'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCustomerModal;