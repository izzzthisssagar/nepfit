"use client";

import { useState } from "react";
import { Card, CardHeader, Button, Input } from "@/components/ui";

// Types
interface Expert {
  id: string;
  name: string;
  title: string;
  specializations: string[];
  avatar: string;
  rating: number;
  reviewCount: number;
  experience: number; // years
  languages: string[];
  price: number; // per session in INR
  nextAvailable: string;
  bio: string;
  education: string[];
  isVerified: boolean;
  consultationType: ("video" | "chat" | "call")[];
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

// Mock experts data
const MOCK_EXPERTS: Expert[] = [
  {
    id: "e1",
    name: "Dr. Sunita Sharma",
    title: "Clinical Nutritionist",
    specializations: ["Weight Management", "Diabetes", "PCOS"],
    avatar: "👩‍⚕️",
    rating: 4.9,
    reviewCount: 234,
    experience: 12,
    languages: ["English", "Hindi", "Nepali"],
    price: 599,
    nextAvailable: "Today, 4:00 PM",
    bio: "Dr. Sunita is a certified clinical nutritionist with expertise in metabolic disorders and women's health. She combines traditional dietary wisdom with modern nutritional science.",
    education: ["MSc Clinical Nutrition - AIIMS Delhi", "Certified Diabetes Educator"],
    isVerified: true,
    consultationType: ["video", "chat", "call"],
  },
  {
    id: "e2",
    name: "Rajesh Thapa, RD",
    title: "Sports Nutritionist",
    specializations: ["Sports Nutrition", "Muscle Building", "Athletic Performance"],
    avatar: "👨‍⚕️",
    rating: 4.8,
    reviewCount: 189,
    experience: 8,
    languages: ["English", "Nepali"],
    price: 499,
    nextAvailable: "Tomorrow, 10:00 AM",
    bio: "Rajesh specializes in sports nutrition and has worked with national-level athletes. He helps fitness enthusiasts optimize their diet for peak performance.",
    education: ["BSc Nutrition - TU", "Certified Sports Nutritionist"],
    isVerified: true,
    consultationType: ["video", "call"],
  },
  {
    id: "e3",
    name: "Dr. Anita Gupta",
    title: "Pediatric Nutritionist",
    specializations: ["Child Nutrition", "Picky Eaters", "Growth & Development"],
    avatar: "👩‍⚕️",
    rating: 4.9,
    reviewCount: 312,
    experience: 15,
    languages: ["English", "Hindi"],
    price: 699,
    nextAvailable: "Wed, 2:00 PM",
    bio: "Dr. Anita has helped thousands of parents ensure their children get proper nutrition. She specializes in addressing feeding difficulties and growth concerns.",
    education: ["MD Pediatrics - KGMU", "Fellowship in Pediatric Nutrition"],
    isVerified: true,
    consultationType: ["video", "chat"],
  },
  {
    id: "e4",
    name: "Maya Pradhan",
    title: "Ayurvedic Nutritionist",
    specializations: ["Ayurveda", "Gut Health", "Holistic Wellness"],
    avatar: "👩‍🦱",
    rating: 4.7,
    reviewCount: 156,
    experience: 10,
    languages: ["English", "Nepali", "Hindi"],
    price: 449,
    nextAvailable: "Today, 6:00 PM",
    bio: "Maya combines ancient Ayurvedic principles with modern nutrition science. She specializes in gut health and digestive disorders using natural approaches.",
    education: ["BAMS - Gujarat Ayurved University", "Certified Nutrition Coach"],
    isVerified: true,
    consultationType: ["video", "chat", "call"],
  },
  {
    id: "e5",
    name: "Dr. Bikash KC",
    title: "Diabetologist & Nutritionist",
    specializations: ["Diabetes Management", "Thyroid", "Metabolic Syndrome"],
    avatar: "👨‍⚕️",
    rating: 4.9,
    reviewCount: 423,
    experience: 18,
    languages: ["English", "Nepali"],
    price: 799,
    nextAvailable: "Thu, 11:00 AM",
    bio: "Dr. Bikash is a leading expert in diabetes nutrition with 18 years of experience. He has helped thousands of patients manage their blood sugar through diet.",
    education: ["MD Internal Medicine - IOM", "Advanced Diabetes Management - USA"],
    isVerified: true,
    consultationType: ["video"],
  },
];

const SPECIALIZATIONS = [
  "All",
  "Weight Management",
  "Diabetes",
  "Sports Nutrition",
  "PCOS",
  "Child Nutrition",
  "Ayurveda",
  "Gut Health",
];

const TIME_SLOTS: TimeSlot[] = [
  { id: "t1", time: "9:00 AM", available: true },
  { id: "t2", time: "10:00 AM", available: false },
  { id: "t3", time: "11:00 AM", available: true },
  { id: "t4", time: "12:00 PM", available: true },
  { id: "t5", time: "2:00 PM", available: true },
  { id: "t6", time: "3:00 PM", available: false },
  { id: "t7", time: "4:00 PM", available: true },
  { id: "t8", time: "5:00 PM", available: true },
  { id: "t9", time: "6:00 PM", available: true },
];

export default function ExpertsPage() {
  const [selectedSpecialization, setSelectedSpecialization] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [consultationType, setConsultationType] = useState<"video" | "chat" | "call">("video");

  const filteredExperts = MOCK_EXPERTS.filter((expert) => {
    const matchesSpecialization =
      selectedSpecialization === "All" ||
      expert.specializations.includes(selectedSpecialization);
    const matchesSearch =
      searchQuery === "" ||
      expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.specializations.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSpecialization && matchesSearch;
  });

  // Generate next 7 days
  const getNextDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        date: date.toISOString().split("T")[0],
        label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      });
    }
    return days;
  };

  const handleBooking = () => {
    // In real app, this would process the booking
    alert(`Booking confirmed with ${selectedExpert?.name} on ${selectedDate} at ${selectedSlot}`);
    setShowBookingModal(false);
    setSelectedExpert(null);
    setSelectedDate("");
    setSelectedSlot("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Expert Consultation</h1>
        <p className="text-neutral-500">Connect with certified nutritionists for personalized guidance</p>
      </div>

      {/* Info Banner */}
      <Card gradient="primary" className="text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
            👨‍⚕️
          </div>
          <div>
            <h3 className="font-semibold text-lg">Get Personalized Diet Plans</h3>
            <p className="text-primary-100 text-sm">
              Book a consultation with our verified experts and get customized nutrition advice
            </p>
          </div>
        </div>
      </Card>

      {/* Search and Filter */}
      <div className="space-y-4">
        <Input
          placeholder="Search by name or specialization..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />

        {/* Specialization Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {SPECIALIZATIONS.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialization(spec)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedSpecialization === spec
                  ? "bg-primary-500 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Experts List */}
      <div className="space-y-4">
        {filteredExperts.map((expert) => (
          <Card key={expert.id} hover onClick={() => setSelectedExpert(expert)}>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Avatar and Rating */}
              <div className="flex-shrink-0 text-center">
                <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center text-4xl mx-auto">
                  {expert.avatar}
                </div>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <span className="text-yellow-500">★</span>
                  <span className="font-semibold text-neutral-900">{expert.rating}</span>
                  <span className="text-sm text-neutral-500">({expert.reviewCount})</span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-neutral-900">{expert.name}</h3>
                  {expert.isVerified && (
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <p className="text-sm text-neutral-500">{expert.title} • {expert.experience} years exp</p>

                {/* Specializations */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {expert.specializations.map((spec) => (
                    <span
                      key={spec}
                      className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Languages & Consultation Types */}
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-neutral-500">
                  <span>🗣️ {expert.languages.join(", ")}</span>
                  <span>
                    {expert.consultationType.includes("video") && "📹 "}
                    {expert.consultationType.includes("call") && "📞 "}
                    {expert.consultationType.includes("chat") && "💬"}
                  </span>
                </div>
              </div>

              {/* Price and Book */}
              <div className="text-center sm:text-right">
                <div className="text-2xl font-bold text-primary-600">₹{expert.price}</div>
                <div className="text-xs text-neutral-500 mb-3">per session</div>
                <div className="text-xs text-green-600 mb-2">🟢 {expert.nextAvailable}</div>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedExpert(expert);
                    setShowBookingModal(true);
                  }}
                >
                  Book Now
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredExperts.length === 0 && (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No experts found</h3>
          <p className="text-neutral-500">Try adjusting your search criteria</p>
        </Card>
      )}

      {/* Expert Detail Modal */}
      {selectedExpert && !showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="max-w-lg w-full my-8 animate-bounce-in" padding="lg">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center text-3xl">
                  {selectedExpert.avatar}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">{selectedExpert.name}</h2>
                  <p className="text-neutral-500">{selectedExpert.title}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedExpert(null)}
                className="p-2 hover:bg-neutral-100 rounded-full"
              >
                ✕
              </button>
            </div>

            {/* Rating & Experience */}
            <div className="flex gap-6 mb-6">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500 text-lg">★</span>
                <span className="font-semibold">{selectedExpert.rating}</span>
                <span className="text-sm text-neutral-500">({selectedExpert.reviewCount} reviews)</span>
              </div>
              <div className="text-neutral-600">
                {selectedExpert.experience} years experience
              </div>
            </div>

            {/* Bio */}
            <p className="text-neutral-600 mb-6">{selectedExpert.bio}</p>

            {/* Education */}
            <div className="mb-6">
              <h4 className="font-semibold text-neutral-900 mb-2">Education & Certifications</h4>
              <ul className="space-y-1">
                {selectedExpert.education.map((edu, i) => (
                  <li key={i} className="text-sm text-neutral-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                    {edu}
                  </li>
                ))}
              </ul>
            </div>

            {/* Specializations */}
            <div className="mb-6">
              <h4 className="font-semibold text-neutral-900 mb-2">Specializations</h4>
              <div className="flex flex-wrap gap-2">
                {selectedExpert.specializations.map((spec) => (
                  <span key={spec} className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Price and Book */}
            <div className="bg-neutral-50 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-sm text-neutral-500">Consultation Fee</div>
                <div className="text-2xl font-bold text-primary-600">₹{selectedExpert.price}</div>
              </div>
              <Button onClick={() => setShowBookingModal(true)}>
                Book Consultation
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedExpert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="max-w-lg w-full my-8 animate-bounce-in" padding="lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-neutral-900">Book Consultation</h2>
              <button
                onClick={() => {
                  setShowBookingModal(false);
                  setSelectedDate("");
                  setSelectedSlot("");
                }}
                className="p-2 hover:bg-neutral-100 rounded-full"
              >
                ✕
              </button>
            </div>

            {/* Expert Summary */}
            <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl mb-6">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-2xl">
                {selectedExpert.avatar}
              </div>
              <div>
                <p className="font-semibold text-neutral-900">{selectedExpert.name}</p>
                <p className="text-sm text-neutral-500">{selectedExpert.title}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="font-bold text-primary-600">₹{selectedExpert.price}</p>
              </div>
            </div>

            {/* Consultation Type */}
            <div className="mb-6">
              <h4 className="font-semibold text-neutral-900 mb-3">Consultation Type</h4>
              <div className="flex gap-3">
                {selectedExpert.consultationType.map((type) => (
                  <button
                    key={type}
                    onClick={() => setConsultationType(type)}
                    className={`flex-1 p-3 rounded-xl border-2 text-center transition-all ${
                      consultationType === type
                        ? "border-primary-500 bg-primary-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <span className="text-2xl block mb-1">
                      {type === "video" ? "📹" : type === "call" ? "📞" : "💬"}
                    </span>
                    <span className="text-sm capitalize">{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            <div className="mb-6">
              <h4 className="font-semibold text-neutral-900 mb-3">Select Date</h4>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {getNextDays().map((day) => (
                  <button
                    key={day.date}
                    onClick={() => setSelectedDate(day.date)}
                    className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      selectedDate === day.date
                        ? "bg-primary-500 text-white"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div className="mb-6">
                <h4 className="font-semibold text-neutral-900 mb-3">Select Time</h4>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => slot.available && setSelectedSlot(slot.time)}
                      disabled={!slot.available}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        !slot.available
                          ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                          : selectedSlot === slot.time
                          ? "bg-primary-500 text-white"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Book Button */}
            <Button
              fullWidth
              size="lg"
              disabled={!selectedDate || !selectedSlot}
              onClick={handleBooking}
            >
              Confirm Booking - ₹{selectedExpert.price}
            </Button>

            <p className="text-xs text-neutral-500 text-center mt-3">
              You&apos;ll receive a confirmation email with meeting details
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
