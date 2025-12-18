import React, { useState } from 'react';
import Layout from '../../../components/Layout/Layout';
import { Search, Camera, CheckCircle, XCircle, AlertTriangle, Calendar, User } from 'lucide-react';

interface VerificationResult {
  customerCode: string;
  fullName: string;
  status: 'active' | 'expired' | 'invalid';
  expiryDate: string;
  registrationDate: string;
  photoUrl?: string;
  lastVerified?: string;
}

const VerifyCustomersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Mock verification function
  const handleVerify = () => {
    setIsScanning(true);
    // Simulate API call
    setTimeout(() => {
      setVerificationResult({
        customerCode: searchQuery || 'CIS-2024-001234',
        fullName: 'John Doe',
        status: 'active',
        expiryDate: '2025-12-31',
        registrationDate: '2024-01-15',
        lastVerified: 'Just now',
      });
      setIsScanning(false);
    }, 1500);
  };

  const handleScanQR = () => {
    setIsScanning(true);
    // Simulate QR scan
    setTimeout(() => {
      setSearchQuery('CIS-2024-005678');
      handleVerify();
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        icon: <CheckCircle className="w-5 h-5" />,
        label: 'Active',
      },
      expired: {
        bg: 'bg-amber-100',
        text: 'text-amber-700',
        icon: <AlertTriangle className="w-5 h-5" />,
        label: 'Expired',
      },
      invalid: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        icon: <XCircle className="w-5 h-5" />,
        label: 'Invalid',
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return config;
  };

  return (
    <Layout
      activePage="verify"
      pageTitle="Verify Customers"
      pageSubtitle="Scan or search customer ID cards for verification"
    >
      <div className="max-w-5xl mx-auto">
        {/* Search and Scan Section */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Verify Customer ID</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Manual Search */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Search by Customer Code
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Enter customer code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
                  />
                </div>
                <button
                  onClick={handleVerify}
                  disabled={isScanning}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isScanning ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </div>

            {/* QR Scanner */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Scan QR Code
              </label>
              <button
                onClick={handleScanQR}
                disabled={isScanning}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 border-2 border-dashed border-slate-300 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all font-medium text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Camera className="w-5 h-5" />
                {isScanning ? 'Scanning...' : 'Scan QR Code'}
              </button>
            </div>
          </div>
        </div>

        {/* Verification Result */}
        {verificationResult && (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm animate-enter">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Verification Result</h2>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${getStatusBadge(verificationResult.status).bg} ${getStatusBadge(verificationResult.status).text} font-semibold`}>
                {getStatusBadge(verificationResult.status).icon}
                <span>{getStatusBadge(verificationResult.status).label}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Customer Photo Placeholder */}
              <div className="md:col-span-1">
                <div className="aspect-square rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center border-2 border-slate-200">
                  <User className="w-24 h-24 text-emerald-600" />
                </div>
              </div>

              {/* Customer Details */}
              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Customer Code
                    </label>
                    <p className="text-lg font-bold text-slate-900 font-mono mt-1">
                      {verificationResult.customerCode}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Full Name
                    </label>
                    <p className="text-lg font-bold text-slate-900 mt-1">
                      {verificationResult.fullName}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Registration Date
                    </label>
                    <p className="text-base font-semibold text-slate-700 mt-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(verificationResult.registrationDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Expiry Date
                    </label>
                    <p className="text-base font-semibold text-slate-700 mt-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(verificationResult.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {verificationResult.status === 'active' && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-900">Verification Successful</p>
                        <p className="text-sm text-green-700 mt-0.5">
                          This ID card is valid and active. Last verified: {verificationResult.lastVerified}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {verificationResult.status === 'expired' && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-6 h-6 text-amber-600" />
                      <div>
                        <p className="font-semibold text-amber-900">ID Card Expired</p>
                        <p className="text-sm text-amber-700 mt-0.5">
                          This ID card has expired. Please request the customer to renew their ID.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200">
              <button className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium">
                Log Entry
              </button>
              <button className="px-6 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium text-slate-700">
                Print Report
              </button>
              <button
                onClick={() => {
                  setVerificationResult(null);
                  setSearchQuery('');
                }}
                className="px-6 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium text-slate-700"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Recent Verifications */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mt-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Verifications</h3>
          <div className="space-y-3">
            {[
              { code: 'CIS-2024-001234', name: 'John Doe', time: '2 min ago', status: 'active' },
              { code: 'CIS-2024-005678', name: 'Jane Smith', time: '15 min ago', status: 'active' },
              { code: 'CIS-2024-009876', name: 'Mike Johnson', time: '1 hour ago', status: 'expired' },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-sm text-slate-500 font-mono">{item.code}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-500">{item.time}</span>
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {item.status === 'active' ? 'Active' : 'Expired'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VerifyCustomersPage;