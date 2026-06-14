// import React from "react";
// import { Search, SlidersHorizontal, DollarSign, ChevronDown, ArrowRight, AlertCircle, X, Plus } from "lucide-react";
// import { parse, isValid } from "date-fns";

// import { cn } from "@/lib/utils";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button"; // Added shadcn Button
// import { DatePickerField } from "@/components/ui/date-picker-field";

// interface ControlsFilterEngineProps {
//   onOpenCreate: () => void;
//   searchInstrument: string;
//   setSearchInstrument: (value: string) => void;
//   searchAction: string;
//   setSearchAction: (value: string) => void;
//   startDate: string;
//   setStartDate: (value: string) => void;
//   endDate: string;
//   setEndDate: (value: string) => void;
//   minAmount: string;
//   setMinAmount: (value: string) => void;
//   maxAmount: string;
//   setMaxAmount: (value: string) => void;
//   setPage: React.Dispatch<React.SetStateAction<number>>;

//   onClearSort: () => void;
//   // Sorting Props
//   sortBy: string | null;
//   sortOrder: "asc" | "desc" | null;
//   onSortChange: (field: string | null, order: "asc" | "desc" | null) => void;

//   onSearch: () => void;
// }

// const ControlsFilterEngine = ({
//   searchInstrument,
//   setSearchInstrument,
//   searchAction,
//   setSearchAction,
//   startDate,
//   setStartDate,
//   endDate,
//   setEndDate,
//   minAmount,
//   setMinAmount,
//   maxAmount,
//   setMaxAmount,
//   setPage,
//   onOpenCreate,
//   sortBy,
//   sortOrder,
//   onClearSort,
//   onSortChange,

//   onSearch,
// }: ControlsFilterEngineProps) => {
//   // Helper inside workspace engine solely for relative-range cross validation
//   const getParsedDate = (dateStr: string): Date | undefined => {
//     if (!dateStr) return undefined;
//     const parsed = parse(dateStr, "dd/MM/yyyy", new Date());
//     return isValid(parsed) ? parsed : undefined;
//   };

//   const startSelectedDate = getParsedDate(startDate);
//   const endSelectedDate = getParsedDate(endDate);

//   const isDateInvalid = Boolean(startSelectedDate && endSelectedDate && startSelectedDate > endSelectedDate);

//   const isAmountInvalid = Boolean(minAmount && maxAmount && parseFloat(minAmount) > parseFloat(maxAmount));

//   const isSearchDisabled = isDateInvalid || isAmountInvalid;

//   const handleFilterUpdate = (updateFn: () => void) => {
//     updateFn();
//     setPage(1);
//   };

//   // 1. Logic to determine if any filters are currently active
//   const hasActiveFilters = Boolean(
//     searchInstrument !== "" ||
//     searchAction !== "ALL" ||
//     startDate !== "" ||
//     endDate !== "" ||
//     (minAmount !== "" && minAmount !== "0") ||
//     (maxAmount !== "" && maxAmount !== "0") ||
//     sortBy !== null,
//   );

//   // 2. Handler to reset all states to their default values
//   const handleClearFilters = () => {
//     setSearchInstrument("");
//     setSearchAction("ALL");
//     setStartDate("");
//     setEndDate("");
//     setMinAmount("");
//     setMaxAmount("");
//     setPage(1);
//     onClearSort();
//   };

//   return (
//     <div className="flex flex-col gap-5 bg-card text-card-foreground p-6 border border-border/80 rounded-xl shadow-md opacity-100 w-full">
//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end w-full">
//         {/* SECTION 1: ASSET LOOKUP & TARGET METRICS */}
//         <div className="lg:col-span-4 space-y-2">
//           <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">Asset Parameters</label>
//           <div className="grid grid-cols-2 gap-2">
//             <div className="relative w-full">
//               <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/80" />
//               <Input
//                 placeholder="Ticker code..."
//                 value={searchInstrument}
//                 onChange={(e) => handleFilterUpdate(() => setSearchInstrument(e.target.value))}
//                 className="pl-9 h-11 bg-background border-input w-full text-sm font-medium uppercase placeholder:normal-case focus-visible:ring-1"
//               />
//             </div>

//             <div className="relative w-full">
//               <SlidersHorizontal className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/80 pointer-events-none z-20" />
//               <select
//                 value={searchAction}
//                 onChange={(e) => handleFilterUpdate(() => setSearchAction(e.target.value))}
//                 className="pl-9 pr-10 h-11 bg-background text-foreground border border-input rounded-md w-full text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring appearance-none cursor-pointer relative z-10 shadow-sm opacity-100">
//                 <option value="ALL" className="bg-popover text-foreground">
//                   All Actions
//                 </option>
//                 <option value="BUY" className="bg-popover text-rose-500 font-semibold">
//                   BUY
//                 </option>
//                 <option value="SELL" className="bg-popover text-emerald-500 font-semibold">
//                   SELL
//                 </option>
//               </select>
//               <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-muted-foreground/80 pointer-events-none z-20" />
//             </div>
//           </div>
//         </div>

//         {/* SECTION 2: REUSABLE TEMPORAL CALENDAR ENTRIES */}
//         <div className="lg:col-span-4 space-y-2">
//           <div className="flex justify-between items-center h-4">
//             <label
//               className={cn(
//                 "text-xs font-bold uppercase tracking-wider transition-colors duration-200",
//                 isDateInvalid ? "text-red-500" : "text-muted-foreground",
//               )}>
//               Timeline Interval
//             </label>
//             {isDateInvalid && (
//               <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 animate-fade-in">
//                 <AlertCircle className="h-3 w-3 shrink-0" /> Start date follows end date
//               </span>
//             )}
//           </div>

//           <div className="flex items-center gap-2 w-full">
//             <div className="flex-1">
//               <DatePickerField
//                 value={startDate}
//                 onChange={(val) => handleFilterUpdate(() => setStartDate(val))}
//                 isInvalid={isDateInvalid}
//                 align="start"
//               />
//             </div>

//             <ArrowRight
//               className={cn("h-4 w-4 shrink-0 transition-all duration-200", isDateInvalid ? "text-red-500 rotate-180" : "text-muted-foreground/50")}
//             />

//             <div className="flex-1">
//               <DatePickerField value={endDate} onChange={(val) => handleFilterUpdate(() => setEndDate(val))} isInvalid={isDateInvalid} align="end" />
//             </div>
//           </div>
//         </div>

//         {/* SECTION 3: VALUATION BOUNDING MATRIX */}
//         <div className="lg:col-span-4 space-y-2">
//           <div className="flex justify-between items-center h-4">
//             <label
//               className={cn(
//                 "text-xs font-bold uppercase tracking-wider transition-colors duration-200",
//                 isAmountInvalid ? "text-red-500" : "text-muted-foreground",
//               )}>
//               Capital Outlay
//             </label>
//             {isAmountInvalid && (
//               <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 animate-fade-in">
//                 <AlertCircle className="h-3 w-3 shrink-0" /> Min value exceeds max value
//               </span>
//             )}
//           </div>
//           <div className="flex items-center gap-2 w-full">
//             <div className="relative flex-1">
//               <DollarSign
//                 className={cn(
//                   "absolute left-3 top-3 h-4 w-4 transition-colors duration-200",
//                   isAmountInvalid ? "text-red-500" : "text-muted-foreground/70",
//                 )}
//               />
//               <Input
//                 type="number"
//                 step="0.01"
//                 placeholder="Min gross"
//                 value={minAmount === "0" ? "" : minAmount}
//                 onChange={(e) => handleFilterUpdate(() => setMinAmount(e.target.value))}
//                 className={cn(
//                   "pl-8 h-11 bg-background w-full text-sm font-semibold transition-all duration-200 focus-visible:ring-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
//                   isAmountInvalid
//                     ? "border-red-500 text-red-600 dark:text-red-400 focus-visible:ring-red-500 focus-visible:border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.15)] bg-red-50/10"
//                     : "border-input",
//                 )}
//               />
//             </div>

//             <ArrowRight
//               className={cn("h-4 w-4 shrink-0 transition-all duration-200", isAmountInvalid ? "text-red-500 rotate-180" : "text-muted-foreground/50")}
//             />

//             <div className="relative flex-1">
//               <DollarSign
//                 className={cn(
//                   "absolute left-3 top-3 h-4 w-4 transition-colors duration-200",
//                   isAmountInvalid ? "text-red-500" : "text-muted-foreground/70",
//                 )}
//               />
//               <Input
//                 type="number"
//                 step="0.01"
//                 placeholder="Max gross"
//                 value={maxAmount === "0" ? "" : maxAmount}
//                 onChange={(e) => handleFilterUpdate(() => setMaxAmount(e.target.value))}
//                 className={cn(
//                   "pl-8 h-11 bg-background w-full text-sm font-semibold transition-all duration-200 focus-visible:ring-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
//                   isAmountInvalid
//                     ? "border-red-500 text-red-600 dark:text-red-400 focus-visible:ring-red-500 focus-visible:border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.15)] bg-red-50/10"
//                     : "border-input",
//                 )}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="border-t border-border/50 pt-5 mt-2">
//         <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-3">Sort Configuration</label>
//         <div className="grid grid-cols-2 gap-4 max-w-md">
//           {/* Rate Select */}
//           <div className="relative">
//             <label className="text-[10px] font-bold uppercase text-muted-foreground/70 mb-1 block">Sort Rate</label>
//             <select
//               value={sortBy === "rate" ? sortOrder || "" : ""}
//               onChange={(e) => handleFilterUpdate(() => onSortChange("rate", e.target.value as "asc" | "desc" | null))}
//               className="pl-3 pr-8 h-11 bg-background border border-input rounded-md w-full text-sm font-medium appearance-none cursor-pointer focus-visible:ring-1">
//               <option value="">Default</option>
//               <option value="asc">Ascending</option>
//               <option value="desc">Descending</option>
//             </select>
//             <ChevronDown className="absolute right-3 top-9 h-4 w-4 text-muted-foreground/80 pointer-events-none" />
//           </div>

//           {/* Commission Select */}
//           <div className="relative">
//             <label className="text-[10px] font-bold uppercase text-muted-foreground/70 mb-1 block">Sort Commission</label>
//             <select
//               value={sortBy === "commission" ? sortOrder || "" : ""}
//               onChange={(e) => handleFilterUpdate(() => onSortChange("commission", e.target.value as "asc" | "desc" | null))}
//               className="pl-3 pr-8 h-11 bg-background border border-input rounded-md w-full text-sm font-medium appearance-none cursor-pointer focus-visible:ring-1">
//               <option value="">Default</option>
//               <option value="asc">Ascending</option>
//               <option value="desc">Descending</option>
//             </select>
//             <ChevronDown className="absolute right-3 top-9 h-4 w-4 text-muted-foreground/80 pointer-events-none" />
//           </div>
//         </div>
//       </div>

//       {/* Control Actions Base Execution Drawer */}
//       <div className="w-full flex justify-between items-center border-t border-border/50 pt-4 mt-1">
//         {/* Dynamic Clear Button */}
//         <div>
//           {hasActiveFilters && (
//             <Button
//               variant="outline"
//               onClick={handleClearFilters}
//               className="text-muted-foreground hover:text-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-colors h-9 px-3">
//               <X className="h-4 w-4 mr-2" />
//               Clear Filters
//             </Button>
//           )}
//           {/* <Button onClick={() => onSearch?.()} className="gap-2 font-medium bg-blue-600 hover:bg-blue-700 text-white">
//             <Search className="h-4 w-4 mr-2" />
//             Search
//           </Button> */}
//           <Button
//             onClick={onSearch}
//             disabled={isSearchDisabled}
//             className={cn("gap-2 font-medium ml-2", isSearchDisabled ? "opacity-50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white")}>
//             <Search className="h-4 w-4 mr-2" />
//             {isSearchDisabled ? "Invalid Parameters" : "Search"}
//           </Button>
//         </div>

//         {/* Trade Execution Action */}
//         <Button onClick={onOpenCreate} className="gap-2 font-medium bg-blue-600 hover:bg-blue-700 text-white">
//           <Plus className="h-4 w-4" /> Add Trade Record
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default ControlsFilterEngine;

// import React from "react";
// import { Search, SlidersHorizontal, DollarSign, ChevronDown, ArrowRight, AlertCircle, X, Plus } from "lucide-react";
// import { parse, isValid } from "date-fns";

// import { cn } from "@/lib/utils";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { DatePickerField } from "@/components/ui/date-picker-field";

// interface ControlsFilterEngineProps {
//   onOpenCreate: () => void;
//   searchInstrument: string;
//   setSearchInstrument: (value: string) => void;
//   searchAction: string;
//   setSearchAction: (value: string) => void;
//   startDate: string;
//   setStartDate: (value: string) => void;
//   endDate: string;
//   setEndDate: (value: string) => void;
//   minAmount: string;
//   setMinAmount: (value: string) => void;
//   maxAmount: string;
//   setMaxAmount: (value: string) => void;
//   setPage: React.Dispatch<React.SetStateAction<number>>;

//   onClearSort: () => void;
//   sortBy: string | null;
//   sortOrder: "asc" | "desc" | null;
//   onSortChange: (field: string | null, order: "asc" | "desc" | null) => void;

//   onSearch: () => void;
// }

// const ControlsFilterEngine = ({
//   searchInstrument,
//   setSearchInstrument,
//   searchAction,
//   setSearchAction,
//   startDate,
//   setStartDate,
//   endDate,
//   setEndDate,
//   minAmount,
//   setMinAmount,
//   maxAmount,
//   setMaxAmount,
//   setPage,
//   onOpenCreate,
//   sortBy,
//   sortOrder,
//   onClearSort,
//   onSortChange,
//   onSearch,
// }: ControlsFilterEngineProps) => {
//   const getParsedDate = (dateStr: string): Date | undefined => {
//     if (!dateStr) return undefined;
//     const parsed = parse(dateStr, "dd/MM/yyyy", new Date());
//     return isValid(parsed) ? parsed : undefined;
//   };

//   const startSelectedDate = getParsedDate(startDate);
//   const endSelectedDate = getParsedDate(endDate);

//   const isDateInvalid = Boolean(startSelectedDate && endSelectedDate && startSelectedDate > endSelectedDate);
//   const isAmountInvalid = Boolean(minAmount && maxAmount && parseFloat(minAmount) > parseFloat(maxAmount));

//   const isSearchDisabled = isDateInvalid || isAmountInvalid;

//   const hasActiveFilters = Boolean(
//     searchInstrument !== "" ||
//     searchAction !== "ALL" ||
//     startDate !== "" ||
//     endDate !== "" ||
//     (minAmount !== "" && minAmount !== "0") ||
//     (maxAmount !== "" && maxAmount !== "0") ||
//     sortBy !== null,
//   );

//   const handleClearFilters = () => {
//     setSearchInstrument("");
//     setSearchAction("ALL");
//     setStartDate("");
//     setEndDate("");
//     setMinAmount("");
//     setMaxAmount("");
//     setPage(1);
//     onClearSort();
//     // Optional: trigger onSearch() here if you want clearing to immediately reload data
//   };

//   return (
//     <div className="flex flex-col gap-5 bg-card text-card-foreground p-6 border border-border/80 rounded-xl shadow-md opacity-100 w-full">
//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end w-full">
//         <div className="lg:col-span-4 space-y-2">
//           <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">Asset Parameters</label>
//           <div className="grid grid-cols-2 gap-2">
//             <div className="relative w-full">
//               <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/80" />
//               <Input
//                 placeholder="Ticker code..."
//                 value={searchInstrument}
//                 // FIX: Removed handleFilterUpdate wrapper
//                 onChange={(e) => setSearchInstrument(e.target.value)}
//                 className="pl-9 h-11 bg-background border-input w-full text-sm font-medium uppercase placeholder:normal-case focus-visible:ring-1"
//               />
//             </div>

//             <div className="relative w-full">
//               <SlidersHorizontal className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/80 pointer-events-none z-20" />
//               <select
//                 value={searchAction}
//                 // FIX: Removed handleFilterUpdate wrapper
//                 onChange={(e) => setSearchAction(e.target.value)}
//                 className="pl-9 pr-10 h-11 bg-background text-foreground border border-input rounded-md w-full text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring appearance-none cursor-pointer relative z-10 shadow-sm opacity-100">
//                 <option value="ALL" className="bg-popover text-foreground">
//                   All Actions
//                 </option>
//                 <option value="BUY" className="bg-popover text-rose-500 font-semibold">
//                   BUY
//                 </option>
//                 <option value="SELL" className="bg-popover text-emerald-500 font-semibold">
//                   SELL
//                 </option>
//               </select>
//               <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-muted-foreground/80 pointer-events-none z-20" />
//             </div>
//           </div>
//         </div>

//         <div className="lg:col-span-4 space-y-2">
//           <div className="flex justify-between items-center h-4">
//             <label
//               className={cn(
//                 "text-xs font-bold uppercase tracking-wider transition-colors duration-200",
//                 isDateInvalid ? "text-red-500" : "text-muted-foreground",
//               )}>
//               Timeline Interval
//             </label>
//             {isDateInvalid && (
//               <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 animate-fade-in">
//                 <AlertCircle className="h-3 w-3 shrink-0" /> Start date follows end date
//               </span>
//             )}
//           </div>

//           <div className="flex items-center gap-2 w-full">
//             <div className="flex-1">
//               {/* FIX: Removed handleFilterUpdate wrapper */}
//               <DatePickerField value={startDate} onChange={(val) => setStartDate(val)} isInvalid={isDateInvalid} align="start" />
//             </div>
//             <ArrowRight
//               className={cn("h-4 w-4 shrink-0 transition-all duration-200", isDateInvalid ? "text-red-500 rotate-180" : "text-muted-foreground/50")}
//             />
//             <div className="flex-1">
//               {/* FIX: Removed handleFilterUpdate wrapper */}
//               <DatePickerField value={endDate} onChange={(val) => setEndDate(val)} isInvalid={isDateInvalid} align="end" />
//             </div>
//           </div>
//         </div>

//         <div className="lg:col-span-4 space-y-2">
//           <div className="flex justify-between items-center h-4">
//             <label
//               className={cn(
//                 "text-xs font-bold uppercase tracking-wider transition-colors duration-200",
//                 isAmountInvalid ? "text-red-500" : "text-muted-foreground",
//               )}>
//               Capital Outlay
//             </label>
//             {isAmountInvalid && (
//               <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 animate-fade-in">
//                 <AlertCircle className="h-3 w-3 shrink-0" /> Min value exceeds max value
//               </span>
//             )}
//           </div>
//           <div className="flex items-center gap-2 w-full">
//             <div className="relative flex-1">
//               <DollarSign
//                 className={cn(
//                   "absolute left-3 top-3 h-4 w-4 transition-colors duration-200",
//                   isAmountInvalid ? "text-red-500" : "text-muted-foreground/70",
//                 )}
//               />
//               <Input
//                 type="number"
//                 step="0.01"
//                 placeholder="Min gross"
//                 value={minAmount === "0" ? "" : minAmount}
//                 // FIX: Removed handleFilterUpdate wrapper
//                 onChange={(e) => setMinAmount(e.target.value)}
//                 className={cn(
//                   "pl-8 h-11 bg-background w-full text-sm font-semibold transition-all duration-200 focus-visible:ring-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
//                   isAmountInvalid
//                     ? "border-red-500 text-red-600 dark:text-red-400 focus-visible:ring-red-500 focus-visible:border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.15)] bg-red-50/10"
//                     : "border-input",
//                 )}
//               />
//             </div>
//             <ArrowRight
//               className={cn("h-4 w-4 shrink-0 transition-all duration-200", isAmountInvalid ? "text-red-500 rotate-180" : "text-muted-foreground/50")}
//             />
//             <div className="relative flex-1">
//               <DollarSign
//                 className={cn(
//                   "absolute left-3 top-3 h-4 w-4 transition-colors duration-200",
//                   isAmountInvalid ? "text-red-500" : "text-muted-foreground/70",
//                 )}
//               />
//               <Input
//                 type="number"
//                 step="0.01"
//                 placeholder="Max gross"
//                 value={maxAmount === "0" ? "" : maxAmount}
//                 // FIX: Removed handleFilterUpdate wrapper
//                 onChange={(e) => setMaxAmount(e.target.value)}
//                 className={cn(
//                   "pl-8 h-11 bg-background w-full text-sm font-semibold transition-all duration-200 focus-visible:ring-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
//                   isAmountInvalid
//                     ? "border-red-500 text-red-600 dark:text-red-400 focus-visible:ring-red-500 focus-visible:border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.15)] bg-red-50/10"
//                     : "border-input",
//                 )}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="border-t border-border/50 pt-5 mt-2">
//         <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-3">Sort Configuration</label>
//         <div className="grid grid-cols-2 gap-4 max-w-md">
//           <div className="relative">
//             <label className="text-[10px] font-bold uppercase text-muted-foreground/70 mb-1 block">Sort Rate</label>
//             <select
//               value={sortBy === "rate" ? sortOrder || "" : ""}
//               onChange={(e) => onSortChange("rate", e.target.value as "asc" | "desc" | null)}
//               className="pl-3 pr-8 h-11 bg-background border border-input rounded-md w-full text-sm font-medium appearance-none cursor-pointer focus-visible:ring-1">
//               <option value="">Default</option>
//               <option value="asc">Ascending</option>
//               <option value="desc">Descending</option>
//             </select>
//             <ChevronDown className="absolute right-3 top-9 h-4 w-4 text-muted-foreground/80 pointer-events-none" />
//           </div>
//           <div className="relative">
//             <label className="text-[10px] font-bold uppercase text-muted-foreground/70 mb-1 block">Sort Commission</label>
//             <select
//               value={sortBy === "commission" ? sortOrder || "" : ""}
//               onChange={(e) => onSortChange("commission", e.target.value as "asc" | "desc" | null)}
//               className="pl-3 pr-8 h-11 bg-background border border-input rounded-md w-full text-sm font-medium appearance-none cursor-pointer focus-visible:ring-1">
//               <option value="">Default</option>
//               <option value="asc">Ascending</option>
//               <option value="desc">Descending</option>
//             </select>
//             <ChevronDown className="absolute right-3 top-9 h-4 w-4 text-muted-foreground/80 pointer-events-none" />
//           </div>
//         </div>
//       </div>

//       <div className="w-full flex justify-between items-center border-t border-border/50 pt-4 mt-1">
//         <div>
//           {hasActiveFilters && (
//             <Button
//               variant="outline"
//               onClick={handleClearFilters}
//               className="text-muted-foreground hover:text-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-colors h-9 px-3">
//               <X className="h-4 w-4 mr-2" />
//               Clear Filters
//             </Button>
//           )}
//           <Button
//             onClick={onSearch}
//             disabled={isSearchDisabled}
//             className={cn("gap-2 font-medium ml-2", isSearchDisabled ? "opacity-50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white")}>
//             <Search className="h-4 w-4 mr-2" />
//             {isSearchDisabled ? "Invalid Parameters" : "Search"}
//           </Button>
//         </div>

//         <Button onClick={onOpenCreate} className="gap-2 font-medium bg-blue-600 hover:bg-blue-700 text-white">
//           <Plus className="h-4 w-4" /> Add Trade Record
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default ControlsFilterEngine;

import React, { useEffect, useState } from "react";
import { Search, SlidersHorizontal, DollarSign, ChevronDown, ArrowRight, AlertCircle, X, Plus } from "lucide-react";
import { parse, isValid } from "date-fns";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePickerField } from "@/components/ui/date-picker-field";
import ExportModal from "./ExportModal";
import { TradeFiltersSkeleton } from "../skeletons/TradeFiltersSkeleton";

interface ControlsFilterEngineProps {
  onOpenCreate: () => void;
  searchInstrument: string;
  setSearchInstrument: (value: string) => void;
  searchAction: string;
  setSearchAction: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  minAmount: string;
  setMinAmount: (value: string) => void;
  maxAmount: string;
  setMaxAmount: (value: string) => void;
  setPage: React.Dispatch<React.SetStateAction<number>>;

  // Replaced onClearSort with the universal onClearFilters prop
  onClearFilters: () => void;

  sortBy: string | null;
  sortOrder: "asc" | "desc" | null;
  onSortChange: (field: string | null, order: "asc" | "desc" | null) => void;

  onSearch: () => void;
}

const ControlsFilterEngine = ({
  searchInstrument,
  setSearchInstrument,
  searchAction,
  setSearchAction,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  minAmount,
  setMinAmount,
  maxAmount,
  setMaxAmount,
  onOpenCreate,
  sortBy,
  sortOrder,
  onSortChange,
  onSearch,
  onClearFilters, // Destructure the new prop
}: ControlsFilterEngineProps) => {
  const getParsedDate = (dateStr: string): Date | undefined => {
    if (!dateStr) return undefined;
    const parsed = parse(dateStr, "dd/MM/yyyy", new Date());
    return isValid(parsed) ? parsed : undefined;
  };

  const startSelectedDate = getParsedDate(startDate);
  const endSelectedDate = getParsedDate(endDate);

  const isDateInvalid = Boolean(startSelectedDate && endSelectedDate && startSelectedDate > endSelectedDate);
  const isAmountInvalid = Boolean(minAmount && maxAmount && parseFloat(minAmount) > parseFloat(maxAmount));

  const isSearchDisabled = isDateInvalid || isAmountInvalid;

  // Determine if clear button should be shown
  const hasActiveFilters = Boolean(
    searchInstrument !== "" ||
    searchAction !== "ALL" ||
    startDate !== "" ||
    endDate !== "" ||
    (minAmount !== "" && minAmount !== "0") ||
    (maxAmount !== "" && maxAmount !== "0") ||
    sortBy !== null,
  );
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // 1. Fetch User Profile once when the page loads
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        const json = await res.json();
        if (json.success) setProfile(json.data);
      } catch (err) {
        console.error("Profile fetch failed", err);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  if (loadingProfile)
    return (
      <>
        <TradeFiltersSkeleton></TradeFiltersSkeleton>
      </>
    );
  console.log("p :: ", profile);

  return (
    <div className="flex flex-col gap-5 bg-card text-card-foreground p-6 border border-border/80 rounded-xl shadow-md opacity-100 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end w-full">
        {/* Asset Parameters */}
        <div className="lg:col-span-4 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">Asset Parameters</label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/80" />
              <Input
                placeholder="Ticker code..."
                value={searchInstrument}
                onChange={(e) => setSearchInstrument(e.target.value)}
                className="pl-9 h-11 bg-background border-input w-full text-sm font-medium uppercase placeholder:normal-case focus-visible:ring-1"
              />
            </div>

            <div className="relative w-full">
              <SlidersHorizontal className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/80 pointer-events-none z-20" />
              <select
                value={searchAction}
                onChange={(e) => setSearchAction(e.target.value)}
                className="pl-9 pr-10 h-11 bg-background text-foreground border border-input rounded-md w-full text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring appearance-none cursor-pointer relative z-10 shadow-sm opacity-100">
                <option value="ALL" className="bg-popover text-foreground">
                  All Actions
                </option>
                <option value="BUY" className="bg-popover text-rose-500 font-semibold">
                  BUY
                </option>
                <option value="SELL" className="bg-popover text-emerald-500 font-semibold">
                  SELL
                </option>
              </select>
              <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-muted-foreground/80 pointer-events-none z-20" />
            </div>
          </div>
        </div>

        {/* Timeline Interval */}
        <div className="lg:col-span-4 space-y-2">
          <div className="flex justify-between items-center h-4">
            <label
              className={cn(
                "text-xs font-bold uppercase tracking-wider transition-colors duration-200",
                isDateInvalid ? "text-red-500" : "text-muted-foreground",
              )}>
              Timeline Interval
            </label>
            {isDateInvalid && (
              <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 animate-fade-in">
                <AlertCircle className="h-3 w-3 shrink-0" /> Start date follows end date
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full">
            <div className="flex-1">
              <DatePickerField value={startDate} onChange={(val) => setStartDate(val)} isInvalid={isDateInvalid} align="start" />
            </div>
            <ArrowRight
              className={cn("h-4 w-4 shrink-0 transition-all duration-200", isDateInvalid ? "text-red-500 rotate-180" : "text-muted-foreground/50")}
            />
            <div className="flex-1">
              <DatePickerField value={endDate} onChange={(val) => setEndDate(val)} isInvalid={isDateInvalid} align="end" />
            </div>
          </div>
        </div>

        {/* Capital Outlay */}
        <div className="lg:col-span-4 space-y-2">
          <div className="flex justify-between items-center h-4">
            <label
              className={cn(
                "text-xs font-bold uppercase tracking-wider transition-colors duration-200",
                isAmountInvalid ? "text-red-500" : "text-muted-foreground",
              )}>
              Capital Outlay
            </label>
            {isAmountInvalid && (
              <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 animate-fade-in">
                <AlertCircle className="h-3 w-3 shrink-0" /> Min value exceeds max value
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 w-full">
            <div className="relative flex-1">
              <DollarSign
                className={cn(
                  "absolute left-3 top-3 h-4 w-4 transition-colors duration-200",
                  isAmountInvalid ? "text-red-500" : "text-muted-foreground/70",
                )}
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Min gross"
                value={minAmount === "0" ? "" : minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                className={cn(
                  "pl-8 h-11 bg-background w-full text-sm font-semibold transition-all duration-200 focus-visible:ring-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                  isAmountInvalid
                    ? "border-red-500 text-red-600 dark:text-red-400 focus-visible:ring-red-500 focus-visible:border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.15)] bg-red-50/10"
                    : "border-input",
                )}
              />
            </div>
            <ArrowRight
              className={cn("h-4 w-4 shrink-0 transition-all duration-200", isAmountInvalid ? "text-red-500 rotate-180" : "text-muted-foreground/50")}
            />
            <div className="relative flex-1">
              <DollarSign
                className={cn(
                  "absolute left-3 top-3 h-4 w-4 transition-colors duration-200",
                  isAmountInvalid ? "text-red-500" : "text-muted-foreground/70",
                )}
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Max gross"
                value={maxAmount === "0" ? "" : maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                className={cn(
                  "pl-8 h-11 bg-background w-full text-sm font-semibold transition-all duration-200 focus-visible:ring-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                  isAmountInvalid
                    ? "border-red-500 text-red-600 dark:text-red-400 focus-visible:ring-red-500 focus-visible:border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.15)] bg-red-50/10"
                    : "border-input",
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sort Configuration */}
      <div className="border-t border-border/50 pt-5 mt-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-3">Sort Configuration</label>
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <div className="relative">
            <label className="text-[10px] font-bold uppercase text-muted-foreground/70 mb-1 block">Sort Rate</label>
            <select
              value={sortBy === "rate" ? sortOrder || "" : ""}
              onChange={(e) => onSortChange("rate", e.target.value as "asc" | "desc" | null)}
              className="pl-3 pr-8 h-11 bg-background border border-input rounded-md w-full text-sm font-medium appearance-none cursor-pointer focus-visible:ring-1">
              <option value="">Default</option>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
            <ChevronDown className="absolute right-3 top-9 h-4 w-4 text-muted-foreground/80 pointer-events-none" />
          </div>
          <div className="relative">
            <label className="text-[10px] font-bold uppercase text-muted-foreground/70 mb-1 block">Sort Commission</label>
            <select
              value={sortBy === "commission" ? sortOrder || "" : ""}
              onChange={(e) => onSortChange("commission", e.target.value as "asc" | "desc" | null)}
              className="pl-3 pr-8 h-11 bg-background border border-input rounded-md w-full text-sm font-medium appearance-none cursor-pointer focus-visible:ring-1">
              <option value="">Default</option>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
            <ChevronDown className="absolute right-3 top-9 h-4 w-4 text-muted-foreground/80 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex justify-between items-center border-t border-border/50 pt-4 mt-1">
        <div>
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="text-muted-foreground text-rose-500 hover:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-colors h-9 px-3 py-5 border-red-400/50">
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
          <Button
            onClick={onSearch}
            disabled={isSearchDisabled}
            className={cn("gap-2 font-medium ml-2", isSearchDisabled ? "opacity-50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white")}>
            <Search className="h-4 w-4 mr-2" />
            {isSearchDisabled ? "Invalid Parameters" : "Search"}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={onOpenCreate} className="gap-2 font-medium bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4" /> Add Trade Record
          </Button>
          <ExportModal
            profile={profile}
            filters={{
              searchInstrument,
              searchAction,
              startDate,
              endDate,
              minAmount,
              maxAmount,
              sortBy,
              sortOrder,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ControlsFilterEngine;
