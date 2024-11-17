'use client';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel';
import { type CarouselApi } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AudioRecorderWithVisualizer } from '@/components/ui/AudioRecorderWithVisualizer';
import { motion, AnimatePresence } from 'framer-motion';

export default function Answer() {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [loadingStates, setLoadingStates] = useState<boolean[]>([]);
    const [feedbackStates, setFeedbackStates] = useState<boolean[]>([]);
    const [questionBank, setQuestionBank] = useState<string[]>([]); // State for API data
    const [loadingQuestions, setLoadingQuestions] = useState(true); // Loading state for API fetch
    const router = useRouter();

    // Fetch questions from API
    const fetchQuestions = async () => {
        setLoadingQuestions(true);
        try {
            const response = await fetch('/api/resume-backend'); // Replace with your API endpoint
            const data = await response.json();
            setQuestionBank(data.questions); // Assume API response is { questions: [...] }
            setLoadingStates(Array(data.questions.length).fill(true));
            setFeedbackStates(Array(data.questions.length).fill(false));
        } catch (error) {
            console.error('Failed to fetch questions:', error);
        } finally {
            setLoadingQuestions(false);
        }
    };

    const fetchQuestion = (index: number) => {
        setLoadingStates((prev) => {
            const newStates = [...prev];
            newStates[index] = true;
            return newStates;
        });
        setTimeout(() => {
            setLoadingStates((prev) => {
                const newStates = [...prev];
                newStates[index] = false;
                return newStates;
            });
        }, 1000); // Simulate 1-second delay
    };

    const handleFeedbackDisplay = (index: number) => {
        setTimeout(() => {
            setFeedbackStates((prev) => {
                const newStates = [...prev];
                newStates[index] = true;
                return newStates;
            });
        }, 500); // Delay before feedback becomes active
    };

    useEffect(() => {
        fetchQuestions(); // Fetch questions on component mount
    }, []);

    useEffect(() => {
        if (api && questionBank.length > 0) {
            fetchQuestion(current);
            api.on('select', () => {
                const newIndex = api.selectedScrollSnap();
                setCurrent(newIndex);
                fetchQuestion(newIndex);
            });
        }
    }, [api, questionBank]);

    const handleNextButtonClick = () => {
        if (current === questionBank.length - 1) {
            router.push('/report'); // Navigate to the /report route when on the last card
        } else {
            api?.scrollTo(current + 1);
        }
    };

    if (loadingQuestions) {
        return (
            <div className="w-full h-[89vh] flex items-center justify-center bg-black text-white">
                <p>Loading questions...</p>
            </div>
        );
    }

    return (
        <div className="w-full h-[89vh] flex items-center justify-center relative bg-black text-white">
            <div className="w-full max-w-5xl mx-auto flex flex-row items-center justify-center">
                <Button
                    onClick={() => api?.scrollTo(current - 1)}
                    disabled={loadingStates[current]}
                    className="bg-white text-black mx-4 hover:bg-black hover:text-white"
                >
                    Previous
                </Button>
                <Carousel className="relative" setApi={setApi}>
                    <CarouselContent className="flex">
                        {questionBank.map((question, index) => (
                            <CarouselItem
                                key={index}
                                className="min-w-full flex justify-center items-center"
                            >
                                <div className="p-8 bg-gray-800 rounded-2xl shadow-md max-w-2xl w-full h-[600px] flex flex-col justify-center items-center">
                                    <AnimatePresence>
                                        {!feedbackStates[index] ? (
                                            <motion.div
                                                key={`content-${index}`}
                                                initial={{ opacity: 0, y: -50 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 50 }}
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 100,
                                                    damping: 15,
                                                    duration: 0.6,
                                                }}
                                                className="w-full h-full flex flex-col justify-between items-center"
                                            >
                                                {loadingStates[index] ? (
                                                    <p>Loading question...</p>
                                                ) : (
                                                    <>
                                                        <p className="text-xl mb-8">
                                                            {question}
                                                        </p>
                                                        <AudioRecorderWithVisualizer
                                                            className="rounded-lg bg-black text-white"
                                                            timerClassName="text-lg font-mono"
                                                            onSubmit={() =>
                                                                handleFeedbackDisplay(
                                                                    index
                                                                )
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key={`feedback-${index}`}
                                                initial={{ opacity: 0, y: 100 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 100 }}
                                                transition={{
                                                    ease: [0.42, 0, 0.58, 1],
                                                    duration: 0.8,
                                                    delay: 0.3,
                                                }}
                                                className="w-full h-full flex flex-col justify-center items-center"
                                            >
                                                <p className="text-lg">
                                                    Feedback: Well done!
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
                <Button
                    onClick={handleNextButtonClick}
                    disabled={loadingStates[current]}
                    className="bg-white text-black mx-4 hover:bg-black hover:text-white"
                >
                    {current === questionBank.length - 1
                        ? 'Generate Report'
                        : 'Next'}
                </Button>
            </div>
        </div>
    );
}
