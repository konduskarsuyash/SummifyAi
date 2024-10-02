import React, { useEffect, useState } from "react";

const Statistics = ({ userId }) => {
  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/user/statistics/${userId}/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token if required
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch statistics.");
        }

        const data = await response.json();
        setStatistics(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStatistics();
  }, [userId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!statistics) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center h-full bg-zinc-900 p-4">
      <div className="bg-zinc-800 p-6 rounded-lg shadow-lg flex flex-col sm:flex-row sm:gap-0 gap-10 divide-gray-400 sm:divide-x">
        <div className="text-center flex flex-col items-center flex-grow sm:pr-8 p-4 sm:p-0">
          <div className="text-4xl font-bold text-white">{statistics.quizzes_taken}</div>
          <div className="text-lg font-medium text-gray-400">Total Quiz Taken</div>
          <div className="text-sm text-gray-500">Since {statistics.since}</div>
        </div>
        <div className="text-center flex flex-col items-center flex-grow sm:px-8 p-4 sm:p-0">
          <div className="text-4xl font-bold text-white">{statistics.current_streak}</div>
          <div className="text-lg font-medium text-orange-500">Current Streak</div>
          <div className="text-sm text-gray-500">{statistics.current_streak_dates}</div>
        </div>
        <div className="text-center flex flex-col items-center flex-grow sm:pl-4 p-4 sm:p-0">
          <div className="text-4xl font-bold text-white">{statistics.longest_streak}</div>
          <div className="text-lg font-medium text-gray-400">Longest Streak</div>
          <div className="text-sm text-gray-500">{statistics.longest_streak_dates}</div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
