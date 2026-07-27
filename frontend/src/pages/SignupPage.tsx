import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ParkingSquare, User, Lock, Building2, Shield, UserCheck, KeyRound, Clock, CheckCircle2, XCircle, RefreshCw, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/common/Button';
import { Company } from '../types';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const [signupType, setSignupType] = useState<'admin' | 'staff'>('admin');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  // Admin Signup State
  const [adminFullName, setAdminFullName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminCompanyName, setAdminCompanyName] = useState('');

  // Staff Signup State
  const [staffFullName, setStaffFullName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffUsername, setStaffUsername] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | ''>('');
  const [companies, setCompanies] = useState<Company[]>([]);

  // Staff Pending Info View State
  const [staffPendingInfo, setStaffPendingInfo] = useState<{
    email: string;
    fullName: string;
    companyName: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    rejectionReason?: string;
  } | null>(null);

  // OTP Modal State
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [otpMode, setOtpMode] = useState<'ADMIN' | 'STAFF'>('ADMIN');

  useEffect(() => {
    authService
      .getPublicCompanies()
      .then((data) => {
        setCompanies(data || []);
        if (data && data.length > 0) {
          setSelectedCompanyId(data[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const handleAdminSignupInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminCompanyName.trim()) {
      toast.error('Company Name is required');
      return;
    }

    setIsLoading(true);
    try {
      const resp = await authService.initiateAdminSignup({
        fullName: adminFullName,
        email: adminEmail,
        username: adminUsername,
        password: adminPassword,
        companyName: adminCompanyName,
      });

      setOtpEmail(adminEmail);
      setOtpMode('ADMIN');
      setIsOtpModalOpen(true);
      toast.success(resp.message || 'Verification code sent to your email');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to initiate admin registration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStaffSignupRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompanyId) {
      toast.error('Please select an existing organization');
      return;
    }

    const companyName = companies.find((c) => c.id === Number(selectedCompanyId))?.name || 'Selected Organization';

    setIsLoading(true);
    try {
      const resp = await authService.requestStaffSignup({
        fullName: staffFullName,
        email: staffEmail,
        username: staffUsername,
        password: staffPassword,
        companyId: Number(selectedCompanyId),
      });

      setStaffPendingInfo({
        email: staffEmail,
        fullName: staffFullName,
        companyName: companyName,
        status: 'PENDING',
      });

      setOtpEmail(staffEmail);
      setOtpMode('STAFF');
      toast.success(resp.message || 'Registration request submitted to Admin for approval');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to request staff signup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckApprovalStatus = async () => {
    if (!staffPendingInfo?.email) return;
    setIsCheckingStatus(true);
    try {
      const result = await authService.getStaffSignupStatus(staffPendingInfo.email);
      const currentStatus = (result.status || 'PENDING').toUpperCase() as 'PENDING' | 'APPROVED' | 'REJECTED';

      setStaffPendingInfo((prev) =>
        prev
          ? {
              ...prev,
              status: currentStatus,
              rejectionReason: result.rejectionReason,
            }
          : null
      );

      if (currentStatus === 'APPROVED') {
        toast.success('Your registration was APPROVED by the Admin! Check your email for your 6-digit OTP code.');
        setIsOtpModalOpen(true);
      } else if (currentStatus === 'REJECTED') {
        toast.error('Your registration request was REJECTED by the Administrator.');
      } else {
        toast('Your request is still PENDING Admin approval.', { icon: 'ℹ️' });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch status');
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      toast.error('Verification code must be 6 digits');
      return;
    }

    setIsLoading(true);
    try {
      let authData;
      if (otpMode === 'ADMIN') {
        authData = await authService.verifyAdminOtp(otpEmail, otpCode);
        toast.success('Organization & Administrator account registered successfully!');
      } else {
        authData = await authService.verifyStaffOtp(otpEmail, otpCode);
        toast.success('Staff account verified successfully!');
      }

      setUser(authData);
      setIsOtpModalOpen(false);
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Verification code failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 select-none">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-5 shadow-2xl">
        {/* Brand Header */}
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center mx-auto mb-3 text-white shadow-md cursor-pointer"
            onClick={() => navigate('/')}
          >
            <ParkingSquare className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">Create an Account</h1>
          <p className="text-xs text-slate-400 mt-1">Register a New Organization or Join as Staff</p>
        </div>

        {/* Account Type Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-md border border-slate-800 text-xs font-mono">
          <button
            onClick={() => {
              setSignupType('admin');
              setStaffPendingInfo(null);
            }}
            className={`py-2 rounded transition-colors text-center font-bold flex items-center justify-center gap-1.5 ${
              signupType === 'admin'
                ? 'bg-indigo-600 text-white shadow-sm dark:shadow-[#080b38]/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin (New Company)</span>
          </button>
          <button
            onClick={() => setSignupType('staff')}
            className={`py-2 rounded transition-colors text-center font-bold flex items-center justify-center gap-1.5 ${
              signupType === 'staff'
                ? 'bg-indigo-600 text-white shadow-sm dark:shadow-[#080b38]/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Staff (Join Company)</span>
          </button>
        </div>

        {/* 1. ADMIN REGISTRATION FORM */}
        {signupType === 'admin' && (
          <form onSubmit={handleAdminSignupInitiate} className="space-y-3" autoComplete="off">
            <div className="p-2.5 bg-indigo-950/40 border border-indigo-500/30 rounded text-[11px] text-indigo-300">
              <Shield className="w-3.5 h-3.5 inline mr-1" />
              Register a new organization with Administrator access. Sends a 6-digit verification code to your email.
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Company Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={adminCompanyName}
                  onChange={(e) => setAdminCompanyName(e.target.value)}
                  placeholder="e.g. Apex Parking Solutions"
                  autoComplete="off"
                  className="w-full pl-9 pr-3 py-1.5 rounded-md bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 font-semibold text-indigo-300"
                  required
                />
                <Building2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Admin Full Name *
              </label>
              <input
                type="text"
                value={adminFullName}
                onChange={(e) => setAdminFullName(e.target.value)}
                placeholder="Full Name"
                autoComplete="off"
                className="w-full px-3 py-1.5 rounded-md bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="email@example.com"
                  autoComplete="off"
                  className="w-full px-3 py-1.5 rounded-md bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="Username"
                  autoComplete="off"
                  className="w-full px-3 py-1.5 rounded-md bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Password *
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full px-3 py-1.5 rounded-md bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full mt-2">
              Send Verification Code ➔
            </Button>
          </form>
        )}

        {/* 2. STAFF REGISTRATION FORM or PENDING STATUS VIEW */}
        {signupType === 'staff' && (
          <>
            {staffPendingInfo ? (
              /* PENDING / APPROVED / REJECTED STATUS SCREEN FOR STAFF */
              <div className="space-y-4 text-center py-2">
                {staffPendingInfo.status === 'PENDING' && (
                  <div className="p-4 bg-amber-950/40 border border-amber-500/30 rounded-lg space-y-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                      <Clock className="w-5 h-5 animate-pulse" />
                    </div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Pending Admin Approval
                    </span>
                    <h3 className="text-sm font-bold text-white">Waiting for Administrator Approval</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Your registration request for <strong className="text-white">{staffPendingInfo.companyName}</strong> has been submitted to the Admin. An approval email with direct action links was sent to the Admin.
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Applicant: {staffPendingInfo.email}
                    </p>
                  </div>
                )}

                {staffPendingInfo.status === 'APPROVED' && (
                  <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-lg space-y-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Request Approved!
                    </span>
                    <h3 className="text-sm font-bold text-white">Administrator Has Approved Your Account</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      A 6-digit verification OTP code has been dispatched to <strong className="text-emerald-300 font-mono">{staffPendingInfo.email}</strong>.
                    </p>
                  </div>
                )}

                {staffPendingInfo.status === 'REJECTED' && (
                  <div className="p-4 bg-rose-950/40 border border-rose-500/30 rounded-lg space-y-3">
                    <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                      <XCircle className="w-5 h-5" />
                    </div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Request Rejected
                    </span>
                    <h3 className="text-sm font-bold text-white">Registration Rejected by Admin</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {staffPendingInfo.rejectionReason || 'The company administrator rejected your access request.'}
                    </p>
                  </div>
                )}

                {/* Status Actions */}
                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    disabled={isCheckingStatus}
                    onClick={handleCheckApprovalStatus}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-900/80 hover:bg-indigo-800 text-white font-extrabold text-xs border border-indigo-500/60 shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 text-indigo-300 ${isCheckingStatus ? 'animate-spin' : ''}`} />
                    <span>Check Approval Status</span>
                  </button>

                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    onClick={() => {
                      setOtpEmail(staffPendingInfo.email);
                      setOtpMode('STAFF');
                      setIsOtpModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    I Have OTP Code (Enter Code)
                  </Button>

                  <button
                    type="button"
                    onClick={() => setStaffPendingInfo(null)}
                    className="text-xs text-slate-400 hover:text-slate-200 underline pt-1 font-mono"
                  >
                    ← Back to Registration Form
                  </button>
                </div>
              </div>
            ) : (
              /* REGISTRATION FORM FOR STAFF */
              <form onSubmit={handleStaffSignupRequest} className="space-y-3" autoComplete="off">
                <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded text-[11px] text-emerald-300">
                  <UserCheck className="w-3.5 h-3.5 inline mr-1" />
                  Join an existing company as Staff. Requires Administrator approval before OTP verification.
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Select Existing Company *
                  </label>
                  <select
                    value={selectedCompanyId}
                    onChange={(e) => setSelectedCompanyId(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-md bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 font-semibold"
                    required
                  >
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.companyCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Staff Full Name *
                  </label>
                  <input
                    type="text"
                    value={staffFullName}
                    onChange={(e) => setStaffFullName(e.target.value)}
                    placeholder="Full Name"
                    autoComplete="off"
                    className="w-full px-3 py-1.5 rounded-md bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={staffEmail}
                      onChange={(e) => setStaffEmail(e.target.value)}
                      placeholder="email@example.com"
                      autoComplete="off"
                      className="w-full px-3 py-1.5 rounded-md bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Username *
                    </label>
                    <input
                      type="text"
                      value={staffUsername}
                      onChange={(e) => setStaffUsername(e.target.value)}
                      placeholder="Username"
                      autoComplete="off"
                      className="w-full px-3 py-1.5 rounded-md bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full px-3 py-1.5 rounded-md bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full mt-2">
                  Request Staff Registration ➔
                </Button>
              </form>
            )}
          </>
        )}

        {/* Navigate to Sign In Link */}
        <div className="border-t border-slate-800 pt-4 text-center">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold underline">
              Sign In to Console ➔
            </Link>
          </p>
        </div>
      </div>

      {/* 6-DIGIT OTP VERIFICATION MODAL */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4 shadow-2xl">
            <div className="text-center">
              <div className="w-10 h-10 rounded bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-2 text-indigo-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Enter Verification Code</h3>
              <p className="text-xs text-slate-400 mt-1">
                Sent to <strong className="text-indigo-300 font-mono">{otpEmail}</strong>
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="8 4 9 2 0 1"
                  className="w-full text-center text-xl font-mono tracking-[0.4em] py-2 bg-slate-950 border border-slate-800 rounded-md text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" size="md" className="flex-1" onClick={() => setIsOtpModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md" isLoading={isLoading} className="flex-1">
                  Verify & Activate
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Back to Public Homepage */}
      <button
        onClick={() => navigate('/')}
        className="mt-6 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-300 font-mono transition-colors"
      >
        ← Back to Homepage
      </button>
    </div>
  );
};
