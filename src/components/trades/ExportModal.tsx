// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import QRCode from "qrcode";

// const exportPDF = async (data: any[], profile: any) => {
//   const doc = new jsPDF("p", "mm", "a4");

//   const primary = [15, 23, 42];
//   const secondary = [59, 130, 246];

//   // ===============================
//   // HEADER
//   // ===============================
//   doc.setFillColor(...primary);
//   doc.rect(0, 0, 210, 35, "F");

//   doc.setTextColor(255, 255, 255);
//   doc.setFontSize(22);
//   doc.setFont("helvetica", "bold");
//   doc.text("SOFTWARANCE LTD", 14, 15);

//   doc.setFontSize(9);
//   doc.text("Enterprise Trade Management Platform", 14, 22);
//   doc.text("Dhaka, Bangladesh", 14, 27);

//   doc.setFontSize(18);
//   doc.text("TRADE CONFIRMATION REPORT", 120, 18);

//   doc.setFontSize(8);
//   doc.text(`Generated: ${new Date().toLocaleString()}`, 120, 26);

//   // ===============================
//   // CLIENT SECTION
//   // ===============================
//   doc.setFillColor(245, 247, 250);
//   doc.roundedRect(10, 42, 190, 45, 3, 3, "F");

//   doc.setTextColor(0, 0, 0);

//   doc.setFontSize(14);
//   doc.setFont("helvetica", "bold");
//   doc.text("CLIENT PROFILE", 15, 50);

//   doc.setFontSize(10);
//   doc.setFont("helvetica", "normal");

//   doc.text(`Name: ${profile.username}`, 15, 60);
//   doc.text(`Email: ${profile.email}`, 15, 67);
//   doc.text(`Phone: ${profile.phoneNumber}`, 15, 74);

//   doc.text(`Profession: ${profile.profession || "Not Specified"}`, 100, 60);

//   doc.text(`DOB: ${new Date(profile.dateOfBirth).toLocaleDateString()}`, 100, 67);

//   doc.text(`Address: ${profile.address}`, 100, 74);

//   doc.text(`User ID: ${profile._id}`, 15, 81);

//   doc.setTextColor(22, 163, 74);
//   doc.text(profile.isVerified ? "VERIFIED ACCOUNT ✓" : "UNVERIFIED ACCOUNT", 145, 81);

//   // ===============================
//   // SUMMARY CARDS
//   // ===============================
//   const totalAmount = data.reduce((sum, t) => sum + Number(t.amount || 0), 0);

//   const totalCommission = data.reduce((sum, t) => sum + Number(t.commission || 0), 0);

//   const totalQuantity = data.reduce((sum, t) => sum + Number(t.quantity || 0), 0);

//   const cards = [
//     {
//       title: "Total Trades",
//       value: data.length,
//     },
//     {
//       title: "Quantity",
//       value: totalQuantity,
//     },
//     {
//       title: "Trade Value",
//       value: `$${totalAmount.toFixed(2)}`,
//     },
//     {
//       title: "Commission",
//       value: `$${totalCommission.toFixed(2)}`,
//     },
//   ];

//   let startX = 10;

//   cards.forEach((card) => {
//     doc.setFillColor(...secondary);
//     doc.roundedRect(startX, 95, 45, 22, 3, 3, "F");

//     doc.setTextColor(255, 255, 255);

//     doc.setFontSize(8);
//     doc.text(card.title, startX + 3, 103);

//     doc.setFontSize(12);
//     doc.setFont("helvetica", "bold");
//     doc.text(String(card.value), startX + 3, 112);

//     startX += 47;
//   });

//   // ===============================
//   // TRADE TABLE
//   // ===============================
//   autoTable(doc, {
//     startY: 125,
//     head: [["Date", "Instrument", "Type", "Qty", "Rate", "Commission", "Amount"]],
//     body: data.map((item) => [item.transactionDate, item.instrument, item.tradeType, item.quantity, item.rate, item.commission, item.amount]),
//     theme: "grid",
//     headStyles: {
//       fillColor: primary,
//     },
//     styles: {
//       fontSize: 8,
//     },
//   });

//   const finalY = (doc as any).lastAutoTable.finalY + 10;

//   // ===============================
//   // SOFTWARE INFO
//   // ===============================
//   doc.setFillColor(248, 250, 252);
//   doc.roundedRect(10, finalY, 90, 35, 3, 3, "F");

//   doc.setTextColor(0, 0, 0);

//   doc.setFontSize(12);
//   doc.setFont("helvetica", "bold");
//   doc.text("SYSTEM INFORMATION", 15, finalY + 8);

//   doc.setFontSize(9);
//   doc.setFont("helvetica", "normal");

//   doc.text("Software: Softwarance Trade Management System", 15, finalY + 16);

//   doc.text("Version: Enterprise v1.0", 15, finalY + 22);

//   doc.text("Environment: Production", 15, finalY + 28);

//   doc.text("Security: SHA256 Digital Signature", 15, finalY + 34);

//   // ===============================
//   // QR VERIFICATION
//   // ===============================
//   const qrData = JSON.stringify({
//     userId: profile._id,
//     email: profile.email,
//     generatedAt: new Date().toISOString(),
//     verified: profile.isVerified,
//   });

//   const qrImage = await QRCode.toDataURL(qrData);

//   doc.setFillColor(248, 250, 252);
//   doc.roundedRect(110, finalY, 90, 35, 3, 3, "F");

//   doc.setFontSize(12);
//   doc.setFont("helvetica", "bold");
//   doc.text("DOCUMENT VERIFICATION", 115, finalY + 8);

//   doc.addImage(qrImage, "PNG", 160, finalY + 3, 30, 30);

//   doc.setFontSize(8);
//   doc.setFont("helvetica", "normal");

//   doc.text("Scan QR to verify report authenticity", 115, finalY + 18);

//   doc.text("Digital Signature: VERIFIED", 115, finalY + 24);

//   doc.text(`Report ID: TR-${Date.now()}`, 115, finalY + 30);

//   // ===============================
//   // FOOTER
//   // ===============================
//   doc.setDrawColor(220);
//   doc.line(10, 285, 200, 285);

//   doc.setFontSize(8);
//   doc.setTextColor(120);

//   doc.text("Powered by Softwarance LTD Enterprise Trading Platform", 10, 290);

//   doc.text("support@softwarance.com", 150, 290);

//   doc.save(`Softwarance-Trade-Report-${Date.now()}.pdf`);
// };

"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Download, FileText, FileSpreadsheet, Loader2, Database, FileTerminal, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/lib/toast-service"; // Assuming you are using the toast service from previous components
import { generateTradePDF } from "@/lib/pdfGenerator"; // Your PDF Utility

interface ExportModalProps {
  filters: any;
  profile: any;
}

type ExportFormat = "pdf" | "excel" | "csv";

export default function ExportModal({ filters, profile }: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>("pdf");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = async () => {
    if (!profile || !profile._id) {
      toast.error({
        title: "Authorization Fault",
        description: "Profile matrix node missing. Cannot sign export document.",
      });
      return;
    }

    setIsLoading(true);
    try {
      // 1. Fetch filtered ledger data
      const response = await fetch("/api/trades/export", {
        method: "POST",
        body: JSON.stringify(filters),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to extract ledger payload from database.");
      }

      const result = await response.json();
      const data = result.data;

      if (!data || data.length === 0) {
        toast.error({
          title: "Empty Ledger",
          description: "No trade records found matching current parameters.",
        });
        setIsLoading(false);
        return;
      }

      // 2. Route to appropriate formatter
      if (format === "pdf") {
        await generateTradePDF(data, profile);
      } else if (format === "excel") {
        exportExcel(data);
      } else if (format === "csv") {
        exportCSV(data);
      }

      toast.success({
        title: "Extraction Complete",
        description: `Ledger synchronized and downloaded as ${format.toUpperCase()}.`,
      });

      setIsOpen(false);
    } catch (error: any) {
      console.error("Export pipeline error:", error);
      toast.error({
        title: "Extraction Failed",
        description: error.message || "An error occurred during data compilation.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // DATA COMPILATION ENGINES
  // ==========================================
  const exportExcel = (data: any[]) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ledger Trades");
    XLSX.writeFile(workbook, `Softwarance_Ledger_${Date.now()}.xlsx`);
  };

  const exportCSV = (data: any[]) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Softwarance_Ledger_${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url); // Clean up memory
  };

  // ==========================================
  // UI CONFIGURATION OPTIONS
  // ==========================================
  const formatOptions = [
    {
      id: "pdf",
      icon: FileText,
      title: "Cryptographic PDF Report",
      description: "Secure, signed document with QR verification matrix.",
      iconColor: "text-rose-500",
      activeBg: "bg-rose-500/10",
      activeBorder: "border-rose-500/50",
    },
    {
      id: "excel",
      icon: FileSpreadsheet,
      title: "Structured Excel (.xlsx)",
      description: "Tabular workbook with preserved metric data types.",
      iconColor: "text-emerald-500",
      activeBg: "bg-emerald-500/10",
      activeBorder: "border-emerald-500/50",
    },
    {
      id: "csv",
      icon: FileTerminal,
      title: "Raw CSV Payload",
      description: "Flat comma-separated values for pipeline integration.",
      iconColor: "text-blue-500",
      activeBg: "bg-blue-500/10",
      activeBorder: "border-blue-500/50",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 py-5 px-4 bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-all shadow-sm">
          <Download className="h-4 w-4 text-blue-500" />
          <span className="font-semibold tracking-wide text-sm">Extract Ledger</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[460px] border border-slate-800 bg-slate-950 text-slate-50 shadow-2xl rounded-xl opacity-100 overflow-hidden p-0 z-[100]">
        <div className="p-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-500" /> Compile Data Export
            </DialogTitle>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed pr-4">
              Select your required cryptographic format. The payload will be generated securely using your current active filter matrix.
            </p>
          </DialogHeader>

          {/* Format Selection Matrix */}
          <div className="grid gap-3 py-2">
            {formatOptions.map((opt) => {
              const isActive = format === opt.id;
              const Icon = opt.icon;

              return (
                <div
                  key={opt.id}
                  onClick={() => setFormat(opt.id as ExportFormat)}
                  className={cn(
                    "relative flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all duration-200 group",
                    isActive
                      ? `${opt.activeBg} ${opt.activeBorder} ring-1 ring-inset ring-${opt.iconColor.split("-")[1]}-500/20`
                      : "bg-slate-900/50 border-slate-800 hover:bg-slate-900 hover:border-slate-700",
                  )}>
                  <div className={cn("mt-0.5 p-2 rounded-md bg-slate-950 border border-slate-800 shadow-sm", opt.iconColor)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className={cn("text-sm font-bold tracking-wide", isActive ? "text-slate-50" : "text-slate-300 group-hover:text-slate-100")}>
                      {opt.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{opt.description}</p>
                  </div>

                  {/* Active Indicator Checkmark */}
                  {isActive && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <ShieldCheck className={cn("h-5 w-5", opt.iconColor)} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <DialogFooter className="mt-8 border-t border-slate-800/60 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
              className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
              Cancel Setup
            </Button>
            <Button
              onClick={handleExport}
              disabled={isLoading}
              className={cn(
                "font-bold tracking-wide shadow-md transition-all",
                isLoading ? "bg-slate-800 text-slate-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 text-white",
              )}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Compiling Engine...
                </>
              ) : (
                "Initialize Download"
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
