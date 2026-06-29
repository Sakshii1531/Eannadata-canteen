import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, ShoppingBag, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Category', icon: LayoutGrid, path: '/categories' },
    { label: 'Orders', icon: ShoppingBag, path: '/orders' },
    { label: 'Profile', icon: User, path: '/profile' },
];

const BottomNav = () => {
    const location = useLocation();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[500] bg-white border-t border-slate-200/80 md:hidden shadow-[0_-2px_15px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-around h-[54px] max-w-md mx-auto px-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path ||
                        (item.path !== '/' && location.pathname.startsWith(item.path));

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="flex-1 flex flex-col items-center justify-center h-full relative transition-all"
                        >
                            <div
                                className={cn(
                                    "flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all duration-200 min-w-[60px]",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                <item.icon
                                    size={19}
                                    strokeWidth={isActive ? 2.5 : 2}
                                    className={cn(
                                        "transition-colors duration-200",
                                        isActive ? "text-primary" : "text-slate-400"
                                    )}
                                />
                                <span
                                    className={cn(
                                        "text-[10px] font-bold tracking-tight mt-0.5 transition-colors duration-200 leading-none",
                                        isActive ? "text-primary" : "text-slate-400"
                                    )}
                                >
                                    {item.label}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;



