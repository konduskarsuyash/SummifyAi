import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import chatbotLogo from '../images/chatbot.jpg';
import summarizeLogo from '../images/summarize.jpg';
import progressLogo from '../images/progress.jpg';

// FeatureCard Component
const FeatureCard = ({ title, category, description, imgSrc, route }) => (
    <Link 
        to={route} 
        className="bg-zinc-800 rounded-lg p-8 flex flex-col h-full shadow-lg transition-transform transform hover:scale-105 min-h-[350px] flex-grow"
    >
        <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-pink-200 rounded-full flex items-center justify-center mr-4">
                <img src={imgSrc} alt={title} className="rounded-full w-12 h-12 object-cover" />
            </div>
            <div>
                <h3 className="text-3xl font-semibold text-white">{title}</h3>
                <p className="text-xl text-zinc-400">{category}</p>
            </div>
        </div>
        <p className="text-zinc-300 flex-grow text-xl">{description}</p>
    </Link>
);

// Features Component
export default function Features() {
    const [userId, setUserId] = useState(null); // State to hold user ID
    const featuresData = [
        {
            title: "PDF Summarizer",
            category: "Learning",
            description: "Transform lengthy PDF documents into concise summaries...",
            imgSrc: chatbotLogo,
            route: "/pdfsummarizer"
        },
        {
            title: "Youtube Summarizer",
            category: "AI-Powered",
            description: "Dive into the world of educational content without the overwhelm!",
            imgSrc: summarizeLogo,
            route: "/ytsummarizer"
        },
        {
            title: "Video/Lecture Summarizer",
            category: "AI powered",
            description: "Enhance your learning journey with Personalized Quizzes...",
            imgSrc: summarizeLogo,
            route: "/videosummarizer"
        },
        {
            title: "Personalized Quizzes",
            category: "Assessment",
            description: "Enhance your learning journey with Personalized Quizzes...",
            imgSrc: progressLogo,
            route: "/quiz"
        },
        {
            title: "Progress Tracking",
            category: "Self-Improvement",
            description: "Monitor your learning journey with our intuitive Progress Tracking feature...",
            imgSrc: progressLogo,
            route: userId ? `/userprofile/${userId}` : '#' // Use the user ID in the route
        },
    ];

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/user/get-user-id/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Replace with your auth method
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data)
                    setUserId(data.user_id);
                } else {
                    console.error('Failed to fetch user ID');
                }
            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        };

        fetchUserId();
    }, []);

    return (
        <section className="bg-zinc-950 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-screen max-h-[80vh] overflow-auto">
            <div className="max-w-screen-2xl mx-auto text-left">
                <h2 className="text-4xl font-bold text-white mb-10">Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {featuresData.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
}
