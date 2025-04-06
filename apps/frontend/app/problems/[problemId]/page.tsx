"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Editor from "@monaco-editor/react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"; // Import Radix Dropdown
import { ArrowLeft, CheckCircle2, XCircle, Clock, Loader2, ChevronDown } from 'lucide-react'; // Added ChevronDown for dropdown
import Button from "@repo/ui/button"; // Assuming you have shadcn/ui Button or similar
import Layout from "../../../components/Layout"; // Adjust path as needed
import { io, Socket } from 'socket.io-client';
import axios from "axios";

// --- Constants and Type Definitions ---
const links = [
  { href: "/", label: "Home" },
  { href: "/problems", label: "Problems" }
];

interface TestCase {
  input: string;
  output: string;
  _id?: string;
}

interface CodeStub {
  language: string;
  startSnippet: string;
  endSnippet: string;
  userSnippet: string;
  _id?: string;
}

// Updated Problem interface
interface Problem {
  _id: string; // Use _id based on API response
  title: string;
  description: string;
  difficulty: string;
  testCases: TestCase[];
  codeStubs: CodeStub[];
  editorial: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

const languages = ["JavaScript", "Java", "C++", "Python"] as const;
type Language = (typeof languages)[number];

const languageMap: Record<Language, string> = {
  JavaScript: "javascript",
  Java: "java",
  "C++": "cpp",
  Python: "python",
};

const languageCodeMap: Record<Language, string> = {
  JavaScript: "JAVASCRIPT",
  Java: "JAVA",
  "C++": "CPP",
  Python: "PYTHON",
};

// --- Environment Variables ---
const SOCKET_SERVICE_URL = process.env.NEXT_PUBLIC_SOCKET_SERVICE_URL || 'http://localhost:4000';
const SUBMISSION_SERVICE_URL = process.env.NEXT_PUBLIC_SUBMISSION_SERVICE_URL || 'http://localhost:8080';
const PROBLEM_SERVICE_URL = process.env.NEXT_PUBLIC_PROBLEM_SERVICE_URL || 'http://localhost:8080/api/v1';

// --- Result Types ---
type SubmissionStatusCode = 'SUCCESS' | 'WA' | 'TLE' | 'RE' | 'CE' | 'ERROR' | string; // Added ERROR based on user log

interface TestCaseResult {
  output: string;
  status: SubmissionStatusCode;
}

interface SubmissionResponsePayload {
  testCaseResults: TestCaseResult[];
  status: SubmissionStatusCode;
}

// For the actual WebSocket message which has a nested structure
interface WebSocketPayload {
    response: SubmissionResponsePayload;
    userId: string;
    submissionId: string;
}


// --- React Component ---
const ProblemPage = () => {
  const params = useParams();
  const problemId = Array.isArray(params?.problemId) ? params.problemId[0] : params?.problemId;
  const router = useRouter();

  // --- State Variables ---
  const [problem, setProblem] = useState<Problem | null>(null);
  const [activeTab, setActiveTab] = useState<"Description" | "Editorial" | "Test Cases">("Description");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("Java");
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'completed'>('idle');
  const [submissionResults, setSubmissionResults] = useState<SubmissionResponsePayload | null>(null);

  const userId = "user123"; // Replace with actual user ID logic

  // --- WebSocket Connection Effect ---
  useEffect(() => {
    if (!SOCKET_SERVICE_URL) {
      console.error("Socket service URL is not defined.");
      return;
    }
    console.log(`Attempting to connect socket to: ${SOCKET_SERVICE_URL}`);
    const newSocket = io(SOCKET_SERVICE_URL, {
        // transports: ['websocket', 'polling'], // Optional: If needed
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      newSocket.emit('setUserId', userId);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message, err.cause);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
       if (reason === 'io server disconnect') {
         newSocket.connect();
       }
    });

    // --- MODIFIED LISTENER ---
    newSocket.on('submissionPayloadResponse', (payload: WebSocketPayload | any) => { // Use broader type initially
      console.log('Raw Submission Response Received:', payload);

      // Check if the actual results are nested within a 'response' property
      const resultsData = payload?.response;

      // Validate the NESTED structure before setting state
      if (resultsData && Array.isArray(resultsData.testCaseResults) && resultsData.status) {
         console.log('Valid nested structure found. Updating state.');
         // Set state using the nested data
         setSubmissionResults({
            testCaseResults: resultsData.testCaseResults,
            status: resultsData.status
         });
         setSubmissionStatus('completed');
      } else {
          console.error("Invalid or unexpected submission payload structure received:", payload);
          setSubmissionResults(null);
          setSubmissionStatus('idle');
          // alert("Received an unexpected response format from the server."); // Optional user feedback
      }
    });
    // --- END OF MODIFIED LISTENER ---

    // Cleanup function
    return () => {
      console.log('Disconnecting socket...');
      newSocket.disconnect();
      setSocket(null);
    };
  }, [userId]);

  // --- Fetch Problem Effect ---
   useEffect(() => {
    if (!PROBLEM_SERVICE_URL) {
      console.error("Problem service URL is not defined.");
      setLoading(false);
      return;
    }
    const fetchProblem = async () => {
      setLoading(true);
      setProblem(null);
      try {
        console.log(`Workspaceing problem: ${PROBLEM_SERVICE_URL}/problems/${problemId}`);
        const response = await axios.get(`${PROBLEM_SERVICE_URL}/problems/${problemId}`);

        if (!response.data || !response.data.success || !response.data.data) {
            console.error("API response format is incorrect:", response.data);
            throw new Error("Invalid API response structure");
        }
        const fetchedProblemData: Problem = response.data.data;

        // Use _id for check now
        if (!fetchedProblemData._id || !fetchedProblemData.codeStubs || !fetchedProblemData.testCases) {
             console.error("Fetched problem data is incomplete:", fetchedProblemData);
             throw new Error("Incomplete problem data received");
        }
        setProblem(fetchedProblemData);

        const defaultLanguageStub = fetchedProblemData.codeStubs.find(
          (stub) => stub.language === languageCodeMap[selectedLanguage]
        );
        setCode(defaultLanguageStub?.userSnippet || `// Default snippet for ${selectedLanguage} not found`);

      } catch (error) {
        console.error("Error fetching problem:", error);
        setProblem(null);
      } finally {
        setLoading(false);
      }
    };

    if (problemId) {
      fetchProblem();
    } else {
      console.log("No problem ID found in URL.");
      setLoading(false);
    }
  }, [problemId]);

  // --- Update Code on Language Change Effect ---
  useEffect(() => {
    if (problem) {
      const currentLanguageStub = problem.codeStubs.find(
        (stub: CodeStub) => stub.language === languageCodeMap[selectedLanguage]
      );
      setCode(currentLanguageStub?.userSnippet || `// Snippet for ${selectedLanguage} not found`);
      setSubmissionStatus('idle');
      setSubmissionResults(null);
    }
  }, [selectedLanguage, problem]);

  // --- Event Handlers ---
  const handleLanguageChange = (lang: Language) => {
    setSelectedLanguage(lang);
  };

  const handleSubmit = async () => {
    if (!problem || !problemId) {
      console.error("No problem loaded or problemId missing, cannot submit.");
      alert("Problem data is not loaded. Please try again.");
      return;
    }
    if (!SUBMISSION_SERVICE_URL) {
      console.error("Submission service URL is not defined.");
      alert("Submission service is not configured. Please contact support.");
      return;
    }

    setSubmissionStatus('submitting');
    setSubmissionResults(null);
    setActiveTab("Test Cases");

    try {
      const payload = {
        userId: userId,
        language: languageCodeMap[selectedLanguage],
        code: code,
        problemId: problemId,
      };
      console.log("Initiating submission with payload:", payload);
      const response = await axios.post(`${SUBMISSION_SERVICE_URL}/api/v1/submissions`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log("Submission request successful:", response.data);
      // Waiting for WebSocket response...
    } catch (error) {
      console.error("Error initiating submission:", error);
      setSubmissionStatus('idle');
      if (axios.isAxiosError(error)) {
        alert(`Failed to submit: ${error.response?.data?.message || error.message}`);
      } else {
         alert(`Failed to submit: An unknown error occurred.`);
         console.error(error); // Log the full error
      }
    }
  };

  // --- Helper Function to Render Status Icon ---
  const renderStatusIcon = (status: SubmissionStatusCode | 'pending' | null) => {
    if (status === 'pending') {
      return <Loader2 className="h-5 w-5 text-gray-500 animate-spin" />;
    }
    if (status === 'SUCCESS') {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }
    if (status === 'WA' || status === 'RE' || status === 'CE' || status === 'ERROR') { // Added ERROR
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
    if (status === 'TLE') {
      return <Clock className="h-5 w-5 text-orange-500" />;
    }
    if (status && status !== 'SUCCESS') { // Catch-all for other known non-success statuses
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
    return null;
  };

  // --- Render Logic ---
  if (loading) {
    return (
      <Layout links={links}>
        <div className="flex justify-center items-center h-[calc(100vh-100px)]">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!problem) {
     return (
        <Layout links={links}>
            <div className="p-6 md:p-10 text-center">
                <h2 className="text-2xl text-red-600 dark:text-red-400 font-semibold mb-4">Error</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6">Failed to load the problem details. Please check the problem ID or try again later.</p>
                 <Button variant="secondary" onClick={() => router.push('/problems')} className="mt-4">
                     <ArrowLeft className="h-4 w-4 mr-2" /> Back to Problems
                 </Button>
            </div>
        </Layout>
     );
  }

  return (
    <Layout links={links}>
      {/* Use CSS variable for navbar height offset if possible */}
      <div className="p-4 md:p-6 lg:p-8 flex flex-col h-[calc(100vh-var(--navbar-height,64px))]">

        {/* Header */}
        <div className="flex items-center mb-4 md:mb-6 flex-shrink-0">
          <Button
            variant="primary"
            onClick={() => router.back()}
            className="mr-2 md:mr-4 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100 truncate mr-3">
            {problem.title}
          </h1>
          <span
                className={`px-2.5 py-0.5 rounded text-xs font-medium capitalize ${
                    problem.difficulty === 'easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                    problem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                }`}
            >
            {problem.difficulty}
          </span>
        </div>

        {/* Main Content Split */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 flex-grow min-h-0">

          {/* Left Panel */}
          <div className="w-full md:w-1/2 bg-white dark:bg-gray-850 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              {["Description", "Editorial", "Test Cases"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as "Description" | "Editorial" | "Test Cases")}
                  className={`px-4 py-2 md:px-5 md:py-2.5 text-sm font-medium focus:outline-none ${activeTab === tab
                    ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content Area */}
            <div className="p-4 md:p-6 overflow-y-auto flex-grow">
              {activeTab === "Description" && (
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{problem.description || "No description available."}</ReactMarkdown>
                </div>
              )}
              {activeTab === "Editorial" && (
                 <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{problem.editorial || "No editorial available."}</ReactMarkdown>
                </div>
              )}
              {activeTab === "Test Cases" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100 border-b pb-2 dark:border-gray-700">
                    Test Cases Results
                  </h3>
                  {/* Overall Status */}
                   {(submissionStatus === 'submitting' || submissionStatus === 'completed') && (
                      <div className={`text-center p-3 mb-4 rounded border text-sm font-medium ${
                          submissionStatus === 'submitting' ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700 text-blue-700 dark:text-blue-300' :
                          submissionResults?.status === 'SUCCESS' ? 'bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-700 text-green-700 dark:text-green-300' :
                          'bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-700 text-red-700 dark:text-red-300'
                      }`}>
                          {submissionStatus === 'submitting' && <><Loader2 className="h-4 w-4 animate-spin inline mr-2" /> Running on Test Cases...</>}
                          {submissionStatus === 'completed' && submissionResults?.status === 'SUCCESS' && 'Accepted'}
                          {submissionStatus === 'completed' && submissionResults?.status !== 'SUCCESS' && `Result: ${submissionResults?.status || 'Unknown Error'}`}
                      </div>
                   )}
                   {/* Idle State message */}
                   {submissionStatus === 'idle' && (
                     <div className="text-center p-4 text-gray-500 dark:text-gray-400 text-sm">
                         Submit your code to see the results here. The defined test cases are shown below.
                     </div>
                   )}

                  {/* Individual Test Cases */}
                  {problem.testCases.map((tc, index) => (
                    <div key={tc._id || index} className="mb-3 p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">Test Case {index + 1}</span>
                         {(submissionStatus === 'submitting' || submissionStatus === 'completed') && (
                           <div className="flex items-center space-x-2">
                               {renderStatusIcon(
                                  submissionStatus === 'submitting' ? 'pending' :
                                  submissionResults?.testCaseResults?.[index]?.status ?? null
                               )}
                                {submissionStatus === 'completed' && submissionResults?.testCaseResults?.[index]?.status && (
                                     <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                                        submissionResults.testCaseResults[index].status === 'SUCCESS' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                                     }`}>
                                        {submissionResults.testCaseResults[index].status}
                                     </span>
                                )}
                           </div>
                         )}
                      </div>
                      {/* Input/Output Details */}
                      <div className="space-y-2">
                        <div>
                           <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Input:</p>
                           <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-1.5 rounded mt-0.5 whitespace-pre-wrap break-words font-mono"><code>{tc.input}</code></pre>
                        </div>
                        {/* Hide Expected Output if submission is running/completed */}
                        {(submissionStatus === 'idle') && (
                             <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Expected Output:</p>
                                <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-1.5 rounded mt-0.5 whitespace-pre-wrap break-words font-mono"><code>{tc.output}</code></pre>
                             </div>
                        )}
                        {/* Show Actual Output only on failure after completion */}
                        {submissionStatus === 'completed' &&
                         submissionResults?.testCaseResults?.[index]?.status &&
                         submissionResults.testCaseResults[index].status !== 'SUCCESS' && (
                           <div>
                             <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-0.5">Actual Output:</p>
                             <pre className="text-xs bg-red-50 dark:bg-red-900/30 p-1.5 rounded mt-0.5 whitespace-pre-wrap break-words border border-red-200 dark:border-red-700 font-mono">
                               <code>{submissionResults.testCaseResults[index].output !== undefined && submissionResults.testCaseResults[index].output !== null && submissionResults.testCaseResults[index].output !== '' ? submissionResults.testCaseResults[index].output : '(No output or empty)'}</code>
                            </pre>
                           </div>
                       )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full md:w-1/2 flex flex-col">
            {/* Controls */}
            <div className="mb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 flex-shrink-0">
             {/* --- LANGUAGE DROPDOWN --- */}
             <div className="flex items-center">
                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-3">Language:</span>
                 <DropdownMenu.Root>
                   <DropdownMenu.Trigger asChild>
                    {/* --- MODIFY THIS BUTTON --- */}
                    <Button
                        variant="outline"
                        // Original Classes: className="min-w-[120px] justify-between text-xs md:text-sm"
                        // --- Add flex and items-center, keep justify-between ---
                        className="flex items-center justify-between min-w-[120px] text-xs md:text-sm"
                    >
                         <span>{selectedLanguage}</span>
                         <ChevronDown className="h-4 w-4 ml-2 opacity-60 flex-shrink-0" /> {/* Added flex-shrink-0 */}
                    </Button>
                    {/* --- END OF MODIFIED BUTTON --- */}
                   </DropdownMenu.Trigger>
                   <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg min-w-[150px] py-1 z-50"
                        sideOffset={5}
                        align="start"
                    >
                      {/* Dropdown Items */}
                      {languages.map((lang) => (
                        <DropdownMenu.Item
                          key={lang}
                          onSelect={() => handleLanguageChange(lang)}
                          className="px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-700"
                        >
                          {lang}
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>
               {/* --- END LANGUAGE DROPDOWN --- */}

              {/* Submit Button */}
              <Button
                className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
                onClick={handleSubmit}
                disabled={submissionStatus === 'submitting' || loading}
              >
                {submissionStatus === 'submitting' ? (
                    <>
                     <Loader2 className="h-4 w-4 animate-spin inline mr-1.5" /> Submitting...
                    </>
                 ) : (
                     "Submit"
                 )}
              </Button>
            </div>

            {/* Editor */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex-grow flex flex-col overflow-hidden">
              <Editor
                height="100%"
                width="100%"
                language={languageMap[selectedLanguage]}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  selectOnLineNumbers: true,
                  readOnly: false,
                  wordWrap: "on",
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  scrollbar: { vertical: 'auto', horizontal: 'auto' },
                  quickSuggestions: true,
                  suggestOnTriggerCharacters: true,
                  hover: { enabled: true },
                  renderValidationDecorations: "on",
                }}
                // key={selectedLanguage} // Usually not needed, language prop handles it
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProblemPage;