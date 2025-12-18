import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../../components/Layout/Layout';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  User, 
  Edit, 
  Download,
  CheckCircle,
  Clock,
  QrCode
} from 'lucide-react';

const CustomerDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock customer data - replace with actual API call
  const customer = {
    id: id,
    customerCode: 'CIS-2024-001234',
    fullName: 'John Doe',
    email: 'john.doe@email.com',
    phoneNumber: '+234 801 234 5678',
    contactAddress: '123 Main Street, Victoria Island, Lagos State',
    dateOfBirth: '1990-05-15',
    gender: 'Male',
    occupation: 'Software Engineer',
    registrationDate: '2024-01-15',
    expiryDate: '2025-01-15',
    status: 'Active',
    photoUrl: null,
  };

  // Mock verification history
  const verificationHistory = [
    { id: '1', location: 'Main Gate', verifiedBy: 'Officer Sarah', time: '2024-12-15 09:30 AM' },
    { id: '2', location: 'Building A', verifiedBy: 'Officer Mike', time: '2024-12-14 02:15 PM' },
    { id: '3', location: 'Main Gate', verifiedBy: 'Officer Sarah', time: '2024-12-13 08:45 AM' },
  ];

  return (
    <Layout
      activePage="customers"
      pageTitle="Customer Details"
      pageSubtitle="View and manage customer information"
    >
      {/* Back Button */}
      <button
        onClick={() => navigate('/customers')}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Customers</span>
      </button>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Customer Info */}
        <div className="xl:col-span-2 space-y-6">
          {/* Customer Card */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-6">
                {/* Photo */}
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center border-2 border-slate-200">
                  <User className="w-16 h-16 text-emerald-600" />
                </div>
                {/* Basic Info */}
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">{customer.fullName}</h2>
                  <p className="text-lg font-mono font-semibold text-slate-600 mb-4">
                    {customer.customerCode}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                      customer.status === 'Active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {customer.status}
                    </span>
                    <span className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold">
                      {customer.gender}
                    </span>
                  </div>
                </div>
              </div>
              {/* Actions */}
              <div className="flex gap-2">
                <button className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors">
                  <Edit className="w-5 h-5 text-slate-700" />
                </button>
                <button className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 transition-colors text-white">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                    Email Address
                  </label>
                  <div className="flex items-center gap-3 text-slate-900">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <span className="font-medium">{customer.email}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                    Phone Number
                  </label>
                  <div className="flex items-center gap-3 text-slate-900">
                    <Phone className="w-5 h-5 text-slate-400" />
                    <span className="font-medium">{customer.phoneNumber}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                    Date of Birth
                  </label>
                  <div className="flex items-center gap-3 text-slate-900">
                    <Calendar className="w-5 h-5 text-slate-400" />
                    <span className="font-medium">
                      {new Date(customer.dateOfBirth).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                    Contact Address
                  </label>
                  <div className="flex items-start gap-3 text-slate-900">
                    <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                    <span className="font-medium">{customer.contactAddress}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                    Occupation
                  </label>
                  <div className="flex items-center gap-3 text-slate-900">
                    <User className="w-5 h-5 text-slate-400" />
                    <span className="font-medium">{customer.occupation}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Verification History */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Verification History</h3>
            <div className="space-y-3">
              {verificationHistory.map((verification) => (
                <div
                  key={verification.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{verification.location}</p>
                      <p className="text-sm text-slate-500">Verified by {verification.verifiedBy}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">{verification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* ID Card Preview */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">ID Card Preview</h3>
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl p-6 text-white aspect-[1.6/1] flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-90 mb-1">
                  CIS Portal
                </p>
                <p className="text-2xl font-bold">{customer.fullName}</p>
              </div>
              <div>
                <p className="text-sm font-mono font-semibold opacity-90">
                  {customer.customerCode}
                </p>
                <p className="text-xs opacity-75 mt-1">
                  Valid until {new Date(customer.expiryDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button className="w-full mt-4 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Download ID Card
            </button>
          </div>

          {/* Registration Info */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Registration Info</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                  Registration Date
                </label>
                <div className="flex items-center gap-3 text-slate-900">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <span className="font-medium">
                    {new Date(customer.registrationDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                  Expiry Date
                </label>
                <div className="flex items-center gap-3 text-slate-900">
                  <Clock className="w-5 h-5 text-slate-400" />
                  <span className="font-medium">
                    {new Date(customer.expiryDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <button className="w-full px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-medium">
                  Renew ID Card
                </button>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">QR Code</h3>
            <div className="bg-slate-50 rounded-xl p-6 flex items-center justify-center aspect-square">
              <QrCode className="w-full h-full text-slate-300" />
            </div>
            <p className="text-sm text-slate-500 text-center mt-4">
              Scan this QR code for quick verification
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerDetailsPage;