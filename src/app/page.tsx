'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BarChart, Bot, Cpu, Leaf, Recycle, ShieldCheck } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PublicHeader from '@/components/layout/public-header';
import PublicFooter from '@/components/layout/public-footer';
import { motion } from 'motion/react';

const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-image');
const featureImage1 = PlaceHolderImages.find((img) => img.id === 'feature-1');
const featureImage2 = PlaceHolderImages.find((img) => img.id === 'feature-2');

const features = [
  {
    icon: <Bot className="w-8 h-8 text-primary" />,
    title: 'AI-Powered Analysis',
    description: 'Upload images of food waste and let our AI identify food types and quantities automatically.',
  },
  {
    icon: <BarChart className="w-8 h-8 text-primary" />,
    title: 'Insightful Dashboard',
    description: 'Visualize your waste data with interactive charts and track your progress over time.',
  },
  {
    icon: <Recycle className="w-8 h-8 text-primary" />,
    title: 'Actionable Tips',
    description: 'Receive personalized, data-driven tips to effectively reduce your food waste and save money.',
  },
  {
    icon: <Leaf className="w-8 h-8 text-primary" />,
    title: 'Boost Sustainability',
    description: 'Enhance your restaurant\'s brand image by showcasing your commitment to sustainability.',
  },
];

const testimonials = [
  {
    name: 'Chef Maria Garcia',
    title: 'Head Chef, The Green Leaf Bistro',
    quote: 'This tool has transformed our kitchen. We\'ve cut our food waste by 30% in just two months! The dashboard is incredibly intuitive and provides insights we never had before.',
    avatar: 'https://images.unsplash.com/photo-1583394293214-28dea15ee548?q=80&w=100&h=100&auto=format&fit=crop',
  },
  {
    name: 'John Peterson',
    title: 'Owner, Urban Eatery',
    quote: 'Implementing this tool was a game-changer for our profitability and sustainability goals. It’s simple to use and the impact is immediate. Highly recommended!',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&h=100&auto=format&fit=crop',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-grow overflow-hidden">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-background overflow-hidden">
          {/* Subtle Animated Background */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Animated Dot Pattern */}
            <motion.div 
              animate={{ backgroundPosition: ['0px 0px', '24px 24px'] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08]"
              style={{ backgroundImage: 'radial-gradient(circle at center, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }}
            />
            
            {/* Glowing Gradient Mesh Orbs */}
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                x: [0, 100, 0],
                y: [0, 50, 0],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-40 -left-40 w-[30rem] h-[30rem] bg-primary/20 rounded-full blur-[100px] opacity-60"
            />
            <motion.div
              animate={{ 
                scale: [1, 1.5, 1],
                x: [0, -100, 0],
                y: [0, -50, 0],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute top-1/4 -right-20 w-[35rem] h-[35rem] bg-blue-500/10 rounded-full blur-[100px] opacity-60"
            />
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                x: [0, 50, 0],
                y: [0, 100, 0],
              }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
              className="absolute -bottom-40 left-1/3 w-[25rem] h-[25rem] bg-green-500/10 rounded-full blur-[100px] opacity-60"
            />
          </div>

          <div className="container relative z-10 mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 text-center md:text-left"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary font-headline capitalize">
                food wastage detection in restaurants
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Food Wastage Detection in Restaurants helps your restaurant reduce wastage, cut costs, and improve sustainability with powerful AI analysis.
              </p>
              <div className="flex justify-center md:justify-start gap-4">
                <Button asChild size="lg">
                  <Link href="/dashboard">
                    Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/how-it-works">How It Works</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-2xl"
            >
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  fill
                  style={{ objectFit: 'cover' }}
                  data-ai-hint={heroImage.imageHint}
                  className="transform hover:scale-105 transition-transform duration-700"
                  priority
                  unoptimized={heroImage.imageUrl.includes('bizbuysell.com')}
                />
              )}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-secondary/50">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Why Choose Food Wastage Detection in Restaurants?</h2>
              <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                Our platform provides everything you need to take control of your kitchen's waste.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <Card className="text-center border-2 border-transparent shadow-lg hover:shadow-xl hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 bg-card h-full group">
                    <CardHeader>
                      <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit group-hover:bg-primary/20 transition-colors">
                        {feature.icon}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h3 className="text-xl font-bold mb-2 font-headline group-hover:text-primary transition-colors">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works simplified */}
        <section className="py-20 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div 
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                      className="relative h-80 rounded-2xl overflow-hidden shadow-xl"
                    >
                        {featureImage1 &&
                            <Image src={featureImage1.imageUrl} alt={featureImage1.description} fill style={{objectFit: 'cover'}} data-ai-hint={featureImage1.imageHint} unoptimized={featureImage1.imageUrl.includes('logmeal.com')}/>
                        }
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                      className="space-y-4"
                    >
                        <h3 className="text-3xl font-bold font-headline">From Photo to Profit in 3 Simple Steps</h3>
                        <p className="text-muted-foreground text-lg">See how easy it is to start reducing waste.</p>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-4">
                                <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center font-bold flex-shrink-0">1</div>
                                <div>
                                    <h4 className="font-semibold">Snap a Photo</h4>
                                    <p className="text-muted-foreground">Quickly capture an image of your food waste before disposal.</p>
                                </div>
                            </li>
                             <li className="flex items-start gap-4">
                                <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center font-bold flex-shrink-0">2</div>
                                <div>
                                    <h4 className="font-semibold">Get AI Analysis</h4>
                                    <p className="text-muted-foreground">Our AI instantly identifies food types and estimates waste volume and cost.</p>
                                </div>
                            </li>
                             <li className="flex items-start gap-4">
                                <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center font-bold flex-shrink-0">3</div>
                                <div>
                                    <h4 className="font-semibold">Take Action</h4>
                                    <p className="text-muted-foreground">Use the insights from your dashboard to make smarter purchasing and prep decisions.</p>
                                </div>
                            </li>
                        </ul>
                    </motion.div>
                </div>
                 <div className="grid md:grid-cols-2 gap-12 items-center mt-20">
                    <motion.div 
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                      className="space-y-4 text-left order-2 md:order-1"
                    >
                        <h3 className="text-3xl font-bold font-headline">Unlock Powerful Insights</h3>
                        <p className="text-muted-foreground text-lg">Our dashboard transforms your data into actionable intelligence.</p>
                         <ul className="space-y-4 text-muted-foreground">
                            <li className="flex items-start gap-3">
                               <ShieldCheck className="w-5 h-5 text-primary mt-1" />
                                <span>Track waste trends daily, weekly, and monthly to spot patterns.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <ShieldCheck className="w-5 h-5 text-primary mt-1" />
                                <span>Identify your most wasted food items and their cost impact.</span>
                            </li>
                            <li className="flex items-start gap-3">
                               <ShieldCheck className="w-5 h-5 text-primary mt-1" />
                               <span>Get smart recommendations to optimize inventory and reduce over-prepping.</span>
                            </li>
                        </ul>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                      className="relative h-80 rounded-2xl overflow-hidden shadow-xl order-1 md:order-2"
                    >
                        {featureImage2 &&
                            <Image src={featureImage2.imageUrl} alt={featureImage2.description} fill style={{objectFit: 'cover'}} data-ai-hint={featureImage2.imageHint} unoptimized={featureImage2.imageUrl.includes('lens.usercontent.google.com')}/>
                        }
                    </motion.div>
                </div>
            </div>
        </section>


        {/* Testimonials Section */}
        <section className="py-20 bg-secondary/50">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Loved by Restaurants Like Yours</h2>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="bg-card shadow-lg h-full border-2 border-transparent hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 group">
                    <CardContent className="pt-6">
                      <p className="italic text-muted-foreground mb-4">"{testimonial.quote}"</p>
                      <div className="flex items-center">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="ml-4">
                          <p className="font-bold group-hover:text-primary transition-colors">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Ready to Reduce Your Food Wastage?</h2>
            <p className="text-lg text-muted-foreground mt-2 mb-6 max-w-xl mx-auto">
              Join the growing number of restaurants making a difference. Start your journey with Food Wastage Detection in Restaurants today.
            </p>
            <Button asChild size="lg" className="hover:scale-105 transition-transform">
              <Link href="/dashboard">
                Try The Dashboard Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
