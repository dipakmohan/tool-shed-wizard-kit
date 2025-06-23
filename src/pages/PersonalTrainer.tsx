
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Clock, Target, AlertTriangle, Repeat, Users } from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  targetMuscles: string[];
  equipment: string;
  instructions: string[];
  precautions: string[];
  sets: string;
  reps: string;
  restTime: string;
  tips: string[];
}

const exercises: Exercise[] = [
  {
    id: "push-ups",
    name: "Push-ups",
    category: "Chest",
    difficulty: "Beginner",
    targetMuscles: ["Chest", "Triceps", "Shoulders", "Core"],
    equipment: "None",
    instructions: [
      "Start in a plank position with hands slightly wider than shoulder-width apart",
      "Keep your body in a straight line from head to heels",
      "Lower your chest toward the ground by bending your elbows",
      "Push back up to starting position by extending your arms",
      "Keep your core engaged throughout the movement"
    ],
    precautions: [
      "Don't let your hips sag or pike up",
      "Keep your head in neutral position - don't crane your neck",
      "Don't flare your elbows too wide (keep them at 45-degree angle)",
      "If you have wrist pain, try using push-up handles or fists"
    ],
    sets: "3",
    reps: "8-15",
    restTime: "60-90 seconds",
    tips: [
      "Start with knee push-ups if regular push-ups are too difficult",
      "Focus on controlled movement rather than speed",
      "Exhale as you push up, inhale as you lower down"
    ]
  },
  {
    id: "squats",
    name: "Squats",
    category: "Legs",
    difficulty: "Beginner",
    targetMuscles: ["Quadriceps", "Glutes", "Hamstrings", "Calves"],
    equipment: "None",
    instructions: [
      "Stand with feet shoulder-width apart, toes slightly pointed out",
      "Keep your chest up and core engaged",
      "Lower down by pushing your hips back and bending your knees",
      "Go down until your thighs are parallel to the floor",
      "Push through your heels to return to starting position"
    ],
    precautions: [
      "Don't let your knees cave inward",
      "Keep your weight on your heels, not your toes",
      "Don't round your back - maintain neutral spine",
      "Don't go too deep if you have knee issues"
    ],
    sets: "3",
    reps: "12-20",
    restTime: "60-90 seconds",
    tips: [
      "Imagine sitting back into a chair",
      "Keep your knees tracking over your toes",
      "Start with bodyweight before adding weights"
    ]
  },
  {
    id: "deadlift",
    name: "Deadlift",
    category: "Back",
    difficulty: "Intermediate",
    targetMuscles: ["Hamstrings", "Glutes", "Erector Spinae", "Traps", "Lats"],
    equipment: "Barbell",
    instructions: [
      "Stand with feet hip-width apart, bar over mid-foot",
      "Bend at hips and knees to grip the bar with hands just outside legs",
      "Keep your chest up, shoulders back, and core tight",
      "Drive through your heels and extend hips and knees simultaneously",
      "Stand tall with shoulders back, then reverse the movement"
    ],
    precautions: [
      "Never round your back - maintain neutral spine throughout",
      "Don't let the bar drift away from your body",
      "Don't hyperextend at the top of the movement",
      "Start with light weight to master the form"
    ],
    sets: "3-4",
    reps: "5-8",
    restTime: "2-3 minutes",
    tips: [
      "Think 'hips back' not 'knees forward' when starting",
      "Keep the bar close to your shins and thighs",
      "Practice with just the bar or dumbbells first"
    ]
  },
  {
    id: "plank",
    name: "Plank",
    category: "Core",
    difficulty: "Beginner",
    targetMuscles: ["Core", "Shoulders", "Glutes"],
    equipment: "None",
    instructions: [
      "Start in a push-up position but on your forearms",
      "Keep your body in a straight line from head to heels",
      "Engage your core and squeeze your glutes",
      "Hold this position while breathing normally",
      "Keep your head in neutral position"
    ],
    precautions: [
      "Don't let your hips sag or pike up",
      "Don't hold your breath",
      "Don't crane your neck up or let it hang down",
      "Stop if you feel pain in your lower back"
    ],
    sets: "3",
    reps: "30-60 seconds",
    restTime: "60 seconds",
    tips: [
      "Start with shorter holds and build up time",
      "Focus on quality over duration",
      "Imagine pulling your belly button to your spine"
    ]
  },
  {
    id: "bench-press",
    name: "Bench Press",
    category: "Chest",
    difficulty: "Intermediate",
    targetMuscles: ["Chest", "Triceps", "Anterior Deltoids"],
    equipment: "Barbell, Bench",
    instructions: [
      "Lie flat on bench with eyes under the bar",
      "Grip the bar slightly wider than shoulder-width",
      "Unrack the bar and hold it over your chest",
      "Lower the bar to your chest in a controlled manner",
      "Press the bar back up to starting position"
    ],
    precautions: [
      "Always use a spotter when lifting heavy",
      "Don't bounce the bar off your chest",
      "Keep your feet planted on the floor",
      "Don't arch your back excessively"
    ],
    sets: "3-4",
    reps: "6-12",
    restTime: "2-3 minutes",
    tips: [
      "Retract your shoulder blades before lifting",
      "Lower the bar to your nipple line",
      "Keep your wrists straight and strong"
    ]
  },
  {
    id: "pull-ups",
    name: "Pull-ups",
    category: "Back",
    difficulty: "Advanced",
    targetMuscles: ["Lats", "Rhomboids", "Biceps", "Rear Deltoids"],
    equipment: "Pull-up Bar",
    instructions: [
      "Hang from the bar with arms fully extended",
      "Use an overhand grip slightly wider than shoulders",
      "Pull your body up until your chin clears the bar",
      "Lower yourself back down in a controlled manner",
      "Repeat for desired reps"
    ],
    precautions: [
      "Don't swing or use momentum",
      "Don't drop down quickly - control the descent",
      "If you can't do full pull-ups, use assisted bands",
      "Warm up your shoulders before starting"
    ],
    sets: "3-4",
    reps: "5-12",
    restTime: "2-3 minutes",
    tips: [
      "Start with assisted pull-ups or negatives",
      "Focus on pulling your elbows down and back",
      "Engage your core throughout the movement"
    ]
  }
];

const categories = ["All", "Chest", "Back", "Legs", "Core", "Shoulders", "Arms"];

const PersonalTrainer = () => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredExercises = exercises.filter(
    exercise => selectedCategory === "All" || exercise.category === selectedCategory
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (selectedExercise) {
    return (
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => setSelectedExercise(null)}
          className="mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Exercise List
        </Button>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl">{selectedExercise.name}</CardTitle>
                <Badge className={getDifficultyColor(selectedExercise.difficulty)}>
                  {selectedExercise.difficulty}
                </Badge>
              </div>
              <CardDescription className="text-lg">
                Target: {selectedExercise.targetMuscles.join(", ")}
              </CardDescription>
            </CardHeader>
          </Card>

          <Tabs defaultValue="instructions" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="instructions">Instructions</TabsTrigger>
              <TabsTrigger value="precautions">Safety</TabsTrigger>
              <TabsTrigger value="workout">Workout Plan</TabsTrigger>
              <TabsTrigger value="tips">Pro Tips</TabsTrigger>
            </TabsList>

            <TabsContent value="instructions">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    How to Perform
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Equipment: {selectedExercise.equipment}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Category: {selectedExercise.category}</span>
                      </div>
                    </div>
                    <ol className="list-decimal list-inside space-y-3">
                      {selectedExercise.instructions.map((instruction, index) => (
                        <li key={index} className="text-sm leading-relaxed">
                          {instruction}
                        </li>
                      ))}
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="precautions">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Safety Precautions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Always consult with a healthcare professional before starting any new exercise program, especially if you have pre-existing conditions.
                    </AlertDescription>
                  </Alert>
                  <ul className="space-y-3">
                    {selectedExercise.precautions.map((precaution, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{precaution}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="workout">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Repeat className="h-5 w-5" />
                    Workout Parameters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{selectedExercise.sets}</div>
                      <div className="text-sm text-muted-foreground">Sets</div>
                    </div>
                    <div className="text-center p-4 bg-green/10 rounded-lg">
                      <div className="text-2xl font-bold text-green">{selectedExercise.reps}</div>
                      <div className="text-sm text-muted-foreground">Reps</div>
                    </div>
                    <div className="text-center p-4 bg-purple/10 rounded-lg">
                      <div className="text-2xl font-bold text-purple flex items-center justify-center gap-1">
                        <Clock className="h-5 w-5" />
                        {selectedExercise.restTime}
                      </div>
                      <div className="text-sm text-muted-foreground">Rest Time</div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-accent/10 rounded-lg">
                    <h4 className="font-semibold mb-2">Target Muscles:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedExercise.targetMuscles.map((muscle, index) => (
                        <Badge key={index} variant="secondary">
                          {muscle}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tips">
              <Card>
                <CardHeader>
                  <CardTitle>Pro Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {selectedExercise.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-green-500 to-purple-600 bg-clip-text text-transparent">
          Personal Trainer
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your AI-powered fitness coach. Select an exercise to learn proper form, safety precautions, and get personalized workout guidance.
        </p>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="mb-2"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((exercise) => (
          <Card 
            key={exercise.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedExercise(exercise)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{exercise.name}</CardTitle>
                <Badge className={getDifficultyColor(exercise.difficulty)}>
                  {exercise.difficulty}
                </Badge>
              </div>
              <CardDescription>
                {exercise.category} • {exercise.equipment}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm">
                  <strong>Target:</strong> {exercise.targetMuscles.slice(0, 2).join(", ")}
                  {exercise.targetMuscles.length > 2 && ` +${exercise.targetMuscles.length - 2} more`}
                </div>
                <div className="text-sm text-muted-foreground">
                  {exercise.sets} sets • {exercise.reps} reps
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PersonalTrainer;
