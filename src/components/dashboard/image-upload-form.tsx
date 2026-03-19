'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Loader2, Camera, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { analyzeUploadedFoodImage } from '@/ai/flows/analyze-uploaded-food-image';
import type { WasteData } from '@/lib/types';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ImageUploadFormProps {
  onWasteAdd: (entry: Omit<WasteData, 'id' | 'timestamp' | 'imageUrl'> & { imageUrl: string }) => void;
}

export default function ImageUploadForm({ onWasteAdd }: ImageUploadFormProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [activeTab, setActiveTab] = useState('upload');
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraLoading, setIsCameraLoading] = useState(true);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string | undefined>(undefined);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { toast } = useToast();
  
  useEffect(() => {
    let stream: MediaStream | null = null;
  
    const enableCamera = async () => {
      if (activeTab !== 'camera') {
        return;
      }
      
      setIsCameraLoading(true);
      setHasCameraPermission(null);

      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('Camera not supported by this browser.');
        }

        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(d => d.kind === 'videoinput');
        setCameras(videoDevices);
        if(videoDevices.length > 0 && !selectedCameraId) {
            setSelectedCameraId(videoDevices[0].deviceId);
        }

        const constraints: MediaStreamConstraints = {
            video: selectedCameraId ? { deviceId: { exact: selectedCameraId } } : true,
        };

        stream = await navigator.mediaDevices.getUserMedia(constraints);
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        let description = 'Please enable camera permissions in your browser settings to use this app.';
        if(error instanceof Error && error.message.includes('not supported')) {
            description = error.message;
        }
        toast({
          variant: 'destructive',
          title: 'Camera Access Error',
          description,
        });
      } finally {
        setIsCameraLoading(false);
      }
    };
  
    enableCamera();
  
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [activeTab, selectedCameraId, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUri = canvas.toDataURL('image/jpeg');
        setPreview(dataUri);
        setFileName('capture.jpg');
        setActiveTab('upload'); // Switch to preview
      }
    }
  };

  const handleAnalyzeClick = async () => {
    if (!preview) {
      toast({
        title: 'No image available',
        description: 'Please upload or capture an image to analyze.',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeUploadedFoodImage({ foodImageDataUri: preview });
      onWasteAdd({ ...result.foodWasteAnalysis, imageUrl: preview });
      toast({
        title: 'Analysis Complete',
        description: `Identified ${result.foodWasteAnalysis.foodType} (${result.foodWasteAnalysis.estimatedQuantity}).`,
      });
      // Reset form
      setPreview(null);
      setFileName('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Could not analyze the image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetPreview = () => {
      setPreview(null);
      setFileName('');
       if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
  }

  const handleSwitchCamera = () => {
    if (cameras.length > 1) {
        const currentIndex = cameras.findIndex(c => c.deviceId === selectedCameraId);
        const nextIndex = (currentIndex + 1) % cameras.length;
        setSelectedCameraId(cameras[nextIndex].deviceId);
    }
  };
  
  const handleTabChange = (value: string) => {
    resetPreview();
    setActiveTab(value);
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Log New Waste</CardTitle>
        <CardDescription>Upload a photo of leftover food to analyze and log it.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Image</TabsTrigger>
            <TabsTrigger value="camera">Use Camera</TabsTrigger>
          </TabsList>
          <TabsContent value="upload">
             <div
              className="relative flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 mt-4 overflow-hidden"
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <Image src={preview} alt="Preview" fill style={{ objectFit: 'cover' }} className="rounded-lg" />
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <Upload className="w-8 h-8" />
                  <p className="mt-2 text-sm">Click or drag to upload</p>
                </div>
              )}
              <Input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
                disabled={isAnalyzing}
              />
            </div>
            {fileName && <p className="text-sm text-center text-muted-foreground mt-2">{fileName}</p>}
          </TabsContent>
          <TabsContent value="camera">
            <div className="relative w-full aspect-video mt-4 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
              <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline onLoadedData={() => setIsCameraLoading(false)} />
               {cameras.length > 1 && hasCameraPermission && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSwitchCamera}
                    className="absolute top-2 right-2 z-10 bg-background/50 hover:bg-background/75"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                )}
              {activeTab === 'camera' && isCameraLoading && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/80 text-muted-foreground">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <p className="mt-2 text-sm">Starting camera...</p>
                 </div>
              )}
              {hasCameraPermission === false && (
                 <Alert variant="destructive" className="m-4 absolute inset-0">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Camera Access Denied</AlertTitle>
                    <AlertDescription>
                        Please allow camera access in your browser settings.
                    </AlertDescription>
                </Alert>
              )}
            </div>
             <canvas ref={canvasRef} className="hidden" />
             <Button onClick={handleCapture} disabled={!hasCameraPermission || isCameraLoading} className="w-full mt-4">
                <Camera className="mr-2 h-4 w-4" />
                Capture Photo
            </Button>
          </TabsContent>
        </Tabs>
        
        <Button onClick={handleAnalyzeClick} disabled={isAnalyzing || !preview} className="w-full">
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze Waste'
          )}
        </Button>
        {preview && (
             <Button onClick={resetPreview} variant="outline" className="w-full">
                Clear Selection
            </Button>
        )}
      </CardContent>
    </Card>
  );
}
