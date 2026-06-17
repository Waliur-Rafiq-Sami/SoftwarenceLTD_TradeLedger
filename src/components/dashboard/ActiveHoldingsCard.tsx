// import Link from "next/link";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { ArrowRight } from "lucide-react";

// const formatCurrency = (value: number) =>
//   new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
//     value,
//   );

// export function ActiveHoldingsCard({ holdings }: { holdings: any[] }) {
//   return (
//     <Card className="lg:col-span-2 shadow-sm dark:bg-[#0f172a] dark:border-slate-800 flex flex-col h-[450px]">
//       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-slate-100 dark:border-slate-800/80">
//         <div className="flex items-center gap-2.5">
//           <div className="h-2 w-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
//           <CardTitle className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
//             Active Holdings
//           </CardTitle>
//         </div>

//         <Button
//           asChild
//           variant="ghost"
//           size="sm"
//           className="group h-9 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 px-3 rounded-lg transition-all duration-200"
//         >
//           <Link
//             href="/dashboard/holdings"
//             className="flex items-center gap-1.5"
//           >
//             View All Holdings
//             <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
//           </Link>
//         </Button>
//       </CardHeader>

//       {/* Scrollable Content Area */}
//       <CardContent className="flex-1 overflow-y-auto custom-scrollbar p-0">
//         {holdings.length === 0 ? (
//           <div className="flex h-full items-center justify-center">
//             <p className="text-sm text-slate-500">No active holdings found.</p>
//           </div>
//         ) : (
//           <div className="p-6 space-y-4">
//             {holdings.map((holding: any) => (
//               <div
//                 key={holding._id}
//                 className="flex justify-between items-center p-4 border rounded-xl dark:border-slate-800 bg-slate-50/50 dark:bg-[#1e293b] transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/80"
//               >
//                 <div>
//                   <h4 className="font-bold text-lg text-slate-900 dark:text-white">
//                     {holding.companyName}
//                   </h4>
//                   <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
//                     {holding.totalQuantity} Shares @{" "}
//                     {formatCurrency(holding.avgBuyPrice)}
//                   </p>
//                 </div>
//                 <div className="text-right">
//                   <p className="font-bold text-lg text-slate-900 dark:text-white">
//                     {formatCurrency(holding.totalInvestedAmount)}
//                   </p>
//                   <span
//                     className={`text-sm font-semibold ${holding.realizedProfit >= 0 ? "text-emerald-500" : "text-rose-500"}`}
//                   >
//                     {holding.realizedProfit >= 0 ? "+" : ""}
//                     {formatCurrency(holding.realizedProfit)} Profit
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Eye,
  Layers,
  Activity,
  Clock,
  BarChart3,
} from "lucide-react";

// Currency Formatter
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value || 0,
  );

// Date Formatter
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export function ActiveHoldingsCard({ holdings = [] }: { holdings: any[] }) {
  // Modal State
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);

  return (
    <>
      {/* MAIN CARD COMPONENT */}
      <Card className="lg:col-span-2 shadow-sm bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 flex flex-col h-[460px] rounded-2xl overflow-hidden">
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-5 px-6 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="h-2 w-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50 animate-pulse" />
            <CardTitle className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Active Holdings
            </CardTitle>
          </div>

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="group h-8 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 px-3 rounded-lg transition-all duration-200"
          >
            <Link
              href="/dashboard/holdings"
              className="flex items-center gap-1.5"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </CardHeader>

        {/* Scrollable List */}
        <CardContent className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {holdings.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-2">
              <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
                No active security investments found.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {holdings.map((holding: any) => {
                const isProfitable = holding.realizedProfit >= 0;

                return (
                  <div
                    key={holding._id}
                    // Fixed background colors as requested (no extreme hover bg changes)
                    className="flex justify-between items-center p-4 border rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#1e293b] hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200"
                  >
                    {/* Left Column: Ticker & Info */}
                    <div className="flex items-center gap-3.5">
                      <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 font-mono text-xs font-bold tracking-wider text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 shadow-sm">
                        {holding.companyName
                          ? holding.companyName.substring(0, 4).toUpperCase()
                          : "AST"}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100">
                          {holding.companyName}
                        </h4>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                          {holding.totalQuantity.toLocaleString()} Shares
                        </p>
                      </div>
                    </div>

                    {/* Right Column: Amount, Profit & Action Button */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                          {formatCurrency(holding.totalInvestedAmount)}
                        </p>
                        <div className="flex justify-end mt-1">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-bold font-mono px-1.5 py-0.5 rounded-md ${
                              isProfitable
                                ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                                : "text-rose-600 dark:text-rose-400 bg-rose-500/10"
                            }`}
                          >
                            {isProfitable ? (
                              <TrendingUp className="h-3 w-3 stroke-[2.5]" />
                            ) : (
                              <TrendingDown className="h-3 w-3 stroke-[2.5]" />
                            )}
                            {isProfitable ? "+" : ""}
                            {formatCurrency(holding.realizedProfit)}
                          </span>
                        </div>
                      </div>

                      {/* Detail Modal Action Button */}
                      <Button
                        variant="ghost"
                        onClick={() => setSelectedAsset(holding)}
                        className="group px-3 border py-0 my-0
                        bg-blue-50/40 dark:bg-blue-950/20 
                        text-blue-600 dark:text-blue-400
                        hover:bg-blue-100/60 dark:hover:bg-blue-900/30
                        hover:border-blue-400/40
                        transition-all duration-300 active:scale-95 shadow-sm hover:shadow-md"
                        title="View Asset Details"
                      >
                        <BarChart3 className="stroke-[2.2] transition-transform duration-300 group-hover:scale-110 scale-125" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* DETAILED INFORMATION MODAL */}
      <Dialog
        open={!!selectedAsset}
        onOpenChange={(open) => !open && setSelectedAsset(null)}
      >
        <DialogContent className="sm:max-w-[425px] bg-slate-50 dark:bg-[#020817] border-slate-200 dark:border-slate-800 p-0 overflow-hidden rounded-2xl shadow-2xl">
          {selectedAsset && (
            <>
              {/* Modal Header Setup */}
              <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-950 font-mono text-lg font-bold tracking-wider text-blue-600 dark:text-blue-500 border border-slate-200 dark:border-slate-800 shadow-sm">
                    {selectedAsset.companyName?.substring(0, 4).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                      {selectedAsset.companyName}
                    </h2>
                    <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5 mt-1">
                      <Layers className="h-3.5 w-3.5" /> Equity Position
                      Overview
                    </p>
                  </div>
                </div>
              </div>

              {/* Data Grid Section */}
              <div className="p-6 grid grid-cols-2 gap-4">
                {/* Metric 1 */}
                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#1e293b]/50 space-y-1.5">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="h-3 w-3" /> Total Quantity
                  </p>
                  <p className="text-lg font-mono font-bold text-slate-900 dark:text-white">
                    {selectedAsset.totalQuantity.toLocaleString()}
                  </p>
                </div>

                {/* Metric 2 */}
                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#1e293b]/50 space-y-1.5">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Avg. Buy Price
                  </p>
                  <p className="text-lg font-mono font-bold text-slate-900 dark:text-white">
                    {formatCurrency(selectedAsset.avgBuyPrice)}
                  </p>
                </div>

                {/* Metric 3 */}
                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#1e293b]/50 space-y-1.5 col-span-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Total Invested Capital
                  </p>
                  <p className="text-2xl font-mono font-bold text-slate-900 dark:text-white">
                    {formatCurrency(selectedAsset.totalInvestedAmount)}
                  </p>
                </div>

                {/* Metric 4 (Profit/Loss Highlight Box) */}
                <div
                  className={`p-4 rounded-xl border col-span-2 space-y-1.5 ${
                    selectedAsset.realizedProfit >= 0
                      ? "bg-emerald-500/10 border-emerald-500/20"
                      : "bg-rose-500/10 border-rose-500/20"
                  }`}
                >
                  <p
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      selectedAsset.realizedProfit >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    Realized Return (P&L)
                  </p>
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-2xl font-mono font-bold ${
                        selectedAsset.realizedProfit >= 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {selectedAsset.realizedProfit >= 0 ? "+" : ""}
                      {formatCurrency(selectedAsset.realizedProfit)}
                    </p>
                    {selectedAsset.realizedProfit >= 0 ? (
                      <TrendingUp className="h-6 w-6 text-emerald-500 opacity-80" />
                    ) : (
                      <TrendingDown className="h-6 w-6 text-rose-500 opacity-80" />
                    )}
                  </div>
                </div>

                {/* Meta Info */}
                <div className="col-span-2 flex items-center justify-between mt-2 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> Last updated:{" "}
                    <span className="text-blue-600 font-bold">
                      {" "}
                      {formatDate(selectedAsset.updatedAt)}
                    </span>
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedAsset(null)}
                    className="text-xs border-slate-200 dark:border-slate-800"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
