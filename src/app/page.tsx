import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { FlipWords } from '@/components/ui/flip-words';
import { cn } from '@/lib/utils'; // Import the `cn` utility

export default function Home() {
    const words = ['better', 'smarter', 'faster'];

    return (
        <div
            className={cn(
                'w-full h-screen flex justify-center items-center',
                'bg-black text-white' // Set a background color and font color
            )}
        >
            <section
                className={cn(
                    'w-full h-[92vh] flex flex-row justify-between items-center py-[40vh] px-[4vw]'
                )}
            >
                <div className="flex flex-col justify-center items-left gap-[4vh]">
                    <span className="text-4xl font-bold text-white">
                        InterviewPal
                    </span>
                    <div className="flex justify-left items-left">
                        <div className="text-4xl font-normal text-white">
                            Prepare <FlipWords words={words} className="text-white" /> <br />
                            for your technical interviews.
                        </div>
                    </div>
                    <p className="text-4xl text-white">
                        Practice{' '}
                        <span className="font-bold text-white">key</span>{' '}
                        questions, <br />
                        get insights about your answer, <br />
                        and more!
                    </p>
                </div>
                <SignedOut>
                    <SignInButton>
                        <Button className="h-11 rounded-md px-8">
                            Start practicing
                        </Button>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <Link href="/resume">
                        <Button className="h-11 rounded-md px-8">
                            Start practicing
                        </Button>
                    </Link>
                </SignedIn>
            </section>
        </div>
    );
}
