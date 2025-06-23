import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dumbbell, Clock, AlertTriangle, Target, Users, Zap } from 'lucide-react';
import TabataTimer from '@/components/TabataTimer';

interface Exercise {
  id: number;
  name: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  targetMuscles: string[];
  equipment: string;
  instructions: string[];
  safetyTips: string[];
  commonMistakes: string[];
}

const exercises: Exercise[] = [
  {
    id: 1,
    name: "Push-ups",
    category: "Chest",
    difficulty: "Beginner",
    equipment: "None",
    targetMuscles: ["Chest", "Triceps", "Shoulders"],
    instructions: [
      "Start in a plank position with hands slightly wider than shoulder-width apart",
      "Keep your body in a straight line from head to heels",
      "Lower your chest towards the ground by bending your elbows",
      "Push back up to the starting position",
      "Repeat for desired repetitions"
    ],
    safetyTips: [
      "Keep your core engaged throughout the movement",
      "Don't let your hips sag or pike up",
      "Lower yourself in a controlled manner",
      "If you can't do full push-ups, start with knee push-ups",
      "Stop if you feel pain in your wrists or shoulders"
    ],
    commonMistakes: [
      "Flaring elbows too wide",
      "Not going through full range of motion",
      "Holding breath during the exercise",
      "Moving too fast without control"
    ]
  },
  {
    id: 2,
    name: "Squats",
    category: "Legs",
    difficulty: "Beginner",
    equipment: "None",
    targetMuscles: ["Quadriceps", "Glutes", "Hamstrings"],
    instructions: [
      "Stand with feet shoulder-width apart, toes slightly pointed out",
      "Keep your chest up and core engaged",
      "Lower your hips back and down as if sitting in a chair",
      "Go down until your thighs are parallel to the ground",
      "Push through your heels to return to starting position"
    ],
    safetyTips: [
      "Keep your knees in line with your toes",
      "Don't let your knees cave inward",
      "Keep your weight on your heels and mid-foot",
      "Maintain a neutral spine throughout",
      "Start with bodyweight before adding resistance"
    ],
    commonMistakes: [
      "Knees going past toes",
      "Rounding the back",
      "Not going deep enough",
      "Rising on toes during the movement"
    ]
  },
  {
    id: 3,
    name: "Deadlifts",
    category: "Back",
    difficulty: "Intermediate",
    equipment: "Barbell",
    targetMuscles: ["Hamstrings", "Glutes", "Lower Back", "Traps"],
    instructions: [
      "Stand with feet hip-width apart, barbell over mid-foot",
      "Bend at hips and knees to grip the bar with hands shoulder-width apart",
      "Keep chest up, shoulders back, and spine neutral",
      "Drive through heels and extend hips and knees simultaneously",
      "Stand tall with shoulders back, then reverse the movement"
    ],
    safetyTips: [
      "Always warm up thoroughly before deadlifting",
      "Start with light weight to learn proper form",
      "Keep the bar close to your body throughout",
      "Never round your back under load",
      "Use proper breathing technique (breathe and brace before lifting)"
    ],
    commonMistakes: [
      "Bar drifting away from the body",
      "Hyperextending at the top",
      "Using arms to pull the weight",
      "Not engaging the lats"
    ]
  },
  {
    id: 4,
    name: "Plank",
    category: "Core",
    difficulty: "Beginner",
    equipment: "None",
    targetMuscles: ["Core", "Shoulders", "Glutes"],
    instructions: [
      "Start in a push-up position with forearms on the ground",
      "Keep your body in a straight line from head to heels",
      "Engage your core and glutes",
      "Hold the position while breathing normally",
      "Maintain proper form for the desired duration"
    ],
    safetyTips: [
      "Don't hold your breath during the plank",
      "Keep your hips level - don't let them sag or pike",
      "Start with shorter holds and gradually increase time",
      "Stop if you feel pain in your lower back",
      "Focus on quality over duration"
    ],
    commonMistakes: [
      "Sagging hips",
      "Raised hips too high",
      "Looking up or down instead of forward",
      "Holding breath"
    ]
  },
  {
    id: 5,
    name: "Pull-ups",
    category: "Back",
    difficulty: "Advanced",
    equipment: "Pull-up bar",
    targetMuscles: ["Lats", "Rhomboids", "Biceps", "Rear Delts"],
    instructions: [
      "Hang from a pull-up bar with palms facing away",
      "Keep your body straight and core engaged",
      "Pull yourself up until your chin clears the bar",
      "Lower yourself back down with control",
      "Repeat for desired repetitions"
    ],
    safetyTips: [
      "Use proper grip - hands should be secure on the bar",
      "Don't use momentum or kipping unless specifically training for it",
      "Lower yourself slowly to build strength",
      "Use assistance bands or machine if you can't do full pull-ups yet",
      "Ensure the pull-up bar is secure before use"
    ],
    commonMistakes: [
      "Using momentum to swing up",
      "Not going through full range of motion",
      "Dropping down too quickly",
      "Neglecting proper warm-up"
    ]
  }
];

const categories = ["All", "Chest", "Legs", "Back", "Core"];

const PersonalTrainer = () => {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredExercises = selectedCategory === "All" 
    ? exercises 
    : exercises.filter(exercise => exercise.category === selectedCategory);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Personal Trainer
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Learn proper exercise form, get safety tips, and time your workouts with our comprehensive training tools.
        </p>
      </div>

      <Tabs defaultValue="exercises" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="exercises" className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4" />
            Exercise Guide
          </TabsTrigger>
          <TabsTrigger value="timer" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Tabata Timer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="exercises" className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Exercise List */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Choose an Exercise</h2>
              <div className="space-y-3">
                {filteredExercises.map((exercise) => (
                  <Card 
                    key={exercise.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedExercise?.id === exercise.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedExercise(exercise)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{exercise.name}</h3>
                        <Badge className={getDifficultyColor(exercise.difficulty)}>
                          {exercise.difficulty}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {exercise.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Dumbbell className="h-3 w-3" />
                          {exercise.equipment}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {exercise.targetMuscles.map((muscle) => (
                          <Badge key={muscle} variant="secondary" className="text-xs">
                            {muscle}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Exercise Details */}
            <div className="space-y-4">
              {selectedExercise ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Dumbbell className="h-5 w-5" />
                        {selectedExercise.name} Instructions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ol className="space-y-2">
                        {selectedExercise.instructions.map((instruction, index) => (
                          <li key={index} className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </span>
                            <span>{instruction}</span>
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Safety Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedExercise.safetyTips.map((tip, index) => (
                          <li key={index} className="flex gap-3">
                            <span className="text-red-500 font-bold">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-amber-600">
                        <Zap className="h-5 w-5" />
                        Common Mistakes to Avoid
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedExercise.commonMistakes.map((mistake, index) => (
                          <li key={index} className="flex gap-3">
                            <span className="text-amber-500 font-bold">⚠</span>
                            <span>{mistake}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="h-96 flex items-center justify-center">
                  <CardContent className="text-center">
                    <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Select an Exercise</h3>
                    <p className="text-muted-foreground">
                      Choose an exercise from the list to see detailed instructions and safety tips.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="timer" className="space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Tabata Timer</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Perfect for High-Intensity Interval Training (HIIT), Tabata workouts, cycling intervals, running sprints, and any timed exercise routine. Customize your work and rest periods to match your fitness goals.
            </p>
          </div>
          
          <div className="flex justify-center">
            <TabataTimer />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Customizable Intervals</h3>
                <p className="text-sm text-muted-foreground">Set your own work/rest times, rounds, and preparation period</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Audio Cues</h3>
                <p className="text-sm text-muted-foreground">Sound alerts for phase transitions to keep you focused</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Progress Tracking</h3>
                <p className="text-sm text-muted-foreground">Visual progress bars and round counters</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonalTrainer;
