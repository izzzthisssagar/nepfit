"use client";

import { useState } from "react";

interface Event {
  id: string;
  name: string;
  date: Date;
  time: string;
  guestCount: number;
  type: "dinner" | "party" | "bbq" | "brunch" | "potluck" | "holiday";
  status: "planning" | "shopping" | "preparing" | "completed";
  menu: MenuItem[];
  guests: Guest[];
  shoppingList: ShoppingItem[];
  notes?: string;
}

interface MenuItem {
  id: string;
  name: string;
  category: "appetizer" | "main" | "side" | "dessert" | "drink";
  servings: number;
  recipe?: string;
  assignedTo?: string;
}

interface Guest {
  id: string;
  name: string;
  rsvp: "yes" | "no" | "maybe" | "pending";
  dietaryRestrictions?: string[];
  bringing?: string;
  email?: string;
}

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  checked: boolean;
  forDish?: string;
}

const eventTypes = [
  { id: "dinner", name: "Dinner Party", icon: "🍽️" },
  { id: "party", name: "House Party", icon: "🎉" },
  { id: "bbq", name: "BBQ/Cookout", icon: "🍖" },
  { id: "brunch", name: "Brunch", icon: "🥞" },
  { id: "potluck", name: "Potluck", icon: "🥘" },
  { id: "holiday", name: "Holiday Meal", icon: "🦃" },
];

const mockEvents: Event[] = [
  {
    id: "1",
    name: "Birthday Dinner Party",
    date: new Date(Date.now() + 7 * 86400000),
    time: "7:00 PM",
    guestCount: 12,
    type: "dinner",
    status: "planning",
    menu: [
      { id: "m1", name: "Bruschetta", category: "appetizer", servings: 12 },
      { id: "m2", name: "Caesar Salad", category: "side", servings: 12 },
      { id: "m3", name: "Grilled Salmon", category: "main", servings: 12 },
      { id: "m4", name: "Roasted Vegetables", category: "side", servings: 12 },
      { id: "m5", name: "Chocolate Cake", category: "dessert", servings: 12 },
      { id: "m6", name: "Sangria", category: "drink", servings: 24 },
    ],
    guests: [
      { id: "g1", name: "John Smith", rsvp: "yes", dietaryRestrictions: ["gluten-free"] },
      { id: "g2", name: "Jane Doe", rsvp: "yes" },
      { id: "g3", name: "Mike Johnson", rsvp: "maybe", bringing: "Wine" },
      { id: "g4", name: "Sarah Williams", rsvp: "pending" },
      { id: "g5", name: "Tom Brown", rsvp: "yes", dietaryRestrictions: ["vegetarian"] },
    ],
    shoppingList: [
      { id: "s1", name: "Salmon fillets", quantity: "3 lbs", category: "Seafood", checked: false, forDish: "Grilled Salmon" },
      { id: "s2", name: "Baguette", quantity: "2", category: "Bakery", checked: true, forDish: "Bruschetta" },
      { id: "s3", name: "Roma tomatoes", quantity: "8", category: "Produce", checked: false, forDish: "Bruschetta" },
      { id: "s4", name: "Romaine lettuce", quantity: "3 heads", category: "Produce", checked: false, forDish: "Caesar Salad" },
    ],
    notes: "Remember to get birthday candles!",
  },
  {
    id: "2",
    name: "Summer BBQ",
    date: new Date(Date.now() + 14 * 86400000),
    time: "2:00 PM",
    guestCount: 20,
    type: "bbq",
    status: "planning",
    menu: [],
    guests: [],
    shoppingList: [],
  },
];

const categoryColors: Record<string, { bg: string; text: string }> = {
  appetizer: { bg: "bg-orange-100", text: "text-orange-700" },
  main: { bg: "bg-red-100", text: "text-red-700" },
  side: { bg: "bg-green-100", text: "text-green-700" },
  dessert: { bg: "bg-pink-100", text: "text-pink-700" },
  drink: { bg: "bg-blue-100", text: "text-blue-700" },
};

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<"events" | "planning" | "guests" | "shopping">("events");
  const [events] = useState<Event[]>(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(mockEvents[0]);
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [showAddDishModal, setShowAddDishModal] = useState(false);

  const getEventTypeInfo = (type: string) => {
    return eventTypes.find((t) => t.id === type) || eventTypes[0];
  };

  const getRsvpCounts = (guests: Guest[]) => {
    return {
      yes: guests.filter((g) => g.rsvp === "yes").length,
      no: guests.filter((g) => g.rsvp === "no").length,
      maybe: guests.filter((g) => g.rsvp === "maybe").length,
      pending: guests.filter((g) => g.rsvp === "pending").length,
    };
  };

  const getDietaryRestrictions = (guests: Guest[]): string[] => {
    const restrictions = new Set<string>();
    guests.forEach((g) => {
      g.dietaryRestrictions?.forEach((r) => restrictions.add(r));
    });
    return Array.from(restrictions);
  };

  const calculatePortions = (servings: number, guestCount: number): string => {
    const ratio = servings / guestCount;
    if (ratio >= 1) return "✓ Enough";
    return `Need ${Math.ceil(guestCount - servings)} more`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-purple-50 to-violet-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Event & Party Planner</h1>
          <p className="text-gray-600 mt-1">Plan meals for gatherings and events</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "events", label: "My Events", icon: "🎉" },
            { id: "planning", label: "Menu Planning", icon: "📋" },
            { id: "guests", label: "Guest List", icon: "👥" },
            { id: "shopping", label: "Shopping List", icon: "🛒" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-purple-50"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Events Tab */}
        {activeTab === "events" && (
          <div className="space-y-6">
            {/* Upcoming Events */}
            <div className="space-y-4">
              {events.map((event) => {
                const typeInfo = getEventTypeInfo(event.type);
                const rsvpCounts = getRsvpCounts(event.guests);
                return (
                  <div
                    key={event.id}
                    className={`bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer transition-shadow hover:shadow-md ${
                      selectedEvent?.id === event.id ? "ring-2 ring-purple-500" : ""
                    }`}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl">{typeInfo.icon}</span>
                          <div>
                            <h3 className="font-semibold text-gray-900">{event.name}</h3>
                            <p className="text-sm text-gray-500">
                              {event.date.toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })}{" "}
                              at {event.time}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            event.status === "planning"
                              ? "bg-blue-100 text-blue-700"
                              : event.status === "shopping"
                              ? "bg-yellow-100 text-yellow-700"
                              : event.status === "preparing"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {event.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 mt-4 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <span>👥</span>
                          <span>{event.guestCount} guests</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <span>🍽️</span>
                          <span>{event.menu.length} dishes</span>
                        </div>
                        {event.guests.length > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-green-600">{rsvpCounts.yes} yes</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-yellow-600">{rsvpCounts.maybe} maybe</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500">{rsvpCounts.pending} pending</span>
                          </div>
                        )}
                      </div>

                      {/* Days Until */}
                      <div className="mt-4 p-3 bg-purple-50 rounded-xl">
                        <p className="text-purple-700 font-medium">
                          ⏰{" "}
                          {Math.ceil(
                            (event.date.getTime() - Date.now()) / 86400000
                          )}{" "}
                          days until event
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Create New Event */}
            <button
              onClick={() => setShowNewEventModal(true)}
              className="w-full p-4 bg-white rounded-2xl shadow-sm border-2 border-dashed border-gray-200 text-gray-500 hover:border-purple-300 hover:text-purple-600 transition-colors"
            >
              + Create New Event
            </button>
          </div>
        )}

        {/* Menu Planning Tab */}
        {activeTab === "planning" && selectedEvent && (
          <div className="space-y-6">
            {/* Event Header */}
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getEventTypeInfo(selectedEvent.type).icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedEvent.name}</h3>
                    <p className="text-sm text-gray-500">{selectedEvent.guestCount} guests</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddDishModal(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium"
                >
                  + Add Dish
                </button>
              </div>
            </div>

            {/* Dietary Restrictions Alert */}
            {getDietaryRestrictions(selectedEvent.guests).length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <h4 className="font-medium text-amber-800 mb-2">⚠️ Dietary Restrictions</h4>
                <div className="flex flex-wrap gap-2">
                  {getDietaryRestrictions(selectedEvent.guests).map((restriction, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white text-amber-700 rounded-full text-sm"
                    >
                      {restriction}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Menu by Category */}
            {["appetizer", "main", "side", "dessert", "drink"].map((category) => {
              const dishes = selectedEvent.menu.filter((m) => m.category === category);
              if (dishes.length === 0) return null;

              return (
                <div key={category} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div
                    className={`p-3 ${categoryColors[category].bg} ${categoryColors[category].text}`}
                  >
                    <h4 className="font-medium capitalize">{category}s</h4>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {dishes.map((dish) => (
                      <div key={dish.id} className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{dish.name}</p>
                          <p className="text-sm text-gray-500">
                            Serves {dish.servings} •{" "}
                            <span
                              className={
                                dish.servings >= selectedEvent.guestCount
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {calculatePortions(dish.servings, selectedEvent.guestCount)}
                            </span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {dish.assignedTo && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                              {dish.assignedTo}
                            </span>
                          )}
                          <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Portion Calculator */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-2">📊 Portion Calculator</h3>
              <p className="text-sm opacity-90 mb-4">
                Automatically calculate quantities based on guest count
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <p className="text-sm opacity-80">Per Person</p>
                  <p className="text-xl font-bold">
                    ~{Math.round(
                      selectedEvent.menu.reduce((sum, m) => sum + m.servings, 0) /
                        selectedEvent.guestCount
                    )}{" "}
                    servings
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <p className="text-sm opacity-80">Total Dishes</p>
                  <p className="text-xl font-bold">{selectedEvent.menu.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Guests Tab */}
        {activeTab === "guests" && selectedEvent && (
          <div className="space-y-6">
            {/* RSVP Summary */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { status: "yes", label: "Confirmed", color: "bg-green-100 text-green-700" },
                { status: "maybe", label: "Maybe", color: "bg-yellow-100 text-yellow-700" },
                { status: "pending", label: "Pending", color: "bg-gray-100 text-gray-700" },
                { status: "no", label: "Declined", color: "bg-red-100 text-red-700" },
              ].map((item) => {
                const count = getRsvpCounts(selectedEvent.guests)[
                  item.status as keyof ReturnType<typeof getRsvpCounts>
                ];
                return (
                  <div key={item.status} className="bg-white rounded-xl p-4 shadow-sm text-center">
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                    <p className={`text-sm mt-1 px-2 py-0.5 rounded-full inline-block ${item.color}`}>
                      {item.label}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Guest List */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Guest List</h3>
                <button
                  onClick={() => setShowAddGuestModal(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium"
                >
                  + Add Guest
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {selectedEvent.guests.map((guest) => (
                  <div key={guest.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-semibold">
                          {guest.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{guest.name}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {guest.dietaryRestrictions?.map((r, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full"
                            >
                              {r}
                            </span>
                          ))}
                          {guest.bringing && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                              Bringing: {guest.bringing}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <select
                      value={guest.rsvp}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border-0 ${
                        guest.rsvp === "yes"
                          ? "bg-green-100 text-green-700"
                          : guest.rsvp === "no"
                          ? "bg-red-100 text-red-700"
                          : guest.rsvp === "maybe"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <option value="yes">✓ Yes</option>
                      <option value="no">✗ No</option>
                      <option value="maybe">? Maybe</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Send Invitations */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Send Invitations</h3>
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-3 bg-purple-100 text-purple-700 rounded-xl font-medium flex items-center justify-center gap-2">
                  <span>📧</span> Email
                </button>
                <button className="flex-1 px-4 py-3 bg-green-100 text-green-700 rounded-xl font-medium flex items-center justify-center gap-2">
                  <span>💬</span> Text
                </button>
                <button className="flex-1 px-4 py-3 bg-blue-100 text-blue-700 rounded-xl font-medium flex items-center justify-center gap-2">
                  <span>🔗</span> Share Link
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Shopping Tab */}
        {activeTab === "shopping" && selectedEvent && (
          <div className="space-y-6">
            {/* Progress */}
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Shopping Progress</h3>
                <span className="text-purple-600 font-medium">
                  {selectedEvent.shoppingList.filter((i) => i.checked).length}/
                  {selectedEvent.shoppingList.length} items
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all"
                  style={{
                    width: `${
                      selectedEvent.shoppingList.length > 0
                        ? (selectedEvent.shoppingList.filter((i) => i.checked).length /
                            selectedEvent.shoppingList.length) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Auto-generate Button */}
            <button className="w-full p-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl font-medium flex items-center justify-center gap-2">
              <span>✨</span> Auto-generate Shopping List from Menu
            </button>

            {/* Shopping List by Category */}
            {["Produce", "Seafood", "Bakery", "Dairy", "Pantry"].map((category) => {
              const items = selectedEvent.shoppingList.filter((i) => i.category === category);
              if (items.length === 0) return null;

              return (
                <div key={category} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-3 bg-gray-50 border-b border-gray-100">
                    <h4 className="font-medium text-gray-700">{category}</h4>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className={`p-4 flex items-center gap-3 ${
                          item.checked ? "bg-gray-50" : ""
                        }`}
                      >
                        <button
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            item.checked
                              ? "bg-green-500 border-green-500 text-white"
                              : "border-gray-300"
                          }`}
                        >
                          {item.checked && "✓"}
                        </button>
                        <div className="flex-1">
                          <p
                            className={`font-medium ${
                              item.checked ? "text-gray-400 line-through" : "text-gray-900"
                            }`}
                          >
                            {item.name}
                          </p>
                          {item.forDish && (
                            <p className="text-sm text-gray-500">For: {item.forDish}</p>
                          )}
                        </div>
                        <span className="text-gray-600">{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Estimated Cost */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Estimated Costs</h3>
              <div className="space-y-2">
                {[
                  { category: "Produce", amount: 25 },
                  { category: "Seafood", amount: 45 },
                  { category: "Bakery", amount: 12 },
                  { category: "Beverages", amount: 30 },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between text-gray-600">
                    <span>{item.category}</span>
                    <span>${item.amount.toFixed(2)}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-gray-200 flex justify-between font-semibold text-gray-900">
                  <span>Total Estimate</span>
                  <span>$112.00</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                ~${(112 / selectedEvent.guestCount).toFixed(2)} per guest
              </p>
            </div>

            {/* Share List */}
            <div className="flex gap-3">
              <button className="flex-1 px-4 py-3 bg-white text-gray-700 rounded-xl font-medium border border-gray-200">
                📱 Share List
              </button>
              <button className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl font-medium">
                🛒 Start Shopping
              </button>
            </div>
          </div>
        )}

        {/* New Event Modal */}
        {showNewEventModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Create New Event</h3>
                <button
                  onClick={() => setShowNewEventModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {eventTypes.map((type) => (
                      <button
                        key={type.id}
                        className="p-3 bg-gray-50 hover:bg-purple-50 rounded-xl text-center transition-colors"
                      >
                        <span className="text-2xl">{type.icon}</span>
                        <p className="text-xs text-gray-600 mt-1">{type.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-200 rounded-xl"
                    placeholder="e.g., Summer BBQ"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      className="w-full p-3 border border-gray-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      className="w-full p-3 border border-gray-200 rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Guests
                  </label>
                  <input
                    type="number"
                    className="w-full p-3 border border-gray-200 rounded-xl"
                    placeholder="e.g., 12"
                  />
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => setShowNewEventModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl font-medium">
                  Create Event
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Guest Modal */}
        {showAddGuestModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Add Guest</h3>
                <button
                  onClick={() => setShowAddGuestModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-200 rounded-xl"
                    placeholder="Guest name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email (optional)
                  </label>
                  <input
                    type="email"
                    className="w-full p-3 border border-gray-200 rounded-xl"
                    placeholder="guest@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dietary Restrictions
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Vegetarian", "Vegan", "Gluten-free", "Dairy-free", "Nut allergy"].map(
                      (diet) => (
                        <button
                          key={diet}
                          className="px-3 py-1 bg-gray-100 hover:bg-purple-100 rounded-full text-sm"
                        >
                          {diet}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => setShowAddGuestModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl font-medium">
                  Add Guest
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Dish Modal */}
        {showAddDishModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Add Dish</h3>
                <button
                  onClick={() => setShowAddDishModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dish Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-200 rounded-xl"
                    placeholder="e.g., Caesar Salad"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select className="w-full p-3 border border-gray-200 rounded-xl">
                    <option value="appetizer">Appetizer</option>
                    <option value="main">Main Course</option>
                    <option value="side">Side Dish</option>
                    <option value="dessert">Dessert</option>
                    <option value="drink">Drink</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Servings
                  </label>
                  <input
                    type="number"
                    className="w-full p-3 border border-gray-200 rounded-xl"
                    placeholder="Number of servings"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned to (optional)
                  </label>
                  <select className="w-full p-3 border border-gray-200 rounded-xl">
                    <option value="">Select a guest</option>
                    {selectedEvent?.guests.map((guest) => (
                      <option key={guest.id} value={guest.name}>
                        {guest.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => setShowAddDishModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl font-medium">
                  Add Dish
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
