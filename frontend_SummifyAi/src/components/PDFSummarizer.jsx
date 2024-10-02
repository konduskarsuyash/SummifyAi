import React, { useState, useEffect } from 'react';
import './loader.css'
export default function PDFSummarizer() {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileName, setPdfFileName] = useState('');
  const [startPage, setStartPage] = useState('');
  const [endPage, setEndPage] = useState('');
  const [summary, setSummary] = useState({});
  const [displayedSummary, setDisplayedSummary] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle PDF file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setPdfFileName(file.name);
      setError('');
    } else {
      setError('Please upload a valid PDF file.');
      setPdfFileName('');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pdfFile) {
      setError('Please upload a PDF file.');
      return;
    }
    if (!startPage || !endPage || isNaN(startPage) || isNaN(endPage)) {
      setError('Please enter valid page numbers.');
      return;
    }
    if (parseInt(startPage) > parseInt(endPage)) {
      setError('Start page cannot be greater than the end page.');
      return;
    }

    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('pdf_file', pdfFile);
    formData.append('start_page_number', startPage);
    formData.append('end_page_number', endPage);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/pdf_summarize/', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adjust this if needed
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSummary(data.summaries);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'An error occurred while summarizing.');
      }
    } catch (err) {
      setError('An error occurred while fetching the summary.');
    } finally {
      setLoading(false);
    }
  };

  // Typing effect for progressively displaying the summary
  useEffect(() => {
    if (Object.keys(summary).length > 0) {
      let currentIndex = 0;
      const combinedSummary = Object.values(summary).join('\n\n'); // Combine all summaries
      const words = combinedSummary.split(' '); // Split summary into words
      const intervalId = setInterval(() => {
        if (currentIndex < words.length) {
          setDisplayedSummary((prev) => prev + ' ' + words[currentIndex]);
          currentIndex++;
        } else {
          clearInterval(intervalId);
        }
      }, 50); // Increase speed by reducing the delay to 50ms
      return () => clearInterval(intervalId);
    }
  }, [summary]);

  // Function to format the summary (bold headings and bash-like content with different styles)
  const formatSummary = (text) => {
    return text.split('\n').map((line, index) => {
      const isHeading = line.startsWith('#'); // Change as needed for different heading levels
      const isBash = line.startsWith('$');

      return (
        <div key={index} className="mb-4"> {/* Add spacing between paragraphs */}
          <p
            className={`${
              isHeading 
                ? 'font-bold text-blue-500 text-3xl border-b-2 border-blue-400 pb-1' // Bold and underlined headings
                : isBash 
                ? 'bg-gray-800 p-2 rounded-md text-green-300 font-mono' // Distinct style for bash commands
                : 'text-gray-300 text-lg' // Regular text style
            }`}
          >
            {isHeading ? line.replace(/^#+\s*/, '') : line} {/* Remove heading markers */}
          </p>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 p-8">
      <h1 className="text-5xl font-extrabold text-white text-center mb-10">PDF Summarizer</h1>
      
      <div className={`flex ${loading ? 'justify-start' : 'justify-center'} w-full max-w-8xl`} style={{ minHeight: '75vh' }}>
        
        {/* Form Section */}
        <form
          className={`bg-neutral-900 p-10 rounded-lg shadow-lg space-y-6 w-full transition-all duration-300 ease-in-out ${Object.keys(summary).length > 0 ? 'w-1/4' : 'max-w-lg'}`}
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-gray-200 text-lg font-semibold mb-2" htmlFor="pdfFile">Upload PDF:</label>
            <div className="relative border-2 border-dashed border-gray-600 rounded-md p-4">
              <input
                type="file"
                id="pdfFile"
                accept="application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16v-5a4 4 0 014-4h7m-5 5l-5 5m-2-6h6m2-2v6"></path>
                </svg>
                <p className="text-gray-400">{pdfFileName || 'Drag & drop or click to upload'}</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-200 text-lg font-semibold mb-2" htmlFor="startPage">Start Page:</label>
            <input
              type="number"
              id="startPage"
              value={startPage}
              onChange={(e) => setStartPage(e.target.value)}
              placeholder="Enter start page"
              className="w-full p-3 rounded-md bg-gray-700 text-gray-200 border border-gray-600 shadow-inner focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-200 text-lg font-semibold mb-2" htmlFor="endPage">End Page:</label>
            <input
              type="number"
              id="endPage"
              value={endPage}
              onChange={(e) => setEndPage(e.target.value)}
              placeholder="Enter end page"
              className="w-full p-3 rounded-md bg-gray-700 text-gray-200 border border-gray-600 shadow-inner focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 py-3 rounded-md text-white font-semibold shadow-md hover:bg-red-500 transition-colors"
          >
            Submit
          </button>

          {error && <p className="text-red-400 text-center mt-4">{error}</p>}
        </form>

        {/* Loader */}
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
            <div className="loader"></div> {/* Use the loader class here */}
          </div>
        )}

        {/* Summary Section */}
        {displayedSummary && !loading && (
          <div className="bg-gray-900 p-10 rounded-lg shadow-lg flex-1 overflow-y-auto mx-4" style={{ maxHeight: '80vh', minWidth: '60%' }}>
            <h2 className="text-4xl font-bold text-gray-200 mb-4">Summary</h2> {/* Increased heading size */}
            <div className="space-y-6 text-gray-300 text-lg"> {/* Increased text size for the summary */}
              {formatSummary(displayedSummary)} {/* Format and display the progressively shown summary */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}