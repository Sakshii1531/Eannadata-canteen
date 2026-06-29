import React from 'react';
import { cn } from '@/lib/utils';

const Skeleton = ({ className, circle = false, style, ...props }) => {
    return (
        <div
            className={cn(
                "animate-pulse bg-slate-200/80 rounded-md",
                circle && "rounded-full",
                className
            )}
            style={style}
            {...props}
        />
    );
};

export const ProductCardSkeleton = () => (
    <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm flex flex-col space-y-3">
        <Skeleton className="w-full h-32 rounded-xl" />
        <Skeleton className="w-3/4 h-4 rounded" />
        <Skeleton className="w-1/2 h-3 rounded" />
        <div className="flex justify-between items-center pt-2">
            <Skeleton className="w-1/3 h-5 rounded" />
            <Skeleton className="w-16 h-8 rounded-lg" />
        </div>
    </div>
);

export const TableRowSkeleton = ({ cols = 5 }) => (
    <tr className="border-b border-slate-100 animate-pulse">
        {Array.from({ length: cols }).map((_, i) => (
            <td key={i} className="p-4">
                <Skeleton className="h-4 w-full rounded" />
            </td>
        ))}
    </tr>
);

export const CardSkeleton = () => (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center space-x-3">
            <Skeleton circle className="w-10 h-10" />
            <div className="space-y-2 flex-1">
                <Skeleton className="w-1/3 h-4 rounded" />
                <Skeleton className="w-1/4 h-3 rounded" />
            </div>
        </div>
        <Skeleton className="w-full h-12 rounded-xl" />
    </div>
);

export default Skeleton;
