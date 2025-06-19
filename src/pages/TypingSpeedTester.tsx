
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Keyboard, Timer, Target, RotateCcw, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

const TypingSpeedTester = () => {
  const [sampleText] = useState([
    "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet and is commonly used for typing practice.",
    "Technology has revolutionized the way we communicate, work, and live. From smartphones to artificial intelligence, innovation continues to shape our future.",
    "Reading books opens up new worlds and perspectives. It enhances vocabulary, improves concentration, and provides knowledge across various subjects and disciplines.",
    "Healthy eating habits and regular exercise are essential for maintaining good physical and mental health throughout life.",
    "Time management is a crucial skill that helps people achieve their goals efficiently while maintaining a healthy work-life balance."
  ]);

  const [currentText, setCurrentText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [wordsTyped, setWordsTyped] = useState(0);
  const [testDuration, setTestDuration] = useState(60);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set random text when component mounts
    const randomText = sampleText[Math.floor(Math.random() * sampleText.length)];
    setCurrentText(randomText);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setIsCompleted(true);
      calculateResults();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const calculateResults = () => {
    const timeElapsed = (testDuration - timeLeft) / 60; // in minutes
    const wordsCount = userInput.trim().split(/\s+/).length;
    const wpmResult = Math.round(wordsCount / timeElapsed) || 0;
    
    // Calculate accuracy
    let correctChars = 0;
    const minLength = Math.min(userInput.length, currentText.length);
    
    for (let i = 0; i < minLength; i++) {
      if (userInput[i] === currentText[i]) {
        correctChars++;
      }
    }
    
    const accuracyResult = minLength > 0 ? Math.round((correctChars / minLength) * 100) : 100;
    const errorsCount = minLength - correctChars;
    
    setWpm(wpmResult);
    setAccuracy(accuracyResult);
    setErrors(errorsCount);
    setWordsTyped(wordsCount);

    toast({
      title: "Test Completed!",
      description: `Your typing speed: ${wpmResult} WPM with ${accuracyResult}% accuracy`,
    });
  };

  const startTest = () => {
    setIsActive(true);
    setIsCompleted(false);
    textareaRef.current?.focus();
  };

  const pauseTest = () => {
    setIsActive(false);
  };

  const resetTest = () => {
    setIsActive(false);
    setIsCompleted(false);
    setUserInput('');
    setTimeLeft(testDuration);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setWordsTyped(0);
    
    // Set new random text
    const randomText = sampleText[Math.floor(Math.random() * sampleText.length)];
    setCurrentText(randomText);
    
    toast({
      title: "Test Reset",
      description: "Ready for a new typing test!",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isActive && !isCompleted) {
      startTest();
    }
    setUserInput(e.target.value);
  };

  const getCharacterColor = (index: number) => {
    if (index >= userInput.length) return 'text-gray-400';
    if (userInput[index] === currentText[index]) return 'text-green-600 bg-green-100';
    return 'text-red-600 bg-red-100';
  };

  const getSpeedLevel = (wpm: number) => {
    if (wpm >= 70) return { level: 'Expert', color: 'bg-purple-500' };
    if (wpm >= 50) return { level: 'Advanced', color: 'bg-blue-500' };
    if (wpm >= 35) return { level: 'Intermediate', color: 'bg-green-500' };
    if (wpm >= 20) return { level: 'Beginner', color: 'bg-yellow-500' };
    return { level: 'Novice', color: 'bg-gray-500' };
  };

  const progressPercentage = ((testDuration - timeLeft) / testDuration) * 100;
  const speedLevel = getSpeedLevel(wpm);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
          <Keyboard className="h-8 w-8 text-primary" />
          Typing Speed Tester
        </h1>
        <p className="text-muted-foreground">
          Test and improve your typing speed and accuracy
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Timer className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Time</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{timeLeft}s</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">WPM</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{wpm}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-sm font-medium">Accuracy</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">{accuracy}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-sm font-medium">Errors</span>
            </div>
            <div className="text-2xl font-bold text-red-600">{errors}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Typing Test</CardTitle>
              <CardDescription>Type the text below as accurately and quickly as possible</CardDescription>
            </div>
            <div className="flex gap-2">
              {!isActive && !isCompleted && (
                <Button onClick={startTest} size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </Button>
              )}
              {isActive && (
                <Button onClick={pauseTest} variant="outline" size="sm">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              )}
              <Button onClick={resetTest} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg border">
            <div className="text-lg leading-relaxed font-mono">
              {currentText.split('').map((char, index) => (
                <span
                  key={index}
                  className={`${getCharacterColor(index)} px-0.5 rounded`}
                >
                  {char}
                </span>
              ))}
            </div>
          </div>

          <Textarea
            ref={textareaRef}
            value={userInput}
            onChange={handleInputChange}
            placeholder="Start typing here..."
            className="min-h-32 text-lg font-mono"
            disabled={isCompleted}
          />

          <Progress value={progressPercentage} className="w-full" />
        </CardContent>
      </Card>

      {isCompleted && (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Test Results</CardTitle>
            <CardDescription>Your typing performance summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <div className="text-sm text-muted-foreground">Words Per Minute</div>
                <div className="text-3xl font-bold text-green-600">{wpm}</div>
                <Badge className={speedLevel.color + " text-white mt-2"}>
                  {speedLevel.level}
                </Badge>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <div className="text-sm text-muted-foreground">Accuracy</div>
                <div className="text-3xl font-bold text-blue-600">{accuracy}%</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg text-center">
                <div className="text-sm text-muted-foreground">Words Typed</div>
                <div className="text-3xl font-bold text-purple-600">{wordsTyped}</div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg text-center">
                <div className="text-sm text-muted-foreground">Errors</div>
                <div className="text-3xl font-bold text-red-600">{errors}</div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Performance Tips:</h4>
              <div className="text-sm space-y-1">
                {wpm < 20 && <p>• Practice regularly to improve your typing speed</p>}
                {accuracy < 90 && <p>• Focus on accuracy before speed - it's better to type slower but correctly</p>}
                {wpm >= 50 && <p>• Great job! You're typing at an excellent speed</p>}
                {accuracy >= 95 && <p>• Outstanding accuracy! Keep up the great work</p>}
                <p>• Average typing speed is 35-40 WPM for casual typists</p>
                <p>• Professional typists typically type at 65-75 WPM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TypingSpeedTester;
