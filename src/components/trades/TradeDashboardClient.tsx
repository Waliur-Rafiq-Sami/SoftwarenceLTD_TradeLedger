// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { signOut } from "next-auth/react";
// import { useQuery } from "@tanstack/react-query";
// import { useDebounce } from "./useDebounce";

// import { Card } from "@/components/ui/card";
// import HeaderMetadata from "./HeaderMetadata";
// import ControlsFilterEngine from "./Controls-Filter-Engine";
// import TradeTable from "./TradeTable";
// import PaginationControls from "./PaginationControls";
// import TradeFormModal from "./TradeFormModal";
// import { Loader2 } from "lucide-react"; // Assuming you have lucide-react for a spinner

// // 1. Strictly type the NextAuth session payload based on your JWT callbacks
// export interface SessionUser {
//   _id: string;
//   username?: string;
//   isVerified?: boolean;
//   email?: string;
// }

// interface TradeDashboardProps {
//   sessionUser: SessionUser | null | undefined;
// }

// export default function TradeDashboardClient({ sessionUser }: TradeDashboardProps) {
//   const router = useRouter();

//   // ---------------------------------------------------------------------------
//   // SECURITY LAYER: Client-Side Session Guard
//   // ---------------------------------------------------------------------------
//   useEffect(() => {
//     if (!sessionUser || !sessionUser._id) {
//       // If session drops, forcefully flush the local NextAuth state and redirect
//       signOut({ callbackUrl: "/sign-in", redirect: true });
//     }
//   }, [sessionUser]);

//   // ---------------------------------------------------------------------------
//   // STATE MANAGEMENT
//   // ---------------------------------------------------------------------------
//   const [page, setPage] = useState(1);
//   const [searchInstrument, setSearchInstrument] = useState("");
//   const [searchAction, setSearchAction] = useState("ALL");

//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [minAmount, setMinAmount] = useState("");
//   const [maxAmount, setMaxAmount] = useState("");

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingTrade, setEditingTrade] = useState<any>(null);

//   const debouncedInstrument = useDebounce(searchInstrument, 400);
//   const debouncedMinAmount = useDebounce(minAmount, 450);
//   const debouncedMaxAmount = useDebounce(maxAmount, 450);

//   // ---------------------------------------------------------------------------
//   // DATA FETCHING LAYER (Optimized TanStack Query)
//   // ---------------------------------------------------------------------------
//   const { data, isLoading, isPlaceholderData } = useQuery({
//     // Cache Boundary: Injecting sessionUser._id isolates the cache per tenant
//     queryKey: [
//       "trade-registry",
//       sessionUser?._id,
//       page,
//       debouncedInstrument,
//       searchAction,
//       startDate,
//       endDate,
//       debouncedMinAmount,
//       debouncedMaxAmount,
//     ],
//     queryFn: async () => {
//       const url = new URL("/api/trades", window.location.origin);
//       url.searchParams.set("page", page.toString());
//       url.searchParams.set("limit", "10");

//       if (debouncedInstrument) url.searchParams.set("instrument", debouncedInstrument);
//       if (searchAction !== "ALL") url.searchParams.set("action", searchAction);
//       if (startDate) url.searchParams.set("startDate", startDate);
//       if (endDate) url.searchParams.set("endDate", endDate);
//       if (debouncedMinAmount) url.searchParams.set("minAmount", debouncedMinAmount);
//       if (debouncedMaxAmount) url.searchParams.set("maxAmount", debouncedMaxAmount);

//       const res = await fetch(url.toString(), {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (!res.ok) {
//         // If the server explicitly returns 401 Unauthorized, trigger client logout
//         if (res.status === 401) {
//           signOut({ callbackUrl: "/sign-in", redirect: true });
//         }
//         throw new Error("Data sync execution error");
//       }
//       return res.json();
//     },
//     placeholderData: (previousData) => previousData,
//     // Circuit Breaker: NEVER execute this query if the user ID is missing
//     enabled: !!sessionUser?._id,
//     staleTime: 1000 * 60 * 5, // Optional: Cache data for 5 minutes to prevent over-fetching
//   });

//   // ---------------------------------------------------------------------------
//   // ACTION HANDLERS
//   // ---------------------------------------------------------------------------
//   const handleOpenCreate = () => {
//     setEditingTrade(null);
//     setIsModalOpen(true);
//   };

//   const handleEditTrade = (trade: any) => {
//     setEditingTrade(trade);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setEditingTrade(null);
//   };

//   // ---------------------------------------------------------------------------
//   // RENDER GUARDS
//   // ---------------------------------------------------------------------------
//   // Prevent flashing the dashboard UI while the redirection takes place
//   if (!sessionUser || !sessionUser._id) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
//         <div className="flex flex-col items-center gap-4 text-slate-500">
//           <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
//           <p className="text-sm font-medium tracking-wide">Securing session...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background text-foreground flex flex-col">
//       <div className="space-y-6 max-w-7xl w-full mx-auto p-4 md:p-8 flex-1">
//         <HeaderMetadata />

//         <ControlsFilterEngine
//           searchInstrument={searchInstrument}
//           setSearchInstrument={setSearchInstrument}
//           searchAction={searchAction}
//           setSearchAction={setSearchAction}
//           startDate={startDate}
//           setStartDate={setStartDate}
//           endDate={endDate}
//           setEndDate={setEndDate}
//           minAmount={minAmount}
//           setMinAmount={setMinAmount}
//           maxAmount={maxAmount}
//           setMaxAmount={setMaxAmount}
//           setPage={setPage}
//           onOpenCreate={handleOpenCreate}
//         />

//         <Card className="shadow-sm border-border bg-card text-card-foreground overflow-hidden">
//           <TradeTable data={data?.data || []} isLoading={isLoading} onEdit={handleEditTrade} />

//           <PaginationControls
//             pagination={data?.pagination}
//             page={page}
//             setPage={setPage}
//             isLoading={isLoading}
//             isPlaceholderData={isPlaceholderData}
//           />
//         </Card>
//       </div>

//       <TradeFormModal isOpen={isModalOpen} onClose={handleCloseModal} initialData={editingTrade} sessionUser={sessionUser} />
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { signOut } from "next-auth/react";
// import { useQuery } from "@tanstack/react-query";
// import { useDebounce } from "./useDebounce";

// import { Card } from "@/components/ui/card";
// import HeaderMetadata from "./HeaderMetadata";
// import ControlsFilterEngine from "./Controls-Filter-Engine";
// import TradeTable from "./TradeTable";
// import PaginationControls from "./PaginationControls";
// import TradeFormModal from "./TradeFormModal";
// import { Loader2 } from "lucide-react";

// export interface SessionUser {
//   _id: string;
//   username?: string;
//   isVerified?: boolean;
//   email?: string;
// }

// interface TradeDashboardProps {
//   sessionUser: SessionUser | null | undefined;
// }

// export default function TradeDashboardClient({ sessionUser }: TradeDashboardProps) {
//   const router = useRouter();

//   // ---------------------------------------------------------------------------
//   // STATE MANAGEMENT
//   // ---------------------------------------------------------------------------
//   const [page, setPage] = useState(1);
//   const [searchInstrument, setSearchInstrument] = useState("");
//   const [searchAction, setSearchAction] = useState("ALL");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [minAmount, setMinAmount] = useState("");
//   const [maxAmount, setMaxAmount] = useState("");

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingTrade, setEditingTrade] = useState<any>(null);

//   const debouncedInstrument = useDebounce(searchInstrument, 400);
//   const debouncedMinAmount = useDebounce(minAmount, 450);
//   const debouncedMaxAmount = useDebounce(maxAmount, 450);

//   // Sorting States
//   const [sortBy, setSortBy] = useState<string | null>(null);
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

//   // ---------------------------------------------------------------------------
//   // DATA FETCHING LAYER
//   // ---------------------------------------------------------------------------
//   const { data, isLoading, isPlaceholderData } = useQuery({
//     queryKey: [
//       "trade-registry",
//       sessionUser?._id,
//       page,
//       debouncedInstrument,
//       searchAction,
//       startDate,
//       endDate,
//       debouncedMinAmount,
//       debouncedMaxAmount,
//       sortBy,
//       sortOrder,
//     ],
//     queryFn: async () => {
//       const url = new URL("/api/trades", window.location.origin);
//       url.searchParams.set("page", page.toString());
//       url.searchParams.set("limit", "10");

//       if (debouncedInstrument) url.searchParams.set("instrument", debouncedInstrument);
//       if (searchAction !== "ALL") url.searchParams.set("action", searchAction);
//       if (startDate) url.searchParams.set("startDate", startDate);
//       if (endDate) url.searchParams.set("endDate", endDate);
//       if (debouncedMinAmount) url.searchParams.set("minAmount", debouncedMinAmount);
//       if (debouncedMaxAmount) url.searchParams.set("maxAmount", debouncedMaxAmount);

//       // Pass sorting params to API
//       if (sortBy) url.searchParams.set("sortBy", sortBy);
//       if (sortOrder) url.searchParams.set("sortOrder", sortOrder);

//       console.log("Fetching API with params:", Object.fromEntries(url.searchParams));

//       const res = await fetch(url.toString(), {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//       });

//       if (!res.ok) {
//         if (res.status === 401) signOut({ callbackUrl: "/sign-in" });
//         throw new Error("Data sync execution error");
//       }
//       return res.json();
//     },
//     placeholderData: (previousData) => previousData,
//     enabled: !!sessionUser?._id,
//     staleTime: 1000 * 60 * 5,
//   });

//   // ---------------------------------------------------------------------------
//   // ACTION HANDLERS
//   // ---------------------------------------------------------------------------
//   const handleOpenCreate = () => {
//     setEditingTrade(null);
//     setIsModalOpen(true);
//   };
//   const handleEditTrade = (trade: any) => {
//     setEditingTrade(trade);
//     setIsModalOpen(true);
//   };
//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setEditingTrade(null);
//   };

//   const handleSortChange = (field: string | null, order: "asc" | "desc" | null) => {
//     console.log("Sort changed by user:", { field, order });

//     setSortBy(field);
//     setSortOrder(order);
//     setPage(1);
//   };

//   // ---------------------------------------------------------------------------
//   // RENDER
//   // ---------------------------------------------------------------------------
//   if (!sessionUser || !sessionUser._id) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
//         <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
//       </div>
//     );
//   }
//   console.log(data);
//   return (
//     <div className="min-h-screen bg-background text-foreground flex flex-col">
//       <div className="space-y-6 max-w-7xl w-full mx-auto p-4 md:p-8 flex-1">
//         <HeaderMetadata />

//         <ControlsFilterEngine
//           searchInstrument={searchInstrument}
//           setSearchInstrument={setSearchInstrument}
//           searchAction={searchAction}
//           setSearchAction={setSearchAction}
//           startDate={startDate}
//           setStartDate={setStartDate}
//           endDate={endDate}
//           setEndDate={setEndDate}
//           minAmount={minAmount}
//           setMinAmount={setMinAmount}
//           maxAmount={maxAmount}
//           setMaxAmount={setMaxAmount}
//           setPage={setPage}
//           onOpenCreate={handleOpenCreate}
//           // Sorting Props
//           sortBy={sortBy}
//           sortOrder={sortOrder}
//           onSortChange={handleSortChange}
//           onClearSort={() => {
//             setSortBy(null);
//             setSortOrder(null);
//           }}
//         />

//         <Card className="shadow-sm border-border bg-card text-card-foreground overflow-hidden">
//           <TradeTable data={data?.data || []} isLoading={isLoading} onEdit={handleEditTrade} />

//           <PaginationControls
//             pagination={data?.pagination}
//             page={page}
//             setPage={setPage}
//             isLoading={isLoading}
//             isPlaceholderData={isPlaceholderData}
//           />
//         </Card>
//       </div>

//       <TradeFormModal isOpen={isModalOpen} onClose={handleCloseModal} initialData={editingTrade} sessionUser={sessionUser} />
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { signOut } from "next-auth/react";
// import { useQuery } from "@tanstack/react-query";
// // Remove useDebounce import, it is no longer needed for a manual search

// import { Card } from "@/components/ui/card";
// import HeaderMetadata from "./HeaderMetadata";
// import ControlsFilterEngine from "./Controls-Filter-Engine";
// import TradeTable from "./TradeTable";
// import PaginationControls from "./PaginationControls";
// import TradeFormModal from "./TradeFormModal";
// import { Loader2 } from "lucide-react";

// export interface SessionUser {
//   _id: string;
//   username?: string;
//   isVerified?: boolean;
//   email?: string;
// }

// interface TradeDashboardProps {
//   sessionUser: SessionUser | null | undefined;
// }

// export default function TradeDashboardClient({ sessionUser }: TradeDashboardProps) {
//   const router = useRouter();

//   // ---------------------------------------------------------------------------
//   // UI STATE MANAGEMENT (What the user sees in the inputs)
//   // ---------------------------------------------------------------------------
//   const [page, setPage] = useState(1);
//   const [searchInstrument, setSearchInstrument] = useState("");
//   const [searchAction, setSearchAction] = useState("ALL");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [minAmount, setMinAmount] = useState("");
//   const [maxAmount, setMaxAmount] = useState("");
//   const [sortBy, setSortBy] = useState<string | null>(null);
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingTrade, setEditingTrade] = useState<any>(null);

//   // ---------------------------------------------------------------------------
//   // API QUERY STATE (What the API actually uses)
//   // ---------------------------------------------------------------------------
//   const [queryFilters, setQueryFilters] = useState({
//     instrument: "",
//     action: "ALL",
//     startDate: "",
//     endDate: "",
//     minAmount: "",
//     maxAmount: "",
//     sortBy: null as string | null,
//     sortOrder: null as "asc" | "desc" | null,
//   });

//   // ---------------------------------------------------------------------------
//   // DATA FETCHING LAYER
//   // ---------------------------------------------------------------------------
//   const { data, isLoading, isPlaceholderData } = useQuery({
//     // FIX: Only depend on page and the committed queryFilters
//     queryKey: ["trade-registry", sessionUser?._id, page, queryFilters],
//     queryFn: async () => {
//       const url = new URL("/api/trades", window.location.origin);
//       url.searchParams.set("page", page.toString());
//       url.searchParams.set("limit", "10");

//       // FIX: Use queryFilters instead of the live UI state variables
//       if (queryFilters.instrument) url.searchParams.set("instrument", queryFilters.instrument);
//       if (queryFilters.action !== "ALL") url.searchParams.set("action", queryFilters.action);
//       if (queryFilters.startDate) url.searchParams.set("startDate", queryFilters.startDate);
//       if (queryFilters.endDate) url.searchParams.set("endDate", queryFilters.endDate);
//       if (queryFilters.minAmount) url.searchParams.set("minAmount", queryFilters.minAmount);
//       if (queryFilters.maxAmount) url.searchParams.set("maxAmount", queryFilters.maxAmount);
//       if (queryFilters.sortBy) url.searchParams.set("sortBy", queryFilters.sortBy);
//       if (queryFilters.sortOrder) url.searchParams.set("sortOrder", queryFilters.sortOrder);

//       console.log("Fetching API with params:", Object.fromEntries(url.searchParams));

//       const res = await fetch(url.toString(), {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//       });

//       if (!res.ok) {
//         if (res.status === 401) signOut({ callbackUrl: "/sign-in" });
//         throw new Error("Data sync execution error");
//       }
//       return res.json();
//     },
//     placeholderData: (previousData) => previousData,
//     enabled: !!sessionUser?._id,
//     staleTime: 1000 * 60 * 5,
//   });

//   // ---------------------------------------------------------------------------
//   // ACTION HANDLERS
//   // ---------------------------------------------------------------------------
//   const handleSearch = () => {
//     setQueryFilters({
//       instrument: searchInstrument,
//       action: searchAction,
//       startDate: startDate,
//       endDate: endDate,
//       minAmount: minAmount,
//       maxAmount: maxAmount,
//       sortBy: sortBy,
//       sortOrder: sortOrder,
//     });
//     setPage(1); // Reset page only when the search button is clicked
//   };

//   const handleOpenCreate = () => {
//     setEditingTrade(null);
//     setIsModalOpen(true);
//   };
//   const handleEditTrade = (trade: any) => {
//     setEditingTrade(trade);
//     setIsModalOpen(true);
//   };
//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setEditingTrade(null);
//   };

//   const handleSortChange = (field: string | null, order: "asc" | "desc" | null) => {
//     console.log("Sort changed by user:", { field, order });
//     setSortBy(field);
//     setSortOrder(order);

//     // FIX: Auto-commit sorting changes so the table updates immediately on sort
//     setQueryFilters((prev) => ({
//       ...prev,
//       sortBy: field,
//       sortOrder: order,
//     }));
//     setPage(1);
//   };

//   // ---------------------------------------------------------------------------
//   // RENDER
//   // ---------------------------------------------------------------------------
//   if (!sessionUser || !sessionUser._id) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
//         <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background text-foreground flex flex-col">
//       <div className="space-y-6 max-w-7xl w-full mx-auto p-4 md:p-8 flex-1">
//         <HeaderMetadata />

//         <ControlsFilterEngine
//           searchInstrument={searchInstrument}
//           setSearchInstrument={setSearchInstrument}
//           searchAction={searchAction}
//           setSearchAction={setSearchAction}
//           startDate={startDate}
//           setStartDate={setStartDate}
//           endDate={endDate}
//           setEndDate={setEndDate}
//           minAmount={minAmount}
//           setMinAmount={setMinAmount}
//           maxAmount={maxAmount}
//           setMaxAmount={setMaxAmount}
//           setPage={setPage}
//           onOpenCreate={handleOpenCreate}
//           sortBy={sortBy}
//           sortOrder={sortOrder}
//           onSortChange={handleSortChange}
//           onClearSort={() => {
//             setSortBy(null);
//             setSortOrder(null);
//           }}
//           onSearch={handleSearch}
//         />

//         <Card className="shadow-sm border-border bg-card text-card-foreground overflow-hidden">
//           <TradeTable data={data?.data || []} isLoading={isLoading} onEdit={handleEditTrade} />

//           <PaginationControls
//             pagination={data?.pagination}
//             page={page}
//             setPage={setPage}
//             isLoading={isLoading}
//             isPlaceholderData={isPlaceholderData}
//           />
//         </Card>
//       </div>

//       <TradeFormModal isOpen={isModalOpen} onClose={handleCloseModal} initialData={editingTrade} sessionUser={sessionUser} />
//     </div>
//   );
// }

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import HeaderMetadata from "./HeaderMetadata";
import ControlsFilterEngine from "./Controls-Filter-Engine";
import TradeTable from "./TradeTable";
import PaginationControls from "./PaginationControls";
import TradeFormModal from "./TradeFormModal";
import { Loader2 } from "lucide-react";

export interface SessionUser {
  _id: string;
  username?: string;
  isVerified?: boolean;
  email?: string;
}

interface TradeDashboardProps {
  sessionUser: SessionUser | null | undefined;
}

// Keep the default state outside to easily reset back to it
const DEFAULT_FILTERS = {
  instrument: "",
  action: "ALL",
  startDate: "",
  endDate: "",
  minAmount: "",
  maxAmount: "",
  sortBy: null as string | null,
  sortOrder: null as "asc" | "desc" | null,
};

export default function TradeDashboardClient({ sessionUser }: TradeDashboardProps) {
  const router = useRouter();

  // ---------------------------------------------------------------------------
  // UI STATE MANAGEMENT (What the user sees in the input fields)
  // ---------------------------------------------------------------------------
  const [page, setPage] = useState(1);
  const [searchInstrument, setSearchInstrument] = useState("");
  const [searchAction, setSearchAction] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState<any>(null);

  // ---------------------------------------------------------------------------
  // API QUERY STATE (The committed state that triggers the fetch)
  // ---------------------------------------------------------------------------
  const [queryFilters, setQueryFilters] = useState(DEFAULT_FILTERS);

  // ---------------------------------------------------------------------------
  // DATA FETCHING LAYER (Proper TanStack Query Format)
  // ---------------------------------------------------------------------------
  const { data, isLoading, isPlaceholderData } = useQuery({
    // The queryKey uniquely identifies this exact combination of filters and page
    queryKey: ["trade-registry", sessionUser?._id, page, queryFilters],
    queryFn: async () => {
      const url = new URL("/api/trades", window.location.origin);
      url.searchParams.set("page", page.toString());
      url.searchParams.set("limit", "10");

      if (queryFilters.instrument) url.searchParams.set("instrument", queryFilters.instrument);
      if (queryFilters.action !== "ALL") url.searchParams.set("action", queryFilters.action);
      if (queryFilters.startDate) url.searchParams.set("startDate", queryFilters.startDate);
      if (queryFilters.endDate) url.searchParams.set("endDate", queryFilters.endDate);
      if (queryFilters.minAmount) url.searchParams.set("minAmount", queryFilters.minAmount);
      if (queryFilters.maxAmount) url.searchParams.set("maxAmount", queryFilters.maxAmount);
      if (queryFilters.sortBy) url.searchParams.set("sortBy", queryFilters.sortBy);
      if (queryFilters.sortOrder) url.searchParams.set("sortOrder", queryFilters.sortOrder);

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        if (res.status === 401) signOut({ callbackUrl: "/sign-in" });
        throw new Error("Data sync execution error");
      }
      return res.json();
    },
    // PROPER FORMAT: keepPreviousData prevents flickering while new data loads
    placeholderData: keepPreviousData,
    enabled: !!sessionUser?._id,
    staleTime: 1000 * 60 * 5,
  });

  // ---------------------------------------------------------------------------
  // ACTION HANDLERS
  // ---------------------------------------------------------------------------
  const handleSearch = () => {
    // Commits the UI state into the Query state, triggering a fetch
    setQueryFilters({
      instrument: searchInstrument,
      action: searchAction,
      startDate: startDate,
      endDate: endDate,
      minAmount: minAmount,
      maxAmount: maxAmount,
      sortBy: sortBy,
      sortOrder: sortOrder,
    });
    setPage(1);
  };

  const handleClearFilters = () => {
    // 1. Reset all UI inputs
    setSearchInstrument("");
    setSearchAction("ALL");
    setStartDate("");
    setEndDate("");
    setMinAmount("");
    setMaxAmount("");
    setSortBy(null);
    setSortOrder(null);
    setPage(1);

    // 2. Reset the API state to default (This immediately fetches unfiltered data!)
    setQueryFilters(DEFAULT_FILTERS);
  };

  const handleSortChange = (field: string | null, order: "asc" | "desc" | null) => {
    setSortBy(field);
    setSortOrder(order);

    // Auto-commit sorting changes so it applies instantly
    setQueryFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder: order,
    }));
    setPage(1);
  };

  const handleOpenCreate = () => {
    setEditingTrade(null);
    setIsModalOpen(true);
  };

  const handleEditTrade = (trade: any) => {
    setEditingTrade(trade);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTrade(null);
  };

  const safePagination = useMemo(() => {
    if (!data?.pagination) return null;

    return {
      ...data.pagination,
      // The "Magic" Math:
      // If we are on page 1 and total is 2, (1 < 2) is true.
      // The button will now enable!
      hasNextPage: data.pagination.currentPage < data.pagination.totalPages,
    };
  }, [data?.pagination]);

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  if (!sessionUser || !sessionUser._id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }
  console.log("data: ", data);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="space-y-6 max-w-7xl w-full mx-auto p-4 md:p-8 flex-1">
        <HeaderMetadata />

        <ControlsFilterEngine
          searchInstrument={searchInstrument}
          setSearchInstrument={setSearchInstrument}
          searchAction={searchAction}
          setSearchAction={setSearchAction}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          minAmount={minAmount}
          setMinAmount={setMinAmount}
          maxAmount={maxAmount}
          setMaxAmount={setMaxAmount}
          setPage={setPage}
          onOpenCreate={handleOpenCreate}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          onSearch={handleSearch}
          onClearFilters={handleClearFilters}
        />

        <Card className="shadow-sm border-border bg-card text-card-foreground overflow-hidden">
          <TradeTable data={data?.data || []} isLoading={isLoading} onEdit={handleEditTrade} />

          <PaginationControls pagination={safePagination} page={page} setPage={setPage} isLoading={isLoading} isPlaceholderData={isPlaceholderData} />
        </Card>
      </div>

      <TradeFormModal isOpen={isModalOpen} onClose={handleCloseModal} initialData={editingTrade} sessionUser={sessionUser} />
    </div>
  );
}
