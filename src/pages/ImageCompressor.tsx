
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ImageCompressor = () => {
  return (
    <div className="animate-fade-in text-center">
      <h1 className="text-3xl font-bold mb-2">Image Compressor</h1>
      <p className="text-muted-foreground mb-8">This tool is coming soon!</p>
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Under Construction</CardTitle>
          <CardDescription>We're working hard to bring you an amazing image compression tool. Stay tuned!</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <a href="/">Back to Home</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageCompressor;
