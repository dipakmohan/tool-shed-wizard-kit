
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Stethoscope, 
  Activity, 
  Users, 
  FileText, 
  Calculator, 
  Heart, 
  Timer, 
  Clipboard,
  TrendingUp,
  AlertCircle,
  Target,
  BookOpen,
  Brain
} from 'lucide-react';

interface Assessment {
  category: string;
  tests: {
    name: string;
    description: string;
    procedure: string[];
    normalValues: string;
    interpretation: string[];
  }[];
}

interface Exercise {
  name: string;
  category: string;
  indications: string[];
  contraindications: string[];
  procedure: string[];
  progressions: string[];
  precautions: string[];
}

const assessmentTools: Assessment[] = [
  {
    category: "Range of Motion",
    tests: [
      {
        name: "Shoulder Flexion",
        description: "Measures forward elevation of the arm",
        procedure: [
          "Patient in supine or sitting position",
          "Place goniometer axis over lateral acromion",
          "Stationary arm parallel to lateral trunk",
          "Moving arm along lateral midline of humerus",
          "Move arm forward and upward to maximum range"
        ],
        normalValues: "0-180 degrees",
        interpretation: [
          "Normal: 150-180 degrees",
          "Mild limitation: 120-149 degrees", 
          "Moderate limitation: 90-119 degrees",
          "Severe limitation: <90 degrees"
        ]
      },
      {
        name: "Knee Flexion",
        description: "Measures bending of the knee joint",
        procedure: [
          "Patient in prone position",
          "Place goniometer axis over lateral femoral condyle",
          "Stationary arm along lateral femur",
          "Moving arm along lateral fibula",
          "Flex knee to maximum comfortable range"
        ],
        normalValues: "0-135 degrees",
        interpretation: [
          "Normal: 120-135 degrees",
          "Mild limitation: 100-119 degrees",
          "Moderate limitation: 75-99 degrees", 
          "Severe limitation: <75 degrees"
        ]
      }
    ]
  },
  {
    category: "Muscle Strength",
    tests: [
      {
        name: "Manual Muscle Testing (MMT)",
        description: "Grades muscle strength on a 0-5 scale",
        procedure: [
          "Position patient to isolate target muscle",
          "Demonstrate the movement first",
          "Have patient perform movement without resistance",
          "Apply manual resistance in opposite direction",
          "Grade based on patient's ability to hold position"
        ],
        normalValues: "Grade 5 (Normal)",
        interpretation: [
          "Grade 5: Normal - Complete ROM against gravity with full resistance",
          "Grade 4: Good - Complete ROM against gravity with some resistance",
          "Grade 3: Fair - Complete ROM against gravity only",
          "Grade 2: Poor - Complete ROM with gravity eliminated",
          "Grade 1: Trace - Evidence of slight muscle contraction",
          "Grade 0: Zero - No evidence of muscle contraction"
        ]
      }
    ]
  },
  {
    category: "Balance Assessment",
    tests: [
      {
        name: "Berg Balance Scale",
        description: "14-item scale measuring functional balance",
        procedure: [
          "Sitting to standing transition",
          "Standing unsupported",
          "Sitting unsupported",
          "Standing to sitting",
          "Transfers between chairs",
          "Standing with eyes closed",
          "Standing with feet together",
          "Reaching forward with outstretched arm",
          "Retrieving object from floor",
          "Turning to look behind",
          "Turning 360 degrees",
          "Placing alternate foot on stool",
          "Standing with one foot in front",
          "Standing on one foot"
        ],
        normalValues: "45-56 points",
        interpretation: [
          "45-56: Low fall risk",
          "36-44: Medium fall risk",
          "0-35: High fall risk"
        ]
      }
    ]
  }
];

const exerciseLibrary: Exercise[] = [
  {
    name: "Ankle Pumps",
    category: "Cardiovascular/Circulation",
    indications: [
      "Post-operative circulation improvement",
      "DVT prevention",
      "Edema reduction",
      "Bed-bound patients"
    ],
    contraindications: [
      "Acute fracture of ankle/foot",
      "Severe pain with movement",
      "Recent surgery on ankle/foot"
    ],
    procedure: [
      "Patient in supine or sitting position",
      "Point toes away from body (plantarflexion)",
      "Pull toes back toward shin (dorsiflexion)",
      "Hold for 3 seconds in each direction",
      "Repeat 10-20 times every hour while awake"
    ],
    progressions: [
      "Add resistance with elastic band",
      "Perform in standing position",
      "Add alphabet drawing with foot"
    ],
    precautions: [
      "Stop if pain increases",
      "Monitor for signs of DVT",
      "Ensure proper positioning"
    ]
  },
  {
    name: "Diaphragmatic Breathing",
    category: "Respiratory",
    indications: [
      "Post-operative lung expansion",
      "Chronic obstructive pulmonary disease",
      "Anxiety and stress management",
      "Core stabilization training"
    ],
    contraindications: [
      "Unstable chest injuries",
      "Severe respiratory distress",
      "Recent abdominal surgery (relative)"
    ],
    procedure: [
      "Patient in comfortable position (sitting or supine)",
      "One hand on chest, one hand on abdomen",
      "Breathe in slowly through nose",
      "Abdomen should rise more than chest",
      "Exhale slowly through pursed lips",
      "Repeat for 5-10 minutes"
    ],
    progressions: [
      "Add counting during breaths",
      "Progress to standing position",
      "Combine with gentle exercises"
    ],
    precautions: [
      "Don't force breathing pattern",
      "Stop if dizzy or lightheaded",
      "Keep breathing comfortable and natural"
    ]
  },
  {
    name: "Quadriceps Setting",
    category: "Strengthening",
    indications: [
      "Post-knee surgery",
      "Quadriceps weakness",
      "Knee instability",
      "Patellofemoral pain syndrome"
    ],
    contraindications: [
      "Acute knee injury with significant swelling",
      "Recent patellar fracture",
      "Severe pain with muscle contraction"
    ],
    procedure: [
      "Patient lying supine with leg straight",
      "Tighten thigh muscle by pushing knee down into surface",
      "Lift heel slightly off surface",
      "Hold contraction for 5-10 seconds",
      "Relax and repeat 10-15 times"
    ],
    progressions: [
      "Increase hold time to 10-15 seconds",
      "Add ankle weights",
      "Progress to straight leg raises"
    ],
    precautions: [
      "Don't hold breath during exercise",
      "Stop if pain increases",
      "Ensure proper leg alignment"
    ]
  }
];

const PhysiotherapyTools = () => {
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    diagnosis: '',
    goals: '',
    precautions: ''
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Physiotherapy Tools
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Essential tools for beginner physiotherapists to provide evidence-based, safe, and effective patient care in hospitals and clinics.
        </p>
      </div>

      <Tabs defaultValue="assessments" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="assessments" className="flex items-center gap-2">
            <Clipboard className="h-4 w-4" />
            Assessments
          </TabsTrigger>
          <TabsTrigger value="exercises" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Exercises
          </TabsTrigger>
          <TabsTrigger value="treatment-planning" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Treatment Plans
          </TabsTrigger>
          <TabsTrigger value="progress-tracking" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Education
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assessments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Stethoscope className="h-6 w-6" />
                Assessment Tools
              </h2>
              <div className="space-y-3">
                {assessmentTools.map((category, categoryIndex) => (
                  <Card key={categoryIndex}>
                    <CardHeader>
                      <CardTitle className="text-lg">{category.category}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {category.tests.map((test, testIndex) => (
                        <Button
                          key={testIndex}
                          variant={selectedAssessment?.name === test.name ? "default" : "outline"}
                          className="w-full justify-start"
                          onClick={() => setSelectedAssessment(test)}
                        >
                          {test.name}
                        </Button>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {selectedAssessment ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>{selectedAssessment.name}</CardTitle>
                      <p className="text-muted-foreground">{selectedAssessment.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Procedure:</h4>
                          <ol className="list-decimal list-inside space-y-1">
                            {selectedAssessment.procedure.map((step, index) => (
                              <li key={index} className="text-sm">{step}</li>
                            ))}
                          </ol>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Normal Values:</h4>
                          <Badge variant="secondary">{selectedAssessment.normalValues}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5" />
                        Interpretation Guidelines
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedAssessment.interpretation.map((item, index) => (
                          <li key={index} className="flex gap-2">
                            <span className="text-blue-500">•</span>
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="h-96 flex items-center justify-center">
                  <CardContent className="text-center">
                    <Clipboard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Select an Assessment</h3>
                    <p className="text-muted-foreground">
                      Choose an assessment tool to see detailed procedures and interpretation guidelines.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="exercises" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Activity className="h-6 w-6" />
                Exercise Library
              </h2>
              <div className="space-y-3">
                {exerciseLibrary.map((exercise, index) => (
                  <Card 
                    key={index}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedExercise?.name === exercise.name ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedExercise(exercise)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{exercise.name}</h3>
                        <Badge variant="outline">{exercise.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {exercise.indications.slice(0, 2).join(', ')}
                        {exercise.indications.length > 2 && '...'}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {selectedExercise ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>{selectedExercise.name}</CardTitle>
                      <Badge>{selectedExercise.category}</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2 text-green-600">Indications:</h4>
                          <ul className="space-y-1">
                            {selectedExercise.indications.map((indication, index) => (
                              <li key={index} className="text-sm flex gap-2">
                                <span className="text-green-500">✓</span>
                                {indication}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2 text-red-600">Contraindications:</h4>
                          <ul className="space-y-1">
                            {selectedExercise.contraindications.map((contraindication, index) => (
                              <li key={index} className="text-sm flex gap-2">
                                <span className="text-red-500">✗</span>
                                {contraindication}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Procedure</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ol className="list-decimal list-inside space-y-2">
                        {selectedExercise.procedure.map((step, index) => (
                          <li key={index} className="text-sm">{step}</li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Progressions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedExercise.progressions.map((progression, index) => (
                          <li key={index} className="text-sm flex gap-2">
                            <span className="text-blue-500">→</span>
                            {progression}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-amber-600">
                        <AlertCircle className="h-5 w-5" />
                        Precautions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedExercise.precautions.map((precaution, index) => (
                          <li key={index} className="text-sm flex gap-2">
                            <span className="text-amber-500">⚠</span>
                            {precaution}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="h-96 flex items-center justify-center">
                  <CardContent className="text-center">
                    <Activity className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Select an Exercise</h3>
                    <p className="text-muted-foreground">
                      Choose an exercise to see detailed instructions, indications, and precautions.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="treatment-planning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6" />
                Treatment Plan Generator
              </CardTitle>
              <p className="text-muted-foreground">
                Create evidence-based treatment plans for your patients
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input
                    id="patientName"
                    value={patientData.name}
                    onChange={(e) => setPatientData({...patientData, name: e.target.value})}
                    placeholder="Enter patient name"
                  />
                </div>
                <div>
                  <Label htmlFor="patientAge">Age</Label>
                  <Input
                    id="patientAge"
                    type="number"
                    value={patientData.age}
                    onChange={(e) => setPatientData({...patientData, age: e.target.value})}
                    placeholder="Enter age"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="diagnosis">Primary Diagnosis</Label>
                <Select onValueChange={(value) => setPatientData({...patientData, diagnosis: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select diagnosis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stroke">Stroke/CVA</SelectItem>
                    <SelectItem value="knee-replacement">Total Knee Replacement</SelectItem>
                    <SelectItem value="hip-replacement">Total Hip Replacement</SelectItem>
                    <SelectItem value="back-pain">Lower Back Pain</SelectItem>
                    <SelectItem value="shoulder-impingement">Shoulder Impingement</SelectItem>
                    <SelectItem value="copd">COPD</SelectItem>
                    <SelectItem value="fracture">Fracture</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="goals">Treatment Goals</Label>
                <Textarea
                  id="goals"
                  value={patientData.goals}
                  onChange={(e) => setPatientData({...patientData, goals: e.target.value})}
                  placeholder="Enter SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound)"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="precautions">Precautions/Contraindications</Label>
                <Textarea
                  id="precautions"
                  value={patientData.precautions}
                  onChange={(e) => setPatientData({...patientData, precautions: e.target.value})}
                  placeholder="List any precautions, contraindications, or special considerations"
                  rows={2}
                />
              </div>

              <Button className="w-full">
                Generate Treatment Plan
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Evidence-Based Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Follow current best practice guidelines</li>
                  <li>• Set SMART goals with patient involvement</li>
                  <li>• Regular reassessment every 2-3 sessions</li>
                  <li>• Document objective measurements</li>
                  <li>• Consider patient's psychosocial factors</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Safety Reminders</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Always check vital signs if indicated</li>
                  <li>• Review medical precautions before each session</li>
                  <li>• Monitor pain levels throughout treatment</li>
                  <li>• Ensure proper emergency procedures knowledge</li>
                  <li>• Maintain professional boundaries</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress-tracking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                Progress Tracking Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Calculator className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Outcome Measures</h3>
                    <p className="text-sm text-muted-foreground">Standardized assessment tools for tracking progress</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <FileText className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Progress Notes</h3>
                    <p className="text-sm text-muted-foreground">Structured documentation templates</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Timer className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Goal Tracking</h3>
                    <p className="text-sm text-muted-foreground">Monitor achievement of treatment goals</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Common Outcome Measures</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold">Functional Independence Measure (FIM)</h4>
                  <p className="text-sm text-muted-foreground">18-item scale measuring physical and cognitive disability</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold">Berg Balance Scale</h4>
                  <p className="text-sm text-muted-foreground">14-item scale for assessing balance in older adults</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold">6-Minute Walk Test</h4>
                  <p className="text-sm text-muted-foreground">Measures functional exercise capacity</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold">Visual Analog Scale (VAS)</h4>
                  <p className="text-sm text-muted-foreground">0-10 scale for measuring pain intensity</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Documentation Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="text-blue-500">•</span>
                    Use objective, measurable language
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-500">•</span>
                    Include specific numbers and measurements
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-500">•</span>
                    Document patient's subjective reports
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-500">•</span>
                    Note any adverse reactions or concerns
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-500">•</span>
                    Update goals based on progress
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-500">•</span>
                    Use SOAP note format when required
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="education" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-6 w-6" />
                Patient Education Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Pain Management</h3>
                    <p className="text-sm text-muted-foreground">Education about pain science and management strategies</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Activity className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Exercise Programs</h3>
                    <p className="text-sm text-muted-foreground">Home exercise programs with clear instructions</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Lifestyle Modifications</h3>
                    <p className="text-sm text-muted-foreground">Guidance on activity modification and ergonomics</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Education Topics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-600">Pain Education</h4>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• Understanding acute vs chronic pain</li>
                    <li>• Pain does not always equal tissue damage</li>
                    <li>• Importance of staying active</li>
                    <li>• When to seek medical attention</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-600">Movement & Exercise</h4>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• Proper body mechanics</li>
                    <li>• Progressive exercise principles</li>
                    <li>• Importance of consistency</li>
                    <li>• Signs to stop exercising</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-600">Prevention</h4>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• Fall prevention strategies</li>
                    <li>• Ergonomic principles</li>
                    <li>• Activity pacing</li>
                    <li>• Warning signs to watch for</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Professional Development</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-semibold">Essential Skills for New Grads</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Effective communication with patients</li>
                    <li>• Clinical reasoning and decision making</li>
                    <li>• Time management in clinical settings</li>
                    <li>• Interprofessional collaboration</li>
                    <li>• Evidence-based practice integration</li>
                    <li>• Professional boundaries and ethics</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Continuing Education</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Stay updated with current research</li>
                    <li>• Attend professional conferences</li>
                    <li>• Join professional associations</li>
                    <li>• Pursue specialty certifications</li>
                    <li>• Engage in peer learning opportunities</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PhysiotherapyTools;
