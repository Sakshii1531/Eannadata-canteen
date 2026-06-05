import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';

const EditProfilePage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-10 flex flex-col">
            {/* Header */}
            <div className="bg-white sticky top-0 z-30 px-4 py-3 flex items-center gap-3 shadow-sm">
                <button 
                    onClick={() => navigate('/profile')} 
                    className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors outline-none"
                >
                    <ArrowLeft size={24} className="text-slate-600" />
                </button>
                <h1 className="text-lg font-black text-slate-800">Edit Profile</h1>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
                <div className="p-4 bg-brand-50 text-brand-600 rounded-full mb-4 ring-8 ring-brand-50/50">
                    <Lock size={36} />
                </div>
                <h2 className="text-xl font-bold text-slate-850">Managed by Administrator</h2>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2">
                    Your profile details, including your full name, Eannadata card number, and registered address, are managed strictly by the Eannadata canteen administration.
                </p>
                <p className="text-xs text-slate-400 font-medium leading-relaxed mt-2">
                    Public profile modification is not allowed. Please contact your nearest admin office if you need to update any information.
                </p>

                <button
                    onClick={() => navigate('/profile')}
                    className="w-full mt-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-lg transition-all"
                >
                    Back to Profile
                </button>
            </div>
        </div>
    );
};

export default EditProfilePage;
