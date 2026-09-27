"use client";

const activities = [
  {
    name: "Morning Flow Yoga",
    time: "8:00 AM - 9:00 AM",
    capacity: "12 people",
    location: "Movement Studio",
    duration: "60 minutes",
    price: "€40",
    image: "/images/activities/weeklyschedule/img1.png",
  },
  {
    name: "Transformational Breathwork",
    time: "8:00 AM - 9:00 AM",
    capacity: "12 people",
    location: "Movement Studio",
    duration: "60 minutes",
    price: "€40",
    image: "/images/activities/weeklyschedule/img2.png",
  },
  {
    name: "Guided Meditation",
    time: "8:00 AM - 9:00 AM",
    capacity: "12 people",
    location: "Movement Studio",
    duration: "60 minutes",
    price: "€40",
    image: "/images/activities/weeklyschedule/img3.png",
  },
  {
    name: "Restorative Yoga",
    time: "8:00 AM - 9:00 AM",
    capacity: "12 people",
    location: "Movement Studio",
    duration: "60 minutes",
    price: "€40",
    image: "/images/activities/weeklyschedule/img4.png",
  },
  {
    name: "Sound Healing Circle",
    time: "8:00 AM - 9:00 AM",
    capacity: "12 people",
    location: "Movement Studio",
    duration: "60 minutes",
    price: "€40",
    image: "/images/activities/weeklyschedule/img5.png",
  },
  {
    name: "Mindfulness Workshop",
    time: "8:00 AM - 9:00 AM",
    capacity: "12 people",
    location: "Movement Studio",
    duration: "60 minutes",
    price: "€40",
    image: "/images/activities/weeklyschedule/img6.png",
  },
];

import ActivityCard from "@/components/shared/ActivityCard";

// ... existing code ...

const WeeklySchedule = () => {
  return (
    <section className="bg-white py-16 lg:py-24 px-6 md:px-12 lg:px-16 xl:px-24">
      {/* Title */}
      <h2
        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] text-center mb-12 sm:mb-14"
        style={{
          fontFamily: "var(--font-playfair)",
          lineHeight: "140%",
        }}
      >
        This Week&apos;s Schedule
      </h2>

      {/* 3×2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto w-full">
        {activities.map((activity, i) => (
          <ActivityCard key={i} activity={activity} />
        ))}
      </div>
    </section>
  );
};

export default WeeklySchedule;
