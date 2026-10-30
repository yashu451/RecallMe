import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Flame, Sparkles, RotateCcw } from 'lucide-react';

export default function LearningActivityCalendar({ topics = [], quizHistory = [], streak = 0 }) {
  // Navigation anchor date (defaults to current date)
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [hoveredDay, setHoveredDay] = useState(null);

  // Compute real activity counts keyed by YYYY-MM-DD
  const activityMap = useMemo(() => {
    const map = {};

    const normalizeDate = (d) => {
      if (!d || typeof d !== 'string') return null;
      const lower = d.toLowerCase().trim();
      if (lower === 'today' || lower === 'just now') {
        return new Date().toISOString().split('T')[0];
      }
      if (/^\d{4}-\d{2}-\d{2}/.test(d)) {
        return d.slice(0, 10);
      }
      const parsed = Date.parse(d);
      if (!isNaN(parsed)) {
        return new Date(parsed).toISOString().split('T')[0];
      }
      return null;
    };

    // Actual user topics from SQLite
    (topics || []).forEach(t => {
      const createdDate = normalizeDate(t.createdAt);
      if (createdDate) {
        map[createdDate] = (map[createdDate] || 0) + 1;
      }
    });

    // Actual user quiz attempts from SQLite
    (quizHistory || []).forEach(q => {
      const quizDate = normalizeDate(q.date);
      if (quizDate) {
        map[quizDate] = (map[quizDate] || 0) + 1;
      }
    });

    return map;
  }, [topics, quizHistory]);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Navigate months
  const handlePrevMonth = () => {
    setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleResetToday = () => {
    setSelectedDate(new Date());
  };

  // Generate a GitHub-style 16-week window ending around the end of the selected month
  const { weeks, monthLabels, totalPeriodActivities, activeDaysCount } = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    // End date: last day of selected month or today if current month
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const endDate = new Date(Math.min(lastDayOfMonth.getTime(), new Date().getTime()));

    // Adjust to end on Saturday of that week
    const endSaturday = new Date(endDate);
    endSaturday.setDate(endDate.getDate() + (6 - endDate.getDay()));

    // 16 weeks back = 112 days
    const totalWeeks = 16;
    const totalDays = totalWeeks * 7;
    const startDate = new Date(endSaturday);
    startDate.setDate(endSaturday.getDate() - totalDays + 1);

    const generatedWeeks = [];
    const monthsInView = [];
    let currentMonthName = '';
    let periodTotal = 0;
    let activeDays = 0;

    let cursor = new Date(startDate);
    for (let w = 0; w < totalWeeks; w++) {
      const weekDays = [];
      for (let d = 0; d < 7; d++) {
        const dateStr = cursor.toISOString().split('T')[0];
        const count = activityMap[dateStr] || 0;
        if (count > 0) {
          periodTotal += count;
          activeDays += 1;
        }

        const isToday = dateStr === todayStr;
        const dayOfMonth = cursor.getDate();
        const monthName = cursor.toLocaleString('default', { month: 'short' });

        if (d === 0 && monthName !== currentMonthName) {
          monthsInView.push({ weekIndex: w, name: monthName });
          currentMonthName = monthName;
        }

        weekDays.push({
          dateStr,
          dayOfMonth,
          monthName,
          count,
          isToday,
          dayOfWeek: d
        });

        cursor.setDate(cursor.getDate() + 1);
      }
      generatedWeeks.push(weekDays);
    }

    return {
      weeks: generatedWeeks,
      monthLabels: monthsInView,
      totalPeriodActivities: periodTotal,
      activeDaysCount: activeDays
    };
  }, [selectedDate, activityMap, todayStr]);

  // Orange color shades matching RecallMe palette
  const getColorClass = (count) => {
    if (!count || count <= 0) return 'bg-[#FAF8F5] border-[#E7E0D8]';
    if (count === 1) return 'bg-[#FADCC7] border-[#ECD0C0]'; // Soft orange
    if (count === 2) return 'bg-[#E8B786] border-[#D9A36D]'; // Sand orange
    if (count === 3) return 'bg-[#C65D32] border-[#A94B24]'; // Burnt orange
    return 'bg-[#8F3918] border-[#722B10]';                  // Deep burnt orange
  };

  const currentMonthDisplay = selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <section className="bg-white border border-[#E7E0D8] rounded-3xl p-5 sm:p-7 shadow-card space-y-5 card-tactile">
      
      {/* Calendar Header with Navigation and Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E0D8] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C65D32]"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C65D32] flex items-center gap-1.5">
              <CalendarIcon size={14} />
              <span>Learning Activity Calendar</span>
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[#222222] tracking-tight">
            Daily Study & Recall Rhythm
          </h3>
          <p className="text-xs text-[#706B66]">
            Every square reflects your real study sessions and quiz completions.
          </p>
        </div>

        {/* Real Metrics & Month Navigation */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          {/* Real metrics badges */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-[#FAF5EF] border border-[#E8B786] flex items-center gap-1.5 text-xs text-[#7A3216] font-bold">
              <Sparkles size={13} className="text-[#C65D32]" />
              <span>{totalPeriodActivities} Activities</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E7E0D8] flex items-center gap-1.5 text-xs text-[#252525] font-semibold">
              <Flame size={13} className="text-[#C65D32]" />
              <span>{streak}d Streak</span>
            </div>
          </div>

          {/* Month Navigation Controls */}
          <div className="flex items-center gap-1 bg-[#FAF8F5] border border-[#E7E0D8] rounded-xl p-1">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded-lg text-[#706B66] hover:text-[#222222] hover:bg-white transition-colors btn-tactile"
              title="Previous month"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="px-2 text-xs font-bold text-[#222222] whitespace-nowrap min-w-[105px] text-center font-mono">
              {currentMonthDisplay}
            </span>

            <button
              onClick={handleNextMonth}
              className="p-1 rounded-lg text-[#706B66] hover:text-[#222222] hover:bg-white transition-colors btn-tactile"
              title="Next month"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <button
            onClick={handleResetToday}
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#706B66] hover:text-[#222222] bg-white border border-[#E7E0D8] hover:bg-[#FAF8F5] transition-colors flex items-center gap-1 btn-tactile"
            title="Jump to current date"
          >
            <RotateCcw size={12} />
            <span>Today</span>
          </button>
        </div>
      </div>

      {/* Full-Width GitHub-Style Heatmap Grid Container */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[620px] space-y-2">
          
          {/* Month Labels along the top */}
          <div className="flex text-[11px] font-mono text-[#706B66] pl-8">
            {weeks.map((_, wIdx) => {
              const label = monthLabels.find(m => m.weekIndex === wIdx);
              return (
                <div key={wIdx} className="w-[18px] sm:w-[22px] mr-[3px] text-left">
                  {label ? label.name : ''}
                </div>
              );
            })}
          </div>

          {/* Grid: Day labels on left + 7 rows of week columns */}
          <div className="flex">
            {/* Day Labels (Mon, Wed, Fri) */}
            <div className="flex flex-col justify-between text-[10px] font-mono text-[#706B66] pr-2.5 w-8 select-none py-0.5">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Heatmap Columns (16 weeks) */}
            <div className="flex gap-[3px] sm:gap-[4px]">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-[3px] sm:gap-[4px]">
                  {week.map((day) => (
                    <div
                      key={day.dateStr}
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[3px] border transition-all cursor-pointer relative ${getColorClass(day.count)} ${
                        day.isToday ? 'ring-2 ring-[#C65D32] ring-offset-1 z-10' : 'hover:scale-125 hover:z-20'
                      }`}
                      title={`${day.count} activities on ${day.dateStr}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Footer: Live Hover Detail Tooltip + Color Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#E7E0D8] text-xs">
        
        {/* Dynamic Activity Hover Feedback */}
        <div className="text-xs text-[#706B66] flex items-center gap-1.5 min-h-[20px]">
          {hoveredDay ? (
            <>
              <span className="font-bold text-[#222222]">
                {hoveredDay.count} {hoveredDay.count === 1 ? 'activity' : 'activities'}
              </span>
              <span>on</span>
              <span className="font-mono text-[#C65D32] font-semibold">{hoveredDay.dateStr}</span>
              {hoveredDay.isToday && <span className="font-bold text-[#38765C]">(Today)</span>}
            </>
          ) : (
            <span>Hover over any day square to inspect real learning activity.</span>
          )}
        </div>

        {/* GitHub-Style Color Legend */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-[#706B66] self-end sm:self-auto">
          <span>Less</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-[2px] bg-[#FAF8F5] border border-[#E7E0D8]" title="0 activities" />
            <div className="w-3 h-3 rounded-[2px] bg-[#FADCC7] border border-[#ECD0C0]" title="1 activity" />
            <div className="w-3 h-3 rounded-[2px] bg-[#E8B786] border border-[#D9A36D]" title="2 activities" />
            <div className="w-3 h-3 rounded-[2px] bg-[#C65D32] border border-[#A94B24]" title="3 activities" />
            <div className="w-3 h-3 rounded-[2px] bg-[#8F3918] border border-[#722B10]" title="4+ activities" />
          </div>
          <span>More</span>
        </div>

      </div>

    </section>
  );
}
