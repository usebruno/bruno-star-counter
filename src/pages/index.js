import { useState, useEffect } from "react";
import Image from "next/image";
import localFont from "next/font/local";
import { motion, AnimatePresence } from "framer-motion";
import BrunoIcon from "./bruno-icon";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

function AnimatedDigit({ digit, direction }) {
  return (
    <div className="w-20 h-28 bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={digit}
          initial={{ y: direction === 'up' ? 50 : -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: direction === 'up' ? -50 : 50, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="text-6xl font-bold text-white absolute"
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  const [starCount, setStarCount] = useState(0);
  const [prevStarCount, setPrevStarCount] = useState(0);

  useEffect(() => {
    const fetchStarCount = async () => {
      try {
        const timestamp = new Date().getTime();
        const url = `https://api.github.com/repos/usebruno/bruno?t=${timestamp}`;
        
        const githubToken = localStorage.getItem('GITHUB_API_TOKEN');
        
        const headers = new Headers();
        if (githubToken) {
          headers.append('Authorization', `Bearer ${githubToken}`);
        }

        const response = await fetch(url, { headers });
        const data = await response.json();
        if (data.stargazers_count !== starCount) {
          setPrevStarCount(starCount);
          setStarCount(data.stargazers_count);
        }
      } catch (error) {
        console.error('Error fetching star count:', error);
      }
    };

    fetchStarCount();
    const interval = setInterval(fetchStarCount, 2000);

    return () => clearInterval(interval);
  }, [starCount]);

  const starCountString = starCount.toString().padStart(5, '0');
  const prevStarCountString = prevStarCount.toString().padStart(5, '0');

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} grid grid-rows-[1fr_auto] min-h-screen p-8 pb-20 font-[family-name:var(--font-geist-sans)] bg-gray-100`}
    >
      <main className="flex flex-col items-center pt-10 gap-8">
        <BrunoIcon width={150} />
        <h1 className="text-5xl font-bold mb-8">Bruno GitHub Stars</h1>
        <div className="flex gap-2">
          {starCountString.split('').map((digit, index) => {
            const prevDigit = prevStarCountString[index];
            const direction = parseInt(digit) >= parseInt(prevDigit) ? 'down' : 'up';
            return <AnimatedDigit key={`${index}-${digit}`} digit={digit} direction={direction} />;
          })}
        </div>
      </main>
      <footer className="flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.usebruno.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to usebruno.com →
        </a>
      </footer>
    </div>
  );
}
