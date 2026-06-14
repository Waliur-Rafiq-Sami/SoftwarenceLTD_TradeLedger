// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import QRCode from "qrcode";

// export const generateTradePDF = async (data: any[], profile: any) => {
//   const doc = new jsPDF("p", "mm", "a4");
//   const primary: [number, number, number] = [15, 23, 42];
//   const secondary: [number, number, number] = [59, 130, 246];

//   // --- HEADER ---
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

//   // --- CLIENT SECTION ---
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

//   // --- SUMMARY CARDS ---
//   const totalAmount = data.reduce((sum, t) => sum + Number(t.amount || 0), 0);
//   const totalCommission = data.reduce((sum, t) => sum + Number(t.commission || 0), 0);
//   const totalQuantity = data.reduce((sum, t) => sum + Number(t.quantity || 0), 0);

//   const cards = [
//     { title: "Total Trades", value: data.length },
//     { title: "Quantity", value: totalQuantity },
//     { title: "Trade Value", value: `$${totalAmount.toFixed(2)}` },
//     { title: "Commission", value: `$${totalCommission.toFixed(2)}` },
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

//   // --- TRADE TABLE ---
//   autoTable(doc, {
//     startY: 125,
//     head: [["Date", "Instrument", "Type", "Qty", "Rate", "Commission", "Amount"]],
//     body: data.map((item) => [item.transactionDate, item.instrument, item.tradeType, item.quantity, item.rate, item.commission, item.amount]),
//     theme: "grid",
//     headStyles: { fillColor: primary },
//     styles: { fontSize: 8 },
//   });

//   const finalY = (doc as any).lastAutoTable.finalY + 10;

//   // --- SYSTEM INFO & QR ---
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

//   const qrData = JSON.stringify({ userId: profile._id, verified: profile.isVerified, generatedAt: new Date().toISOString() });
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

//   // --- FOOTER ---
//   doc.setDrawColor(220);
//   doc.line(10, 285, 200, 285);
//   doc.setFontSize(8);
//   doc.setTextColor(120);
//   doc.text("Powered by Softwarance LTD Enterprise Trading Platform", 10, 290);
//   doc.text("support@softwarance.com", 150, 290);

//   doc.save(`Softwarance-Trade-Report-${Date.now()}.pdf`);
// };
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";

export const generateTradePDF = async (data: any[], profile: any) => {
  // 1. SAFETY GUARD: If no profile, don't attempt generation
  if (!profile) {
    console.error("Profile data is missing.");
    return;
  }

  const doc = new jsPDF("p", "mm", "a4");

  // Helper to safely format dates
  const formatDate = (date: any) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString("en-GB");
  };

  // Design Tokens
  const primaryColor = [15, 23, 42];
  const secondaryColor = [59, 130, 246];
  const lightGray = [248, 250, 252];

  // --- HEADER ---
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("SOFTWARANCE LTD", 14, 15);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Enterprise Trade Management Platform", 14, 21);
  doc.text(`Generated on: ${new Date().toLocaleDateString("en-GB")}`, 14, 26);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("TRADE CONFIRMATION", 145, 18);

  // --- CLIENT PROFILE ---
  doc.setFillColor(...lightGray);
  doc.roundedRect(10, 35, 190, 30, 2, 2, "F");
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("CLIENT INFORMATION", 15, 42);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Name: ${profile.name || "N/A"}`, 15, 50);
  doc.text(`Email: ${profile.email || "N/A"}`, 15, 55);
  doc.text(`User ID: ${profile.id || "N/A"}`, 15, 60);
  doc.text(`Profession: ${profile.profession || "N/A"}`, 100, 50);
  doc.text(`Address: ${profile.address || "N/A"}`, 100, 55);
  doc.setTextColor(22, 163, 74);
  doc.text("STATUS: VERIFIED ACCOUNT", 100, 60);
  doc.setTextColor(0, 0, 0);

  // --- SUMMARY CARDS ---
  const totalQty = data?.reduce((acc, t) => acc + (Number(t.quantity) || 0), 0) || 0;
  const totalValue = data?.reduce((acc, t) => acc + (Number(t.amount) || 0), 0) || 0;

  const drawCard = (title: string, value: string, x: number) => {
    doc.setFillColor(...secondaryColor);
    doc.roundedRect(x, 70, 40, 15, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.text(title, x + 5, 75);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(value, x + 5, 81);
  };

  drawCard("Total Trades", (data?.length || 0).toString(), 10);
  drawCard("Total Qty", totalQty.toString(), 55);
  drawCard("Total Value", `$${totalValue.toFixed(2)}`, 100);
  drawCard("Report ID", `TX-${Date.now().toString().slice(-6)}`, 145);

  // --- TRANSACTION TABLE ---
  if (data && data.length > 0) {
    const tableData = data.map((item) => [
      formatDate(item.date),
      (item.instrument || "N/A").toString(),
      (item.action || "N/A").toString().toUpperCase(),
      (item.quantity ?? 0).toString(),
      (Number(item.rate) || 0).toFixed(2),
      (Number(item.commission) || 0).toFixed(2),
      (Number(item.netImpact) || 0).toFixed(2),
    ]);

    autoTable(doc, {
      startY: 90,
      head: [["Date", "Instrument", "Action", "Qty", "Rate", "Comm.", "Net Impact"]],
      body: tableData,
      theme: "striped",
      headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 20 },
        2: { halign: "center" },
        3: { halign: "right" },
        4: { halign: "right" },
        5: { halign: "right" },
        6: { halign: "right" },
      },
      margin: { left: 10, right: 10 },
    });
  } else {
    doc.text("No trade records found for this period.", 10, 100);
  }

  // --- FOOTER & QR CODE ---
  const finalY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 10 : 120;

  if (finalY > 250) doc.addPage();

  const qrUrl = `https://yourdomain.com/verify/${profile.id}`;
  try {
    const qrDataUrl = await QRCode.toDataURL(qrUrl, { width: 128 });
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text("Verify this report authenticity by scanning the QR code.", 10, finalY);
    doc.addImage(qrDataUrl, "PNG", 10, finalY + 5, 30, 30);
  } catch (err) {
    console.error("QR Code generation failed", err);
  }

  doc.setFontSize(8);
  doc.text("© 2026 Softwarance LTD. All rights reserved.", 10, finalY + 40);

  doc.save(`Trade_Report_${profile.name || "User"}_${new Date().toLocaleDateString("en-GB")}.pdf`);
};
