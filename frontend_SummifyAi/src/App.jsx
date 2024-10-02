import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Hero from './components/Hero';
import YtSummarizer from './components/YtSummarizer';
import Statistics from './components/Statistics';
import Contributions from './components/Contributions';
import PDFUploader from './components/PDFSummarizer';
import QuizComponent from './components/QuizTaker';
// import ModelViewer from './components/Model';
import VideoSummarizer from './components/VideoSummarizer';
import Features from './components/Features';
import UserProfile from './components/UserProfie';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} /> 
        <Route path="/features" element={<Features />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/ytsummarizer" element={<YtSummarizer/>}/>
        <Route path="/videosummarizer" element={<VideoSummarizer />} />
        
        {/* Dynamic Routes for user-specific content */}
        <Route path="/statistics/:user_id" element={<Statistics />} />
        <Route path="/userprofile/:user_id" element={<UserProfile />} />
        <Route path="/contributions/:user_id" element={<Contributions />} />

        <Route path="/pdfsummarizer" element={<PDFUploader />} />
        <Route path="/quiz" element={<QuizComponent />} />
        {/* <Route path="/model" element={<ModelViewer />} /> */}
      </Routes>
    </Router>
  );
}
