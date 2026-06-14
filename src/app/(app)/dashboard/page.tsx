import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import TradeDashboardClient from "@/components/trades/TradeDashboardClient";

export default async function TradesPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen">
      <TradeDashboardClient sessionUser={session.user} />
    </main>
  );
}
