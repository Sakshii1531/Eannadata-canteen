import React from "react";
import { NavLink } from "react-router-dom";
import { Home, IndianRupee, History, User } from "lucide-react";

const BottomNav = () => {
  const navItems = [
    { path: "/delivery/dashboard", label: "Home", icon: Home },
    { path: "/delivery/earnings", label: "Earnings", icon: IndianRupee },
    { path: "/delivery/history", label: "History", icon: History },
    { path: "/delivery/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-2px_15px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-[54px] max-w-md mx-auto px-2">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className="flex-1 flex flex-col items-center justify-center h-full relative transition-all"
          >
            {({ isActive }) => (
              <div
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all duration-200 min-w-[60px] ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Icon
                  size={19}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`transition-colors duration-200 ${
                    isActive ? "text-primary" : "text-slate-400"
                  }`}
                />
                <span
                  className={`text-[10px] font-bold tracking-tight mt-0.5 transition-colors duration-200 leading-none ${
                    isActive ? "text-primary" : "text-slate-400"
                  }`}
                >
                  {label}
                </span>
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;


