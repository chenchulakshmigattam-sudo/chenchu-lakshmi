import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CAMPUS_BUILDINGS } from '../data/mockData';
import {
  MapPin,
  Building,
  Search,
  Filter,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  Sparkles,
  Info,
  Navigation
} from 'lucide-react';
import { CampusRoom } from '../types';

export const CampusMapView: React.FC = () => {
  const { rooms, toggleRoomOccupancy } = useApp();

  const [selectedBuildingId, setSelectedBuildingId] = useState<string>('mab');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [occupancyFilter, setOccupancyFilter] = useState<'all' | 'free' | 'occupied'>('all');

  const selectedBuilding = CAMPUS_BUILDINGS.find(b => b.id === selectedBuildingId) || CAMPUS_BUILDINGS[0];

  const filteredRooms = rooms.filter(r => {
    // Search match
    const matchesSearch =
      r.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.building.toLowerCase().includes(searchQuery.toLowerCase());

    // Type match
    const matchesType = typeFilter === 'all' || r.type === typeFilter;

    // Occupancy match
    const matchesOccupancy =
      occupancyFilter === 'all' ||
      (occupancyFilter === 'free' && !r.isOccupied) ||
      (occupancyFilter === 'occupied' && r.isOccupied);

    return matchesSearch && matchesType && matchesOccupancy;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Campus Map & Room Availability</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
              Interactive 2D Map
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Navigate academic blocks, find free study spaces, and check live computer lab availability.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {rooms.filter(r => !r.isOccupied).length} Rooms Free Now
          </span>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
        <span>
          <strong>Campus Sensor Status:</strong> Sample live campus telemetry active. Click any building on the map below to view its floor directory and facilities.
        </span>
      </div>

      {/* Interactive SVG Campus Map */}
      <div className="p-6 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Interactive Campus Layout
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Click any block to inspect</span>
        </div>

        {/* SVG Map Container */}
        <div className="w-full overflow-x-auto rounded-2xl bg-slate-900/80 p-4 border border-slate-800 flex justify-center">
          <svg
            viewBox="0 0 900 640"
            className="w-full max-w-4xl h-auto select-none"
            style={{ minWidth: '600px' }}
          >
            {/* Campus Background & Pathway grid */}
            <rect width="900" height="640" fill="#0f172a" rx="16" />

            {/* Walkways and roads */}
            <path
              d="M 200 40 L 200 600 M 450 40 L 450 600 M 700 40 L 700 600 M 40 280 L 860 280 M 40 460 L 860 460"
              stroke="#1e293b"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
            />
            {/* Green landscaping patches */}
            <rect x="70" y="60" width="100" height="130" rx="16" fill="#064e3b" opacity="0.4" />
            <text x="120" y="130" fill="#34d399" fontSize="11" textAnchor="middle" fontWeight="bold">Central Lawn</text>

            <rect x="700" y="60" width="150" height="180" rx="16" fill="#064e3b" opacity="0.4" />
            <text x="775" y="155" fill="#34d399" fontSize="11" textAnchor="middle" fontWeight="bold">Botanical Garden</text>

            {/* Render Each Building */}
            {CAMPUS_BUILDINGS.map(b => {
              const isSelected = selectedBuildingId === b.id;

              return (
                <g
                  key={b.id}
                  onClick={() => setSelectedBuildingId(b.id)}
                  className="cursor-pointer transition-transform hover:opacity-90"
                >
                  {/* Building Box */}
                  <rect
                    x={b.x}
                    y={b.y}
                    width={b.width}
                    height={b.height}
                    rx="12"
                    fill={isSelected ? '#3b82f6' : b.color}
                    stroke={isSelected ? '#93c5fd' : '#ffffff'}
                    strokeWidth={isSelected ? '4' : '1.5'}
                    className="transition-all"
                  />

                  {/* Building Label */}
                  <text
                    x={b.x + b.width / 2}
                    y={b.y + b.height / 2 - 8}
                    fill="#ffffff"
                    fontSize="12"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {b.name}
                  </text>

                  <text
                    x={b.x + b.width / 2}
                    y={b.y + b.height / 2 + 12}
                    fill="#e2e8f0"
                    fontSize="10"
                    textAnchor="middle"
                    opacity="0.8"
                  >
                    {b.floors} Floors • ({b.code})
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Building Details Bar */}
        {selectedBuilding && (
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-cyan-400 font-bold">[{selectedBuilding.code}]</span>
                <h4 className="font-bold text-sm text-white">{selectedBuilding.name}</h4>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                  {selectedBuilding.floors} Floors
                </span>
              </div>
              <p className="text-slate-400 mt-1">{selectedBuilding.desc}</p>
            </div>

            <button
              onClick={() => {
                setSearchQuery(selectedBuilding.name);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex-shrink-0"
            >
              Filter Rooms in this Block &rarr;
            </button>
          </div>
        )}
      </div>

      {/* Room Availability Directory */}
      <div className="space-y-4">
        {/* Search & Filter Bar */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search classrooms, AI GPU labs, seminar halls, or room numbers..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
            >
              <option value="all">All Room Types</option>
              <option value="Classroom">Classroom</option>
              <option value="Lab">Computer Lab</option>
              <option value="Conference Room">Discussion Room</option>
              <option value="Auditorium">Auditorium</option>
            </select>

            <select
              value={occupancyFilter}
              onChange={e => setOccupancyFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
            >
              <option value="all">All Status</option>
              <option value="free">Available / Free Only</option>
              <option value="occupied">Occupied Only</option>
            </select>
          </div>
        </div>

        {/* Room Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRooms.map(room => (
            <div
              key={room.id}
              className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 transition-all hover:shadow-lg flex flex-col justify-between ${
                room.isOccupied
                  ? 'border-slate-200 dark:border-slate-800'
                  : 'border-emerald-300 dark:border-emerald-900 bg-emerald-50/15 dark:bg-emerald-950/10'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-400">
                      {room.building} • Floor {room.floor}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white mt-0.5">
                      {room.roomNumber} - {room.name}
                    </h3>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      room.isOccupied
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {room.isOccupied ? 'Occupied' : 'Free / Available'}
                  </span>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                  <p className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-500" /> Seating Capacity: <strong>{room.capacity} Students</strong>
                  </p>
                  {room.currentActivity && (
                    <p className="text-blue-600 dark:text-blue-400 font-semibold">
                      Current: {room.currentActivity}
                    </p>
                  )}
                  {room.nextFreeTime && (
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Schedule: {room.nextFreeTime}
                    </p>
                  )}
                </div>

                {/* Features pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {room.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Toggle */}
              <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[11px]">{room.type}</span>
                <button
                  onClick={() => toggleRoomOccupancy(room.id, 'Study Group Reservation')}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {room.isOccupied ? 'Report Vacated' : 'Quick Reserve'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
