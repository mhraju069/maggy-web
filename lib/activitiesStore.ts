/**
 * Activities Management & Storage Utility
 * Manages Yoga, Breathwork, Workshops, Special classes, One-time activities, and Event evenings.
 * Allows client booking and admin creation/editing for both recurring and one-time activities.
 */

export interface Activity {
  id: string;
  name: string;
  category: "Yoga" | "Breathwork" | "Workshops" | "Special classes" | "One-time activities" | "Event evenings";
  description: string;
  date: string; // e.g. "2026-10-15" or "Every Mon & Wed"
  startTime: string; // e.g. "08:00"
  endTime: string; // e.g. "09:30"
  price: number; // e.g. 40
  maxParticipants: number; // Maximum number of participants e.g. 12
  bookedParticipants: number; // Current bookings count e.g. 4
  teacherHost: string; // Teacher/host name e.g. "Elena Rostova"
  additionalInfo: string; // Any additional info e.g. "Yoga mats provided. Tea afterwards."
  isRecurring: boolean; // true = recurring, false = one-time event
  image: string;
}

export const initialActivities: Activity[] = [
  {
    id: "act-1",
    name: "Morning Flow Yoga",
    category: "Yoga",
    description: "Invigorating morning vinyasa flow designed to wake up the body, build gentle strength, and center the mind.",
    date: "2026-10-15",
    startTime: "08:00",
    endTime: "09:15",
    price: 40,
    maxParticipants: 12,
    bookedParticipants: 4,
    teacherHost: "Elena Rostova",
    additionalInfo: "All levels welcome. Premium organic cotton yoga mats, bolsters, and herbal tea provided.",
    isRecurring: true,
    image: "/images/activities/weeklyschedule/img1.png",
  },
  {
    id: "act-2",
    name: "Transformational Breathwork",
    category: "Breathwork",
    description: "Deep somatic conscious connected breathing session to release emotional blockages and expand vitality.",
    date: "2026-10-16",
    startTime: "10:00",
    endTime: "11:30",
    price: 45,
    maxParticipants: 10,
    bookedParticipants: 6,
    teacherHost: "Marcus Vance",
    additionalInfo: "Please arrive 10 mins early on an empty stomach. Eye masks and blankets provided.",
    isRecurring: true,
    image: "/images/activities/weeklyschedule/img2.png",
  },
  {
    id: "act-3",
    name: "Sound Healing & Cacao Ceremony Workshop",
    category: "Workshops",
    description: "Immersive 2.5-hour workshop combining ceremonial ceremonial-grade Ecuadorian cacao with Tibetan singing bowls and gong sound bath.",
    date: "2026-10-20",
    startTime: "18:30",
    endTime: "21:00",
    price: 65,
    maxParticipants: 15,
    bookedParticipants: 8,
    teacherHost: "Sanne De Jong & Guest Master",
    additionalInfo: "Includes ceremonial cacao drink, guided sound journey, and integration sharing circle.",
    isRecurring: false,
    image: "/images/activities/weeklyschedule/img3.png",
  },
  {
    id: "act-4",
    name: "Restorative Evening Yoga & Tea",
    category: "Special classes",
    description: "Slow, soothing restorative postures held with props to calm the nervous system and promote deep sleep.",
    date: "2026-10-18",
    startTime: "19:00",
    endTime: "20:30",
    price: 35,
    maxParticipants: 12,
    bookedParticipants: 3,
    teacherHost: "Elena Rostova",
    additionalInfo: "Wear warm, soft clothing. Organic chamomile & lavender tea served afterwards in our lounge.",
    isRecurring: true,
    image: "/images/activities/weeklyschedule/img4.png",
  },
  {
    id: "act-5",
    name: "Autumn Wellness Solstice Evening",
    category: "Event evenings",
    description: "Special seasonal event evening featuring sauna rituals, cold plunges, sound therapy, and healthy gourmet light bites.",
    date: "2026-10-24",
    startTime: "18:00",
    endTime: "22:00",
    price: 85,
    maxParticipants: 20,
    bookedParticipants: 14,
    teacherHost: "Maggy Wellness Team",
    additionalInfo: "Full evening access to private sauna lounge, ice bath, organic snacks, and live ambient music.",
    isRecurring: false,
    image: "/images/activities/weeklyschedule/img5.png",
  },
];

const STORAGE_KEY = "maggy_activities_store";

export const getActivities = (): Activity[] => {
  if (typeof window === "undefined") return initialActivities;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialActivities));
      return initialActivities;
    }
    return JSON.parse(raw);
  } catch {
    return initialActivities;
  }
};

export const saveActivity = (activity: Activity): Activity[] => {
  const list = getActivities();
  const index = list.findIndex((a) => a.id === activity.id);
  let updated: Activity[];
  if (index >= 0) {
    updated = [...list];
    updated[index] = activity;
  } else {
    updated = [activity, ...list];
  }
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }
  return updated;
};

export const deleteActivity = (id: string): Activity[] => {
  const list = getActivities();
  const updated = list.filter((a) => a.id !== id);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }
  return updated;
};
