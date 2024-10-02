import React, { useMemo, useState, useEffect } from 'react';
import { format, subDays, addDays, startOfWeek, getDay } from 'date-fns';

const getColor = (count) => {
  if (count >= 5) return '#68d391'; // dark green for high contributions
  if (count > 0) return '#276749'; // lighter green for low contributions
  return '#161b22'; // default background color for no contributions
};

const Contributions = ({ userId }) => {
  const [contributions, setContributions] = useState({});
  const [hoveredDay, setHoveredDay] = useState(null);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/user/contributions/${userId}/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        // Here, set the contributions data directly
        setContributions(data.contributions);
      } catch (error) {
        console.error('Error fetching contributions:', error);
      }
    };

    fetchContributions();
  }, [userId]);

  const activityData = useMemo(() => {
    const days = 365;
    const data = [];
    const endDate = new Date();

    for (let i = 0; i < days; i++) {
      const date = subDays(endDate, i);
      const dateString = format(date, 'yyyy-MM-dd');
      const dayContributions = contributions[dateString] || { contributions: [] };
      data.unshift({
        date,
        contributions: dayContributions.contributions.length,
        highlight: dayContributions.highlight || false,
      });
    }

    return data;
  }, [contributions]);

  const weeks = useMemo(() => {
    const weeks = [];
    let currentWeek = [];
    const startDate = startOfWeek(activityData[0]?.date || new Date(), { weekStartsOn: 0 });

    const daysToAdd = getDay(activityData[0]?.date || new Date());
    for (let i = 0; i < daysToAdd; i++) {
      currentWeek.push({ date: addDays(startDate, i), contributions: 0 });
    }

    activityData.forEach((day, index) => {
      currentWeek.push(day);
      if (currentWeek.length === 7 || index === activityData.length - 1) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    return weeks;
  }, [activityData]);

  const monthLabels = useMemo(() => {
    const labels = [];
    let currentMonth = '';

    weeks.forEach((week, weekIndex) => {
      week.forEach((day) => {
        const monthName = format(day.date, 'MMM');
        if (monthName !== currentMonth) {
          labels.push({ label: monthName, x: weekIndex });
          currentMonth = monthName;
        }
      });
    });

    return labels;
  }, [weeks]);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">Activity in the last year</h2>
      <div className="relative">
        <div className="flex mb-2 relative h-5">
          {monthLabels.map(({ label, x }, index) => (
            <div
              key={index}
              className="absolute text-xs text-gray-400"
              style={{ left: `${(x / weeks.length) * 100}%` }}
            >
              {label}
            </div>
          ))}
        </div>
        <div className="flex">
          <div className="flex flex-col mr-2 text-[0.65rem] font-bold text-gray-400 justify-between">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>
          <div className="flex-grow">
            <div className="grid grid-flow-col gap-1" style={{ gridTemplateRows: 'repeat(7, 1fr)' }}>
              {weeks.map((week, weekIndex) => (
                <React.Fragment key={weekIndex}>
                  {week.map((day, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: getColor(day.contributions) }}
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                    />
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center mt-2 text-xs text-gray-400">
          <span className="mr-2">Less</span>
          {[0, 1, 5].map((count, index) => (
            <div
              key={index}
              className="w-3 h-3 mr-1 rounded-sm"
              style={{ backgroundColor: getColor(count) }}
            />
          ))}
          <span className="ml-1">More</span>
        </div>
        {hoveredDay && (
          <div className="absolute top-full left-0 mt-2 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
            {format(hoveredDay.date, 'EEEE, MMMM d, yyyy')}: {hoveredDay.contributions} contributions
          </div>
        )}
      </div>
    </div>
  );
};

export default Contributions;
