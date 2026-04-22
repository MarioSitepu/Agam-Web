import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TableSelector from "@/components/TableSelector";

/**
 * Order Landing Page - Table Selection
 *
 * Displays available tables for customer to select from.
 * After selection, navigates to /order/[tableId]
 *
 * Tables Available:
 * - Table 1 (4 seats)
 * - Table 2 (4 seats)
 */

export default function OrderLandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      {/* Table Selection Component */}
      <div className="pt-16 sm:pt-20 flex-1">
        <TableSelector />
      </div>
      
      <Footer />
    </div>
  );
}
