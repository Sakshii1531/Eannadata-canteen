import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    User, MapPin, Package, CreditCard, Wallet, ChevronRight,
    LogOut, ShieldCheck, Heart, HelpCircle, Info, ChevronLeft, Bell,
    Lock, Calendar, CheckCircle, Smartphone
} from 'lucide-react';
import { useAuth } from '@core/context/AuthContext';
import { useSettings } from '@core/context/SettingsContext';
import { customerApi } from '../services/customerApi';
import { toast } from 'sonner';
import {
    describePushSupport,
    ensureFcmTokenRegistered,
    startForegroundPushListener
} from '@core/firebase/pushClient';

const TEST_PUSH_STATUS_POLL_INTERVAL_MS = 1500;
const TEST_PUSH_STATUS_MAX_ATTEMPTS = 20;

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, role, logout } = useAuth();
    const { settings } = useSettings();
    const appName = settings?.appName || 'Eannadata canteen ';
    const [isTestingPush, setIsTestingPush] = useState(false);

    // Profile State
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const formatIndiaPhone = (value) => {
        const raw = String(value || '').trim();
        if (!raw) return '';
        if (raw.startsWith('+91')) return raw.replace(/^\+91[\s-]*/, '');
        if (raw.startsWith('91') && raw.length >= 12) return raw.replace(/^91[\s-]*/, '');
        return raw;
    };

    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const waitForTestPushResult = async (orderId) => {
        for (let attempt = 0; attempt < TEST_PUSH_STATUS_MAX_ATTEMPTS; attempt += 1) {
            const statusRes = await customerApi.getTestPushNotificationStatus(orderId);
            const result = statusRes?.data?.result || {};
            const status = String(result.status || '').trim().toLowerCase();

            if (status === 'sent' || status === 'failed') {
                return result;
            }

            if (attempt < TEST_PUSH_STATUS_MAX_ATTEMPTS - 1) {
                await wait(TEST_PUSH_STATUS_POLL_INTERVAL_MS);
            }
        }
        return null;
    };

    const handleTestPush = async () => {
        if (isTestingPush) return;
        setIsTestingPush(true);
        try {
            const support = describePushSupport();
            if (!support.supported) {
                throw new Error(support.message || 'Push notifications are not supported on this device/browser setup.');
            }

            await ensureFcmTokenRegistered({ role, platform: 'web' });
            await startForegroundPushListener();
            const res = await customerApi.testPushNotification();
            const orderId = res?.data?.result?.orderId || '';
            if (!orderId) {
                toast.success('Test push triggered');
                return;
            }

            const statusResult = await waitForTestPushResult(orderId);
            if (!statusResult) {
                toast.message(`Test push processing (${orderId})`, {
                    description: 'Notification delivery is taking longer than expected.',
                });
                return;
            }

            if (statusResult.status === 'sent') {
                toast.success(`Test push sent (${orderId})`, {
                    description: 'MongoDB status is marked as sent.',
                });
                return;
            }

            toast.error(`Test push failed (${orderId})`, {
                description: String(statusResult.failureReason || 'Notification delivery failed.'),
            });
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || 'Unknown error';
            toast.error('Failed to trigger test push', {
                description: message,
            });
        } finally {
            setIsTestingPush(false);
        }
    };

    // Fetch dynamic profile on mount
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                const res = await customerApi.getProfile();
                if (res.data?.success) {
                    setProfile(res.data.result);
                }
            } catch (err) {
                console.error("Error fetching profile details:", err);
                toast.error("Failed to sync profile data.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, []);

    // Combine user details
    const activeUser = profile || user;

    return (
        <div className="min-h-screen bg-slate-50 pb-24 md:pb-8 font-sans">
            <div className="sticky top-0 z-30 bg-slate-50/95 backdrop-blur-sm px-4 pt-4 pb-3 border-b border-slate-200/60 mb-4 flex items-center gap-2">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-slate-200/70 rounded-full transition-colors -ml-1"
                >
                    <ChevronLeft size={22} className="text-slate-800" />
                </button>
                <h1 className="text-xl font-semibold text-slate-900 tracking-tight">My Profile</h1>
                <div className="ml-auto flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleTestPush}
                        disabled={isTestingPush}
                        title="Test push notification"
                        className="w-10 h-10 flex items-center justify-center rounded-full transition-colors border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <Bell size={18} className={isTestingPush ? "text-slate-400" : "text-slate-700"} />
                    </button>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 pt-1 relative z-20 space-y-4">
                {/* User Identity Card (Read Only) */}
                <div className="bg-white rounded-xl p-4 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-14 w-14 rounded-xl bg-slate-100 flex items-center justify-center p-1 border border-slate-200">
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeUser?.["Farmer Name"] || activeUser?.name || 'Customer'}&backgroundColor=f1f5f9`}
                                alt=""
                                className="h-full w-full rounded-lg object-cover"
                            />
                        </div>
                        <div>
                            <h2 className="text-base leading-tight font-semibold text-slate-900">
                                {activeUser?.["Farmer Name"] || activeUser?.name || 'Customer'}
                            </h2>
                            <p className="text-slate-500 text-xs font-medium flex items-center gap-1 mt-0.5">
                                <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] uppercase">India</span> +91 {formatIndiaPhone(activeUser?.["Mobile No"] || activeUser?.phone)}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="flex items-center gap-1 text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-full uppercase">
                            <CheckCircle size={10} /> Verified
                        </span>
                    </div>
                </div>

                {/* Eannadata Card & Address Details (Read Only) */}
                {(activeUser?.["eAnnadata Card Number"] || activeUser?.eannadata_card_number) && (
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200/60 flex items-center justify-between">
                            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Eannadata Card Details</p>
                            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                                <Lock size={10} /> Admin Managed
                            </span>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-4 text-xs leading-relaxed text-slate-600">
                            <div className="border-b border-slate-50 pb-2">
                                <span className="text-[10px] font-bold text-slate-400 block uppercase">Card Number</span>
                                <span className="font-bold text-brand-600 text-sm">{activeUser["eAnnadata Card Number"] || activeUser.eannadata_card_number}</span>
                            </div>
                            <div className="border-b border-slate-50 pb-2">
                                <span className="text-[10px] font-bold text-slate-400 block uppercase">Farmer Name</span>
                                <span className="font-bold text-slate-800">{activeUser["Farmer Name"] || activeUser.name}</span>
                            </div>
                            <div className="border-b border-slate-50 pb-2 md:col-span-2">
                                <span className="text-[10px] font-bold text-slate-400 block uppercase">Father/Mother/Husband</span>
                                <span className="font-semibold text-slate-800">{activeUser["Father/Mother/Husband"] || 'N/A'}</span>
                            </div>
                            <div className="border-b border-slate-50 pb-2">
                                <span className="text-[10px] font-bold text-slate-400 block uppercase">Date of Birth</span>
                                <span className="font-semibold text-slate-800">
                                    {activeUser["Date Of Birth"] ? new Date(activeUser["Date Of Birth"]).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
                                </span>
                            </div>
                            <div className="border-b border-slate-50 pb-2">
                                <span className="text-[10px] font-bold text-slate-400 block uppercase">Gender</span>
                                <span className="font-semibold text-slate-800">{activeUser.gender || 'N/A'}</span>
                            </div>
                            <div className="pb-1 col-span-1 md:col-span-2">
                                <span className="text-[10px] font-bold text-slate-400 block uppercase">Registered Address</span>
                                <span className="font-semibold text-slate-800">
                                    {activeUser["Village Name"] ? `${activeUser["Village Name"]}, Block: ${activeUser["Block Name"]}, District: ${activeUser["District Name"]}, ${activeUser["State Name"]} - ${activeUser["Pin Code"]}` : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Menu Sections */}
                <div className="space-y-4">
                    {/* Account Section */}
                    <div className="bg-white rounded-xl overflow-hidden border border-slate-200">
                        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Personal Account</p>
                        </div>
                        <div className="divide-y divide-slate-100">
                            <MenuItem
                                icon={Package}
                                label="Your Orders"
                                sub="Track, return or buy things again"
                                path="/orders"
                                color="var(--primary)"
                                bg="rgba(16,185,129,0.10)"
                            />
                            <MenuItem
                                icon={CreditCard}
                                label="Order Transactions"
                                sub="View all payments & refunds"
                                path="/transactions"
                                color="#f97316"
                                bg="rgba(249,115,22,0.10)"
                            />
                            <MenuItem
                                icon={Wallet}
                                label="Wallet"
                                sub="Balance & return refunds"
                                path="/wallet"
                                color="#10b981"
                                bg="rgba(16,185,129,0.10)"
                            />
                            <MenuItem
                                icon={Heart}
                                label="Your Wishlist"
                                sub="Your saved items"
                                path="/wishlist"
                                color="#fb7185"
                                bg="rgba(248,113,113,0.08)"
                            />
                            <MenuItem
                                icon={MapPin}
                                label="Saved Addresses"
                                sub="Manage your delivery locations"
                                path="/addresses"
                                color="var(--primary)"
                                bg="rgba(56,189,248,0.10)"
                            />
                        </div>
                    </div>

                    {/* Support Section */}
                    <div className="bg-white rounded-xl overflow-hidden border border-slate-200">
                        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Help & Settings</p>
                        </div>
                        <div className="divide-y divide-slate-100">
                            <MenuItem
                                icon={HelpCircle}
                                label="Help & Support"
                                path="/support"
                                color="#3b82f6"
                                bg="rgba(59,130,246,0.08)"
                            />
                            <MenuItem
                                icon={ShieldCheck}
                                label="Privacy Policy"
                                path="/privacy"
                                color="#a855f7"
                                bg="rgba(168,85,247,0.08)"
                            />
                            <MenuItem
                                icon={Info}
                                label="About Us"
                                path="/about"
                                color="#14b8a6"
                                bg="rgba(45,212,191,0.08)"
                            />
                        </div>
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={logout}
                    className="w-full py-3 rounded-lg border border-slate-300 text-slate-700 font-semibold bg-white hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 mt-2"
                >
                    <LogOut size={20} />
                    Sign out
                </button>

                <div className="text-center pb-8">
                    <p className="text-[10px] text-slate-400 font-medium">Version 2.4.0 - {appName}</p>
                </div>
            </div>
        </div>
    );
};

const MenuItem = ({ icon: Icon, label, sub, path, color = '#334155', bg = 'rgba(148,163,184,0.12)' }) => (
    <Link to={path || '#'} className="px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors group">
        <div className="flex items-center gap-3">
            <div
                className="h-10 w-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: bg }}
            >
                <Icon
                    size={20}
                    className="transition-colors"
                    style={{ color }}
                />
            </div>
            <div>
                <h3 className="text-sm font-semibold text-slate-800">{label}</h3>
                {sub && <p className="text-[11px] text-slate-500 mt-0.5">{sub}</p>}
            </div>
        </div>
        <div className="p-1.5 rounded-md group-hover:bg-slate-100 transition-colors">
            <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600 transition-all group-hover:translate-x-0.5" />
        </div>
    </Link>
);

export default ProfilePage;
