
import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Scan, Download, RotateCcw, Zap, BookOpen, Calculator, MapPin, Car, Leaf } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AnalysisResult {
  category: string;
  title: string;
  description: string;
  details: string[];
  confidence: number;
}

const CameraScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  }, []);

  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageData);
      stopCamera();
    }
  }, [stopCamera]);

  const analyzeImage = useCallback(async () => {
    if (!capturedImage) return;

    setIsAnalyzing(true);
    
    // Simulate AI analysis with realistic results
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockAnalyses: AnalysisResult[] = [
      {
        category: "Mathematics",
        title: "Quadratic Equation",
        description: "Mathematical expression detected",
        details: [
          "This appears to be a quadratic equation in the form ax² + bx + c = 0",
          "To solve: Use the quadratic formula x = (-b ± √(b²-4ac)) / 2a",
          "Step-by-step solution available",
          "Graph shows parabolic curve opening upward"
        ],
        confidence: 92
      },
      {
        category: "Biology",
        title: "Plant Cell Structure",
        description: "Botanical specimen identified",
        details: [
          "Cell wall and chloroplasts visible",
          "Appears to be from a dicotyledonous plant",
          "Stomata present for gas exchange",
          "Cellular respiration and photosynthesis occur here"
        ],
        confidence: 88
      },
      {
        category: "Geography",
        title: "Mountain Landscape",
        description: "Geological formation detected",
        details: [
          "Sedimentary rock layers visible",
          "Elevation approximately 2000-3000 meters",
          "Alpine climate zone characteristics",
          "Evidence of glacial erosion patterns"
        ],
        confidence: 85
      },
      {
        category: "Automotive",
        title: "Vehicle Identification",
        description: "Car model and specs detected",
        details: [
          "Make: Toyota, Model: Camry (2020-2023)",
          "Engine: 2.5L 4-cylinder hybrid",
          "Fuel efficiency: 28 city / 39 highway MPG",
          "Safety rating: 5-star NHTSA"
        ],
        confidence: 94
      }
    ];

    const randomResult = mockAnalyses[Math.floor(Math.random() * mockAnalyses.length)];
    setAnalysisResult(randomResult);
    setIsAnalyzing(false);
    
    toast({
      title: "Analysis Complete",
      description: `Detected: ${randomResult.title}`,
    });
  }, [capturedImage, toast]);

  const reset = useCallback(() => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
  }, []);

  const downloadImage = useCallback(() => {
    if (!capturedImage) return;
    
    const link = document.createElement('a');
    link.href = capturedImage;
    link.download = 'scanned-image.jpg';
    link.click();
  }, [capturedImage]);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'mathematics': return <Calculator className="h-5 w-5" />;
      case 'biology': return <Leaf className="h-5 w-5" />;
      case 'geography': return <MapPin className="h-5 w-5" />;
      case 'automotive': return <Car className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'mathematics': return 'bg-blue-500';
      case 'biology': return 'bg-green-500';
      case 'geography': return 'bg-purple-500';
      case 'automotive': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-blue-600 via-green-500 to-purple-600 bg-clip-text text-transparent">
          Smart Camera Scanner
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Scan anything with your camera and get instant AI-powered insights about math, science, places, vehicles, and more.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Camera Section */}
        <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Camera className="h-6 w-6 text-primary" />
              Camera Scanner
            </CardTitle>
            <CardDescription>
              Point your camera at any object to analyze it
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative bg-muted rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
              {isScanning ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : capturedImage ? (
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Scan className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">Ready to scan</p>
                  </div>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="flex gap-2 justify-center">
              {!isScanning && !capturedImage && (
                <Button onClick={startCamera} className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
                  <Camera className="h-4 w-4 mr-2" />
                  Start Camera
                </Button>
              )}
              
              {isScanning && (
                <>
                  <Button onClick={captureImage} className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                    <Scan className="h-4 w-4 mr-2" />
                    Capture
                  </Button>
                  <Button variant="outline" onClick={stopCamera}>
                    Cancel
                  </Button>
                </>
              )}

              {capturedImage && !isAnalyzing && (
                <>
                  <Button onClick={analyzeImage} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    <Zap className="h-4 w-4 mr-2" />
                    Analyze
                  </Button>
                  <Button variant="outline" onClick={downloadImage}>
                    <Download className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={reset}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </>
              )}

              {isAnalyzing && (
                <Button disabled className="bg-gradient-to-r from-orange-500 to-red-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Analyzing...
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-yellow-500" />
              Analysis Results
            </CardTitle>
            <CardDescription>
              AI-powered insights about your scanned content
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!analysisResult ? (
              <div className="text-center py-12 space-y-4">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">
                  Scan an object to see detailed analysis and insights
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">Math</Badge>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Biology</Badge>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">Geography</Badge>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">Automotive</Badge>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${getCategoryColor(analysisResult.category)} text-white`}>
                    {getCategoryIcon(analysisResult.category)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{analysisResult.title}</h3>
                    <p className="text-muted-foreground text-sm">{analysisResult.description}</p>
                  </div>
                  <Badge variant="secondary" className="ml-auto">
                    {analysisResult.confidence}% confident
                  </Badge>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Key Insights
                  </h4>
                  <ul className="space-y-2">
                    {analysisResult.details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t">
                  <Badge variant="outline" className={`${getCategoryColor(analysisResult.category)} text-white border-0`}>
                    {analysisResult.category}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Feature highlights */}
      <Card className="bg-gradient-to-r from-blue-50 via-green-50 to-purple-50 border-0">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <Calculator className="h-8 w-8 text-blue-500 mx-auto" />
              <p className="text-sm font-medium">Math Problems</p>
            </div>
            <div className="space-y-2">
              <Leaf className="h-8 w-8 text-green-500 mx-auto" />
              <p className="text-sm font-medium">Plant Biology</p>
            </div>
            <div className="space-y-2">
              <MapPin className="h-8 w-8 text-purple-500 mx-auto" />
              <p className="text-sm font-medium">Landmarks</p>
            </div>
            <div className="space-y-2">
              <Car className="h-8 w-8 text-orange-500 mx-auto" />
              <p className="text-sm font-medium">Vehicles</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CameraScanner;
