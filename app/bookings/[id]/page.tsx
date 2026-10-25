"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BookingDetailsModal from "@/components/shared/BookingDetailsModal";
import Spinner from "@/components/shared/Spinner";

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = (params?.id as string) || "";
  const [modalOpen, setModalOpen] = useState(true);

  const handleClose = () => {
    setModalOpen(false);
    // Redirect back to user's dashboard or home
    if (typeof window !== "undefined") {
      const isDashboard = document.referrer?.includes("/dashboard");
      router.push(isDashboard ? "/dashboard/my-booking" : "/dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF7F4] p-4">
      <BookingDetailsModal
        bookingId={bookingId}
        isOpen={modalOpen}
        onClose={handleClose}
      />
      {!modalOpen && (
        <div className="text-center">
          <Spinner message="Redirecting to dashboard..." />
        </div>
      )}
    </div>
  );
}
