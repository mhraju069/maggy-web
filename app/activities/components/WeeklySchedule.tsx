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
    <section
      style={{
        background: "#FFFFFF",
        padding: "96px 128px",
      }}
    >
      {/* Title */}
      <h2
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: 48,
          fontWeight: 700,
          color: "#0F172A",
          textAlign: "center",
          marginBottom: 56,
          lineHeight: "140%",
        }}
      >
        This Week&apos;s Schedule
      </h2>

      {/* 3×2 Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 32,
        }}
      >
        {activities.map((activity, i) => (
          <ActivityCard key={i} activity={activity} />
        ))}
      </div>
    </section>
  );
};

export default WeeklySchedule;
