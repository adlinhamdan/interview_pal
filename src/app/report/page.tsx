'use client';

import { jsPDF } from 'jspdf';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const alternateFeedbackData = [
    {
        question: 'What are your long-term career goals?',
        answer: `My long-term career goal is to become a project manager and lead cross-functional teams to deliver impactful projects.`,
        feedback: `Content Quality: Clearly defined goal, but provide specific examples of how you plan to achieve it.
Communication Clarity: Well-articulated, good job.
Improvement Areas: Add measurable milestones to track progress.`,
    },
    {
        question: 'How do you handle stressful situations?',
        answer: `I stay calm, prioritize tasks, and focus on finding solutions.`,
        feedback: `Content Quality: Good strategy, but add examples of stressful situations you handled successfully.
Communication Clarity: Clear and concise, good work.
Improvement Areas: Highlight how your approach benefits your team.`,
    },
    {
        question: 'What motivates you in your work?',
        answer: `I am motivated by achieving goals and seeing the tangible results of my work.`,
        feedback: `Content Quality: Good response, but elaborate on specific goals or projects that motivated you.
Communication Clarity: Clear, but avoid being overly general.
Improvement Areas: Mention how your motivation positively impacts team dynamics.`,
    },
];

const getProgressColor = (score: number) => {
    if (score <= 25) return 'text-red-500'; // Red for low scores
    if (score <= 50) return 'text-orange-500'; // Orange for medium-low scores
    if (score <= 75) return 'text-yellow-500'; // Yellow for medium-high scores
    return 'text-green-500'; // Green for high scores
};

const generateAlternatePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text('InterviewPal - Feedback Report', 10, 10);

    let y = 20; // Initial y position
    const lineHeight = 10; // Set consistent line height

    alternateFeedbackData.forEach((item, index) => {
        // Add a question header
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(`Question ${index + 1}: ${item.question}`, 10, y);
        y += lineHeight + 2; // Add spacing after the question

        // Add the answer section
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.text(`Answer: ${item.answer}`, 10, y, { maxWidth: 190 });
        y += lineHeight * 2; // Add spacing after the answer

        // Add the feedback section
        doc.setFont('helvetica', 'bold');
        doc.text('Feedback:', 10, y);
        y += lineHeight; // Add spacing for feedback header
        doc.setFont('helvetica', 'normal');
        doc.text(`${item.feedback}`, 10, y, { maxWidth: 190 });
        y += lineHeight * 3; // Add extra spacing after feedback

        // Check if y exceeds the page height
        if (y > 260) {
            doc.addPage();
            y = 20; // Reset y for the new page
        }
    });

    // Add a footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount}`, 105, 290, null, null, 'center');
    }

    // Save the PDF
    doc.save('feedback_report.pdf');
};

export default function AlternateReportPage() {
    const router = useRouter();
    const overallScore = 80; // Example overall score

    return (
        <section className="min-h-screen bg-black text-white px-8 pb-16">
            <header className="w-full py-6 bg-black text-center"></header>
            <main className="overflow-hidden space-y-8">
                {/* Overall Summary Card */}
                <motion.div
                    className="bg-white text-black rounded-lg p-6 shadow-lg mx-auto max-w-3xl mt-12"
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.5,
                        ease: 'easeOut',
                        delay: 0.2,
                    }}
                >
                    <h2 className="text-2xl font-bold text-center">
                        Good Job!
                    </h2>
                    <p className="text-gray-700 mt-2 text-center">
                        Here's your overall performance summary
                    </p>
                    <div className="flex justify-center items-center mt-6">
                        <div className="relative w-24 h-24">
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                                <circle
                                    className="text-gray-300"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                    cx="18"
                                    cy="18"
                                    r="16"
                                />
                                <motion.circle
                                    className={getProgressColor(overallScore)}
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    fill="none"
                                    cx="18"
                                    cy="18"
                                    r="16"
                                    strokeDasharray="100"
                                    initial={{
                                        strokeDashoffset: 100,
                                    }}
                                    animate={{
                                        strokeDashoffset: 100 - overallScore,
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        ease: 'easeInOut',
                                    }}
                                    style={{
                                        transformOrigin: 'center',
                                        transform: 'rotate(-90deg)',
                                    }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col justify-center items-center text-black">
                                <span className="text-2xl font-bold">
                                    {overallScore}%
                                </span>
                                <span className="text-sm text-gray-700">
                                    Score
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Feedback List */}
                {alternateFeedbackData.map((item, index) => (
                    <motion.div
                        key={index}
                        className="bg-white text-black rounded-lg p-6 shadow-lg mx-auto max-w-3xl"
                        whileHover={{ scale: 1.02 }}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.5,
                            ease: 'easeOut',
                            delay: index * 0.2,
                        }}
                    >
                        <h2 className="text-xl font-bold mb-4">{`Question ${
                            index + 1
                        }`}</h2>
                        <h3 className="text-lg font-semibold mb-2">
                            {item.question}
                        </h3>
                        <div className="mt-4">
                            <p className="font-semibold text-gray-700">
                                Your Answer:
                            </p>
                            <p className="text-gray-700 mt-2">{item.answer}</p>
                        </div>
                        <div className="mt-4">
                            <p className="font-semibold text-gray-700">
                                Feedback:
                            </p>
                            <p className="text-gray-700 mt-2">
                                {item.feedback}
                            </p>
                        </div>
                    </motion.div>
                ))}

                {/* Download Report Button */}
                <div className="text-center mt-12 mb-20">
                    <button
                        onClick={generateAlternatePDF}
                        className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-800"
                    >
                        Download Alternate Report as PDF
                    </button>
                </div>
            </main>
        </section>
    );
}