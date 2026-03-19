import Image from 'next/image';
import PublicHeader from '@/components/layout/public-header';
import PublicFooter from '@/components/layout/public-footer';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Camera, Cpu, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const steps = [
  {
    icon: <Camera className="w-10 h-10 text-primary" />,
    title: '1. Snap a Photo',
    description: 'Use your phone or any camera to take a clear picture of the food waste. The clearer the image, the more accurate the analysis. You can upload images directly to your dashboard.',
    image: PlaceHolderImages.find((img) => img.id === 'how-it-works-1'),
  },
  {
    icon: <Cpu className="w-10 h-10 text-primary" />,
    title: '2. AI Analysis',
    description: 'Our powerful AI model gets to work instantly. It analyzes the image to identify different food types (like vegetables, grains, proteins) and estimates their weight and potential cost.',
    image: PlaceHolderImages.find((img) => img.id === 'how-it-works-2'),
  },
  {
    icon: <TrendingUp className="w-10 h-10 text-primary" />,
    title: '3. Act on Insights',
    description: 'Your dashboard visualizes the data with easy-to-read charts. Track trends, identify problem areas, and use our data-driven tips to reduce waste, adjust purchasing, and save money.',
    image: PlaceHolderImages.find((img) => img.id === 'how-it-works-3'),
  },
];

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PublicHeader />
      <main className="flex-grow">
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">From Wastage to Wisdom</h1>
              <p className="mt-4 text-lg md:text-xl text-muted-foreground">
                Learn how Food Wastage Detection in Restaurants transforms your kitchen's leftovers into valuable data with a simple, three-step process.
              </p>
            </div>
            <div className="mt-20 space-y-24">
              {steps.map((step, index) => (
                <div key={step.title} className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 !== 0 ? 'md:grid-flow-col-dense' : ''}`}>
                  <div className={`space-y-4 ${index % 2 !== 0 ? 'md:col-start-2' : ''}`}>
                    <div className="flex items-center gap-4">
                       <div className="bg-primary/10 rounded-lg p-3 w-fit">
                            {step.icon}
                        </div>
                        <h2 className="text-3xl font-bold font-headline">{step.title}</h2>
                    </div>
                    <p className="text-lg text-muted-foreground">{step.description}</p>
                  </div>
                  <div className={`relative h-80 rounded-2xl overflow-hidden shadow-xl ${index % 2 !== 0 ? 'md:col-start-1' : ''}`}>
                    {step.image && (
                      <Image
                        src={step.image.imageUrl}
                        alt={step.image.description}
                        fill
                        style={{ objectFit: 'cover' }}
                        data-ai-hint={step.image.imageHint}
                        className="transform hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
             <div className="text-center mt-24">
                <h2 className="text-3xl font-bold font-headline">Ready to Start?</h2>
                <p className="mt-2 text-lg text-muted-foreground">Begin your journey towards a more sustainable and profitable kitchen.</p>
                <Button asChild size="lg" className="mt-6">
                    <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
