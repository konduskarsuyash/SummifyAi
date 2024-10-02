import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function YtSummarizer() {
  const [videoUrl, setVideoUrl] = useState('');
  const [summary, setSummary] = useState(null);
  const [displayedSummary, setDisplayedSummary] = useState('');
  const [error, setError] = useState(null);
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Extract video ID from YouTube link
    const videoId = videoUrl.split('v=')[1]?.split('&')[0];
    if (!videoId) {
      setError('Invalid YouTube URL');
      setIsLoading(false);
      return;
    }

    // Call the backend API
    try {
      const response = await fetch('http://127.0.0.1:8000/api/yt_summarize/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),  // Token-based auth
        },
        body: JSON.stringify({ youtube_url: videoUrl }),
      });

      if (response.ok) {
        const data = await response.json();
        setSummary(data.summary);  // Set the full summary from the response
        setDisplayedSummary('');  // Reset the displayed summary for the typing effect
        setIsSummaryVisible(true);  // Show the summary section
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'An error occurred');
      }
      setIsLoading(false);
    } catch (err) {
      setError('An error occurred while fetching the summary');
      setIsLoading(false);
    }
  };

  // Typing effect for progressively displaying the summary
  useEffect(() => {
    if (summary) {
      let currentIndex = 0;
      const words = summary.split(' '); // Split summary into words
      const intervalId = setInterval(() => {
        if (currentIndex < words.length) {
          setDisplayedSummary((prev) => prev + ' ' + words[currentIndex]);
          currentIndex++;
        } else {
          clearInterval(intervalId);
        }
      }, 50);  // Increase speed by reducing the delay to 50ms
      return () => clearInterval(intervalId);
    }
  }, [summary]);

  // Function to format the summary (bold headings, new points on a new line)
  const formatSummary = (text) => {
    return text.split('\n').map((line, index) => {
      // Bold the headings and bash-like content
      const isHeading = line.startsWith('**') && line.endsWith('**');
      const isBash = line.startsWith('$');
      return (
        <p key={index} className={isHeading ? 'font-bold' : isBash ? 'bg-gray-900 p-2 rounded-md' : ''}>
          {isHeading ? line.replace(/\*\*/g, '') : line}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
        <Link to="/features">
                <button className="mb-12 flex items-center gap-2 bg-zinc-800 text-white px-4 py-2 rounded-md">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
            </Link>

      <div className="max-w-1xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">
          We could use some help finding new YouTube channels.
        </h1>
        <p className="text-center text-xl mb-12">
          We're always looking for cool channels that our audience may learn something from. Know one? Share it here.
        </p>

        {/* Hide form after submission */}
        {!isSummaryVisible && (
          <div className="flex justify-center">
            <form className="space-y-6 w-96" onSubmit={handleSubmit}>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Channel link"
                className="w-full bg-zinc-800 rounded-md p-3 text-white placeholder-gray-400"
              />
              <button
                type="submit"
                className="w-full bg-white text-black font-semibold py-3 rounded-md hover:bg-gray-200 transition-colors"
              >
                Submit
              </button>
            </form>
          </div>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {/* Display loading bar while content is being loaded */}
        {isLoading && (
          <div className="mt-12">
            <div className="bg-gray-200 rounded-full h-4 w-full mb-4">
              <div className="bg-blue-500 h-4 rounded-full" style={{ width: '100%' }}></div>
            </div>
            <p className="text-center">Loading...</p>
          </div>
        )}

        {/* Display video and summary side by side after submission */}
        {isSummaryVisible && (
          <div className="mt-12 flex gap-6">
            {/* YouTube video embed */}
            <div className="flex-1">
              <iframe
                width="100%"
                height="400px"
                src={`https://www.youtube.com/embed/${videoUrl.split('v=')[1]?.split('&')[0]}`}
                frameBorder="0"
                allowFullScreen
                title="YouTube Video"
              />
            </div>

            {/* Scrollable Summary section */}
            <div className="flex-1 bg-zinc-800 p-6 rounded-md max-h-[400px] overflow-y-scroll">
              <h2 className="text-2xl font-bold mb-4">Video Summary:</h2>
              <div>
                {formatSummary(displayedSummary)}  {/* Display formatted summary */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}