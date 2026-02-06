"use client";

import { useState } from "react";

type ContentType = "video" | "course" | "article" | "webinar";
type ContentCategory = "cooking" | "nutrition" | "fitness" | "wellness" | "recipes" | "diet_plans";
type DifficultyLevel = "beginner" | "intermediate" | "advanced";

interface VideoContent {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  category: ContentCategory;
  thumbnail: string;
  duration: number;
  instructor: {
    name: string;
    avatar: string;
    title: string;
  };
  rating: number;
  reviews: number;
  views: number;
  difficulty: DifficultyLevel;
  isFree: boolean;
  isPremium: boolean;
  progress?: number;
  lessons?: number;
  completedLessons?: number;
}

interface Webinar {
  id: string;
  title: string;
  description: string;
  date: Date;
  duration: number;
  instructor: {
    name: string;
    avatar: string;
    title: string;
  };
  registered: number;
  maxParticipants: number;
  isLive: boolean;
  topics: string[];
}

const mockVideos: VideoContent[] = [
  {
    id: "v1",
    title: "Healthy Nepali Cooking Basics",
    description: "Learn the fundamentals of healthy Nepali cooking with traditional ingredients",
    type: "course",
    category: "cooking",
    thumbnail: "🍳",
    duration: 120,
    instructor: { name: "Chef Binita", avatar: "👩‍🍳", title: "Master Chef" },
    rating: 4.9,
    reviews: 234,
    views: 12500,
    difficulty: "beginner",
    isFree: true,
    isPremium: false,
    lessons: 12,
    completedLessons: 5,
    progress: 42,
  },
  {
    id: "v2",
    title: "Understanding Macronutrients",
    description: "Complete guide to proteins, carbs, and fats for optimal health",
    type: "course",
    category: "nutrition",
    thumbnail: "📊",
    duration: 90,
    instructor: { name: "Dr. Ramesh", avatar: "👨‍⚕️", title: "Nutritionist" },
    rating: 4.8,
    reviews: 189,
    views: 8900,
    difficulty: "intermediate",
    isFree: false,
    isPremium: true,
    lessons: 8,
    completedLessons: 0,
  },
  {
    id: "v3",
    title: "30-Minute Dal Bhat Mastery",
    description: "Quick and healthy dal bhat preparation techniques",
    type: "video",
    category: "recipes",
    thumbnail: "🍛",
    duration: 32,
    instructor: { name: "Chef Binita", avatar: "👩‍🍳", title: "Master Chef" },
    rating: 4.7,
    reviews: 456,
    views: 25600,
    difficulty: "beginner",
    isFree: true,
    isPremium: false,
  },
  {
    id: "v4",
    title: "Diabetes-Friendly Meal Prep",
    description: "Weekly meal prep guide for managing blood sugar",
    type: "course",
    category: "diet_plans",
    thumbnail: "🥗",
    duration: 150,
    instructor: { name: "Dr. Priya", avatar: "👩‍⚕️", title: "Dietician" },
    rating: 4.9,
    reviews: 312,
    views: 15800,
    difficulty: "intermediate",
    isFree: false,
    isPremium: true,
    lessons: 10,
    completedLessons: 3,
    progress: 30,
  },
  {
    id: "v5",
    title: "Home Workout for Weight Loss",
    description: "No equipment needed - burn fat at home",
    type: "course",
    category: "fitness",
    thumbnail: "🏋️",
    duration: 180,
    instructor: { name: "Trainer Sanjay", avatar: "💪", title: "Fitness Coach" },
    rating: 4.6,
    reviews: 567,
    views: 32100,
    difficulty: "beginner",
    isFree: true,
    isPremium: false,
    lessons: 15,
    completedLessons: 8,
    progress: 53,
  },
  {
    id: "v6",
    title: "Mindful Eating Meditation",
    description: "Transform your relationship with food through mindfulness",
    type: "video",
    category: "wellness",
    thumbnail: "🧘",
    duration: 25,
    instructor: { name: "Maya Shakya", avatar: "🧘‍♀️", title: "Wellness Coach" },
    rating: 4.8,
    reviews: 145,
    views: 7800,
    difficulty: "beginner",
    isFree: true,
    isPremium: false,
  },
  {
    id: "v7",
    title: "Advanced Protein Calculations",
    description: "Learn to calculate your exact protein needs",
    type: "article",
    category: "nutrition",
    thumbnail: "📝",
    duration: 15,
    instructor: { name: "Dr. Ramesh", avatar: "👨‍⚕️", title: "Nutritionist" },
    rating: 4.5,
    reviews: 89,
    views: 4500,
    difficulty: "advanced",
    isFree: false,
    isPremium: true,
  },
  {
    id: "v8",
    title: "Healthy Momo Recipes",
    description: "5 healthy momo variations with nutrition info",
    type: "video",
    category: "recipes",
    thumbnail: "🥟",
    duration: 45,
    instructor: { name: "Chef Binita", avatar: "👩‍🍳", title: "Master Chef" },
    rating: 4.9,
    reviews: 678,
    views: 45200,
    difficulty: "beginner",
    isFree: true,
    isPremium: false,
  },
];

const mockWebinars: Webinar[] = [
  {
    id: "w1",
    title: "Live Q&A: Nutrition for Busy Professionals",
    description: "Get your nutrition questions answered live by our expert panel",
    date: new Date("2026-02-10T14:00:00"),
    duration: 60,
    instructor: { name: "Dr. Priya", avatar: "👩‍⚕️", title: "Senior Dietician" },
    registered: 156,
    maxParticipants: 200,
    isLive: false,
    topics: ["Meal prep", "Time management", "Healthy snacking", "Eating out"],
  },
  {
    id: "w2",
    title: "Cooking Demo: Quick Healthy Breakfasts",
    description: "Watch and cook along with Chef Binita",
    date: new Date("2026-02-08T10:00:00"),
    duration: 45,
    instructor: { name: "Chef Binita", avatar: "👩‍🍳", title: "Master Chef" },
    registered: 89,
    maxParticipants: 150,
    isLive: true,
    topics: ["Poha", "Upma", "Smoothie bowls", "Overnight oats"],
  },
  {
    id: "w3",
    title: "Understanding Food Labels",
    description: "Learn to decode nutrition labels and make informed choices",
    date: new Date("2026-02-15T16:00:00"),
    duration: 45,
    instructor: { name: "Dr. Ramesh", avatar: "👨‍⚕️", title: "Nutritionist" },
    registered: 234,
    maxParticipants: 300,
    isLive: false,
    topics: ["Reading labels", "Hidden sugars", "Serving sizes", "Additives"],
  },
];

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState<"all" | "courses" | "videos" | "webinars" | "saved">("all");
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory | "all">("all");
  const [selectedContent, setSelectedContent] = useState<VideoContent | null>(null);
  const [selectedWebinar, setSelectedWebinar] = useState<Webinar | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContent = mockVideos.filter((content) => {
    if (activeTab === "courses" && content.type !== "course") return false;
    if (activeTab === "videos" && content.type !== "video") return false;
    if (selectedCategory !== "all" && content.category !== selectedCategory) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        content.title.toLowerCase().includes(query) ||
        content.description.toLowerCase().includes(query) ||
        content.instructor.name.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const inProgressCourses = mockVideos.filter((v) => v.progress && v.progress > 0);

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-700";
      case "intermediate":
        return "bg-yellow-100 text-yellow-700";
      case "advanced":
        return "bg-red-100 text-red-700";
    }
  };

  const getCategoryIcon = (category: ContentCategory) => {
    switch (category) {
      case "cooking":
        return "🍳";
      case "nutrition":
        return "📊";
      case "fitness":
        return "🏋️";
      case "wellness":
        return "🧘";
      case "recipes":
        return "📖";
      case "diet_plans":
        return "📋";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Learn & Educate</h1>
        <p className="text-neutral-600">
          Videos, courses, and webinars to improve your nutrition knowledge
        </p>
      </div>

      {/* Continue Learning */}
      {inProgressCourses.length > 0 && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white">
          <h2 className="text-lg font-semibold mb-4">📚 Continue Learning</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProgressCourses.slice(0, 3).map((course) => (
              <div
                key={course.id}
                onClick={() => setSelectedContent(course)}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 cursor-pointer hover:bg-white/20 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{course.thumbnail}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{course.title}</h3>
                    <p className="text-sm text-white/80">
                      {course.completedLessons}/{course.lessons} lessons
                    </p>
                    <div className="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search courses, videos, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as ContentCategory | "all")}
            className="px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Categories</option>
            <option value="cooking">Cooking</option>
            <option value="nutrition">Nutrition</option>
            <option value="fitness">Fitness</option>
            <option value="wellness">Wellness</option>
            <option value="recipes">Recipes</option>
            <option value="diet_plans">Diet Plans</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-200 overflow-x-auto">
        {[
          { id: "all", label: "All Content", icon: "📚" },
          { id: "courses", label: "Courses", icon: "🎓" },
          { id: "videos", label: "Videos", icon: "🎬" },
          { id: "webinars", label: "Live Webinars", icon: "📡" },
          { id: "saved", label: "Saved", icon: "💾" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "text-primary-600 border-b-2 border-primary-500"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Webinars Section */}
      {activeTab === "webinars" && (
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Upcoming Live Sessions</h3>
          {mockWebinars.map((webinar) => (
            <div
              key={webinar.id}
              onClick={() => setSelectedWebinar(webinar)}
              className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 cursor-pointer hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-primary-50 rounded-xl flex items-center justify-center">
                  <span className="text-3xl">{webinar.instructor.avatar}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-neutral-900">{webinar.title}</h3>
                    {webinar.isLive && (
                      <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                        🔴 LIVE NOW
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-500 mt-1">{webinar.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="text-neutral-600">
                      📅 {webinar.date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    </span>
                    <span className="text-neutral-600">
                      ⏰ {webinar.date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span className="text-neutral-600">⏱️ {webinar.duration} min</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {webinar.topics.slice(0, 3).map((topic) => (
                      <span key={topic} className="text-xs bg-neutral-100 px-2 py-0.5 rounded-full">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-500">
                    {webinar.registered}/{webinar.maxParticipants} registered
                  </p>
                  <button className="mt-2 px-4 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors">
                    {webinar.isLive ? "Join Now" : "Register"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content Grid */}
      {activeTab !== "webinars" && activeTab !== "saved" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredContent.map((content) => (
            <div
              key={content.id}
              onClick={() => setSelectedContent(content)}
              className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden cursor-pointer hover:shadow-md transition-all"
            >
              <div className="h-32 bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center relative">
                <span className="text-5xl">{content.thumbnail}</span>
                {content.isPremium && (
                  <span className="absolute top-2 right-2 text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full">
                    ⭐ Premium
                  </span>
                )}
                {content.isFree && (
                  <span className="absolute top-2 right-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                    Free
                  </span>
                )}
                <span className="absolute bottom-2 right-2 text-xs bg-black/70 text-white px-2 py-0.5 rounded-full">
                  {formatDuration(content.duration)}
                </span>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(content.difficulty)}`}>
                    {content.difficulty}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {getCategoryIcon(content.category)} {content.category.replace("_", " ")}
                  </span>
                </div>

                <h3 className="font-semibold text-neutral-900 line-clamp-2">{content.title}</h3>

                <div className="flex items-center gap-2 mt-2">
                  <span className="text-lg">{content.instructor.avatar}</span>
                  <span className="text-sm text-neutral-600">{content.instructor.name}</span>
                </div>

                <div className="flex items-center gap-3 mt-3 text-sm">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>{content.rating}</span>
                  </div>
                  <span className="text-neutral-400">•</span>
                  <span className="text-neutral-500">{content.views.toLocaleString()} views</span>
                </div>

                {content.progress !== undefined && content.progress > 0 && (
                  <div className="mt-3">
                    <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full"
                        style={{ width: `${content.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">{content.progress}% complete</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Saved Tab */}
      {activeTab === "saved" && (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-neutral-100">
          <span className="text-5xl">💾</span>
          <h3 className="mt-4 text-lg font-semibold text-neutral-900">No saved content</h3>
          <p className="text-neutral-500">Save videos and courses to watch later</p>
          <button
            onClick={() => setActiveTab("all")}
            className="mt-4 px-6 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
          >
            Browse Content
          </button>
        </div>
      )}

      {/* Featured Instructors */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
        <h3 className="font-semibold text-neutral-900 mb-4">👨‍🏫 Featured Instructors</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "Chef Binita", avatar: "👩‍🍳", title: "Master Chef", courses: 12, students: 15000 },
            { name: "Dr. Ramesh", avatar: "👨‍⚕️", title: "Nutritionist", courses: 8, students: 12000 },
            { name: "Trainer Sanjay", avatar: "💪", title: "Fitness Coach", courses: 15, students: 25000 },
          ].map((instructor) => (
            <div key={instructor.name} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center text-2xl">
                {instructor.avatar}
              </div>
              <div>
                <h4 className="font-medium text-neutral-900">{instructor.name}</h4>
                <p className="text-sm text-neutral-500">{instructor.title}</p>
                <p className="text-xs text-neutral-400">
                  {instructor.courses} courses • {(instructor.students / 1000).toFixed(0)}k students
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Detail Modal */}
      {selectedContent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center relative">
              <span className="text-7xl">{selectedContent.thumbnail}</span>
              <button
                onClick={() => setSelectedContent(null)}
                className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {selectedContent.isPremium && (
                <span className="absolute top-4 left-4 text-sm bg-amber-500 text-white px-3 py-1 rounded-full">
                  ⭐ Premium
                </span>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-sm px-3 py-1 rounded-full ${getDifficultyColor(selectedContent.difficulty)}`}>
                  {selectedContent.difficulty}
                </span>
                <span className="text-sm bg-neutral-100 px-3 py-1 rounded-full">
                  {selectedContent.type}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-neutral-900">{selectedContent.title}</h2>
              <p className="text-neutral-500 mt-2">{selectedContent.description}</p>

              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedContent.instructor.avatar}</span>
                  <div>
                    <p className="font-medium text-neutral-900">{selectedContent.instructor.name}</p>
                    <p className="text-sm text-neutral-500">{selectedContent.instructor.title}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-1">
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-medium">{selectedContent.rating}</span>
                  <span className="text-neutral-400">({selectedContent.reviews} reviews)</span>
                </div>
                <span>⏱️ {formatDuration(selectedContent.duration)}</span>
                <span>👁️ {selectedContent.views.toLocaleString()} views</span>
                {selectedContent.lessons && <span>📚 {selectedContent.lessons} lessons</span>}
              </div>

              {selectedContent.progress !== undefined && (
                <div className="mt-4 p-4 bg-primary-50 rounded-xl">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-primary-700">Your Progress</span>
                    <span className="text-primary-600">{selectedContent.progress}% complete</span>
                  </div>
                  <div className="h-2 bg-primary-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full"
                      style={{ width: `${selectedContent.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button className="flex-1 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors">
                  {selectedContent.progress ? "Continue Watching" : "Start Learning"}
                </button>
                <button className="px-4 py-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors">
                  💾 Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Webinar Detail Modal */}
      {selectedWebinar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-neutral-900">{selectedWebinar.title}</h2>
                <button
                  onClick={() => setSelectedWebinar(null)}
                  className="p-2 hover:bg-neutral-100 rounded-full"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-neutral-500">{selectedWebinar.description}</p>

              <div className="flex items-center gap-4 mt-4 p-4 bg-neutral-50 rounded-xl">
                <span className="text-3xl">{selectedWebinar.instructor.avatar}</span>
                <div>
                  <p className="font-medium">{selectedWebinar.instructor.name}</p>
                  <p className="text-sm text-neutral-500">{selectedWebinar.instructor.title}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-sm">
                  📅 {selectedWebinar.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                </p>
                <p className="text-sm">
                  ⏰ {selectedWebinar.date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} ({selectedWebinar.duration} min)
                </p>
                <p className="text-sm">
                  👥 {selectedWebinar.registered}/{selectedWebinar.maxParticipants} registered
                </p>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-neutral-700 mb-2">Topics Covered:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedWebinar.topics.map((topic) => (
                    <span key={topic} className="text-sm bg-primary-100 text-primary-700 px-3 py-1 rounded-full">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <button className="w-full mt-6 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors">
                {selectedWebinar.isLive ? "🔴 Join Live Now" : "Register for Free"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
