
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, RotateCcw, Settings, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

interface TimerSettings {
  workTime: number;
  restTime: number;
  rounds: number;
  preparationTime: number;
  soundEnabled: boolean;
}

type TimerState = 'idle' | 'preparation' | 'work' | 'rest' | 'finished';

const TabataTimer = () => {
  const [settings, setSettings] = useState<TimerSettings>({
    workTime: 20,
    restTime: 10,
    rounds: 8,
    preparationTime: 10,
    soundEnabled: true,
  });

  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [state, setState] = useState<TimerState>('idle');
  const [isRunning, setIsRunning] = useState(false);
  const [totalTime, setTotalTime] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context
  useEffect(() => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.log('Audio context not supported');
    }
  }, []);

  // Play beep sound
  const playBeep = (frequency: number = 800, duration: number = 200) => {
    if (!settings.soundEnabled || !audioContextRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration / 1000);
    
    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration / 1000);
  };

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Time's up for current phase
            playBeep(state === 'work' ? 1000 : 600, 300);
            
            if (state === 'preparation') {
              setState('work');
              return settings.workTime;
            } else if (state === 'work') {
              if (currentRound >= settings.rounds) {
                setState('finished');
                setIsRunning(false);
                playBeep(400, 1000);
                return 0;
              } else {
                setState('rest');
                return settings.restTime;
              }
            } else if (state === 'rest') {
              setCurrentRound((prev) => prev + 1);
              setState('work');
              return settings.workTime;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, state, currentRound, settings]);

  // Calculate total workout time
  useEffect(() => {
    const total = settings.preparationTime + (settings.workTime + settings.restTime) * settings.rounds;
    setTotalTime(total);
  }, [settings]);

  const startTimer = () => {
    if (state === 'idle') {
      setState('preparation');
      setTimeLeft(settings.preparationTime);
      setCurrentRound(1);
    }
    setIsRunning(true);
    playBeep(600, 200);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setState('idle');
    setCurrentRound(1);
    setTimeLeft(0);
  };

  const getStateColor = () => {
    switch (state) {
      case 'preparation':
        return 'bg-yellow-500';
      case 'work':
        return 'bg-red-500';
      case 'rest':
        return 'bg-green-500';
      case 'finished':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStateText = () => {
    switch (state) {
      case 'preparation':
        return 'GET READY';
      case 'work':
        return 'WORK';
      case 'rest':
        return 'REST';
      case 'finished':
        return 'FINISHED';
      default:
        return 'READY';
    }
  };

  const getCurrentPhaseTime = () => {
    switch (state) {
      case 'preparation':
        return settings.preparationTime;
      case 'work':
        return settings.workTime;
      case 'rest':
        return settings.restTime;
      default:
        return 0;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = getCurrentPhaseTime() > 0 ? ((getCurrentPhaseTime() - timeLeft) / getCurrentPhaseTime()) * 100 : 0;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-between">
          Tabata Timer
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
            >
              {settings.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Timer Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="workTime">Work Time (seconds)</Label>
                    <Input
                      id="workTime"
                      type="number"
                      value={settings.workTime}
                      onChange={(e) => setSettings({ ...settings, workTime: parseInt(e.target.value) || 20 })}
                      min="1"
                      max="300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="restTime">Rest Time (seconds)</Label>
                    <Input
                      id="restTime"
                      type="number"
                      value={settings.restTime}
                      onChange={(e) => setSettings({ ...settings, restTime: parseInt(e.target.value) || 10 })}
                      min="1"
                      max="300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rounds">Number of Rounds</Label>
                    <Input
                      id="rounds"
                      type="number"
                      value={settings.rounds}
                      onChange={(e) => setSettings({ ...settings, rounds: parseInt(e.target.value) || 8 })}
                      min="1"
                      max="50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="preparationTime">Preparation Time (seconds)</Label>
                    <Input
                      id="preparationTime"
                      type="number"
                      value={settings.preparationTime}
                      onChange={(e) => setSettings({ ...settings, preparationTime: parseInt(e.target.value) || 10 })}
                      min="0"
                      max="60"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="soundEnabled"
                      checked={settings.soundEnabled}
                      onCheckedChange={(checked) => setSettings({ ...settings, soundEnabled: checked })}
                    />
                    <Label htmlFor="soundEnabled">Sound Enabled</Label>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Timer Display */}
        <div className={`${getStateColor()} text-white rounded-lg p-8 text-center transition-colors duration-300`}>
          <div className="text-lg font-semibold mb-2">{getStateText()}</div>
          <div className="text-6xl font-bold mb-2">{formatTime(timeLeft)}</div>
          <div className="text-sm opacity-90">
            Round {currentRound} of {settings.rounds}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Phase Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Workout Summary */}
        <div className="bg-muted rounded-lg p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Work Time:</span>
            <span>{settings.workTime}s</span>
          </div>
          <div className="flex justify-between">
            <span>Rest Time:</span>
            <span>{settings.restTime}s</span>
          </div>
          <div className="flex justify-between">
            <span>Total Rounds:</span>
            <span>{settings.rounds}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total Time:</span>
            <span>{formatTime(totalTime)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-2 justify-center">
          {!isRunning && state === 'idle' && (
            <Button onClick={startTimer} className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              Start
            </Button>
          )}
          
          {!isRunning && state !== 'idle' && state !== 'finished' && (
            <Button onClick={startTimer} className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              Resume
            </Button>
          )}
          
          {isRunning && (
            <Button onClick={pauseTimer} variant="outline" className="flex-1">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          )}
          
          <Button onClick={resetTimer} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        {state === 'finished' && (
          <div className="text-center text-green-600 font-semibold">
            🎉 Workout Complete! Great job!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TabataTimer;
