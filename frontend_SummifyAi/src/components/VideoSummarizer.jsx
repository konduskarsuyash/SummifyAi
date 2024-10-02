import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS for styling
import { Link } from 'react-router-dom';

const VideoSummarizer = () => {
const [videoUrl, setVideoUrl] = useState(''); // YouTube URL input
const [summary, setSummary] = useState(null); // Summary received from API
const [displayedSummary, setDisplayedSummary] = useState(''); // Summary displayed with typing effect
const [error, setError] = useState(null); // Error message
const [isSummaryVisible, setIsSummaryVisible] = useState(false); // Flag for showing summary section
const [isLoading, setIsLoading] = useState(false); // Loading state
const [uploadedFile, setUploadedFile] = useState(null); // Uploaded video file
const [uploadedFileName, setUploadedFileName] = useState(''); // Store uploaded file name

// Handle form submission
const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Reset error state

    // Handle file upload if a file is provided
    if (uploadedFile) {
    const formData = new FormData();
    formData.append('video', uploadedFile);

    try {
        const response = await fetch('http://127.0.0.1:5000/upload_video', {
        method: 'POST',
        body: formData,
        });

        if (response.ok) {
        const data = await response.json();
        setSummary(data.explanation); // Set the summary received from the backend
        setDisplayedSummary(''); // Reset the displayed summary
        setIsSummaryVisible(true); // Show summary section
        } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Error processing video.');
        }
        setIsLoading(false);
        return;
    } catch (err) {
        setError('An error occurred while uploading the video.');
        setIsLoading(false);
        return;
    }
    }

    // Handle YouTube URL summarization
    if (videoUrl) {
    // Extract video ID from YouTube link
    const videoId = videoUrl.split('v=')[1]?.split('&')[0];
    if (!videoId) {
        setError('Invalid YouTube URL');
        setIsLoading(false);
        return;
    }

    // Call the backend API for YouTube summarization
    try {
        const response = await fetch('http://127.0.0.1:5000/api/yt_summarize/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token'), // Optional: Token-based auth
        },
        body: JSON.stringify({ youtube_url: videoUrl }),
        });

        if (response.ok) {
        const data = await response.json();
        setSummary(data.summary); // Set the full summary from the response
        setDisplayedSummary(''); // Reset the displayed summary
        setIsSummaryVisible(true); // Show summary section
        } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Error fetching YouTube summary.');
        }
        setIsLoading(false);
    } catch (err) {
        setError('An error occurred while fetching the summary.');
        setIsLoading(false);
    }
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
    }, 50); // Typing speed
    return () => clearInterval(intervalId);
    }
}, [summary]);

// Handle file upload event
const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUploadedFile(file);
    setUploadedFileName(file.name); // Set the uploaded file name
};

return (
    <div className="min-h-screen bg-black text-white p-8 relative">
    <Link 
to={isSummaryVisible ? "/features" : "/features"} 
className="mb-12 flex items-center gap-2 bg-zinc-800 text-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition-colors w-fit"
>
<ArrowLeft className="w-4 h-4" />
Back
</Link>

    <div className="max-w-8xl mx-auto flex justify-center gap-8">
        <div className={isSummaryVisible ? "w-1/4" : "w-1/2"}>
        <h1 className="text-4xl font-bold text-center mb-4">Get Detail Summary of the Lectures</h1>
        <p className="text-center text-xl mb-12">Just paste the YouTube lecture URL or upload the video of the lecture</p>

        <div className="flex justify-center">
            <form className="space-y-6 w-full" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3">
                <input
                type="text"
                value={uploadedFileName || videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="upload video"
                className="w-full bg-zinc-800 rounded-md p-3 text-white placeholder-gray-400"
                readOnly={!!uploadedFileName} // Make it read-only if a file is uploaded
                />
                <label className="cursor-pointer" title="Attach">
                <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                <svg className="stroke-blue-300 fill-none mt-2" xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 25 25">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.17 11.053L11.18 15.315C10.8416 15.6932 10.3599 15.9119 9.85236 15.9178C9.34487 15.9237 8.85821 15.7162 8.51104 15.346C7.74412 14.5454 7.757 13.2788 8.54004 12.494L13.899 6.763C14.4902 6.10491 15.3315 5.72677 16.2161 5.72163C17.1006 5.71649 17.9463 6.08482 18.545 6.736C19.8222 8.14736 19.8131 10.2995 18.524 11.7L12.842 17.771C12.0334 18.5827 10.9265 19.0261 9.78113 18.9971C8.63575 18.9682 7.55268 18.4695 6.78604 17.618C5.0337 15.6414 5.07705 12.6549 6.88604 10.73L12.253 5" />
                </svg>
                </label>
            </div>

            <button type="submit" className="w-full bg-white text-black font-semibold py-3 rounded-md hover:bg-gray-200 transition-colors">
                Submit
            </button>
            </form>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>

        {isSummaryVisible && (
        <div className={`w-3/4 max-h-[80vh] flex flex-col ${isSummaryVisible ? 'max-w-8xl' : 'max-w-5xl'} overflow-hidden`}>
            <h2 className="text-2xl font-bold mb-4">Summary:</h2>
            <div className="bg-gray-800 p-4 rounded-md flex-1 overflow-y-auto"> {/* Fixed height with scrolling */}
            <ReactMarkdown
                components={{
                code({ node, inline, className, children, ...props }) {
                    return !inline ? (
                    <pre className="bg-gray-900 p-2 rounded-md overflow-auto" {...props}>
                        <code>{children}</code>
                    </pre>
                    ) : (
                    <code className="bg-gray-700 px-1 rounded">{children}</code>
                    );
                },
                p({ children }) {
                    return (
                    <p className="mb-2">
                        {children}
                    </p>
                    );
                }
                }}
            >{displayedSummary}</ReactMarkdown>
            </div>
        </div>
        )}
    </div>

    {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="loader" /> {/* Add your loader styling here */}
        </div>
    )}
    </div>
);
};

export default VideoSummarizer;