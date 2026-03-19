import PublicHeader from '@/components/layout/public-header';
import PublicFooter from '@/components/layout/public-footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Utensils, ShoppingBasket, Refrigerator, Users, Lightbulb } from 'lucide-react';

const tips = [
  {
    category: 'Portion Control',
    icon: <Utensils className="w-6 h-6 text-primary" />,
    items: [
      "Analyze sales data to identify less popular dishes and consider reducing their portion size or removing them.",
      "Offer different portion sizes for popular dishes (e.g., small, regular, large).",
      "Use standardized utensils for serving to ensure consistent portioning.",
      "Train kitchen staff on the importance of portion control and how to measure ingredients accurately."
    ],
  },
  {
    category: 'Inventory Management',
    icon: <ShoppingBasket className="w-6 h-6 text-primary" />,
    items: [
      "Implement a 'First-In, First-Out' (FIFO) system for all stored food.",
      "Conduct regular inventory checks to avoid over-purchasing.",
      "Build strong relationships with suppliers for more flexible ordering.",
      "Use waste tracking data to inform purchasing decisions."
    ],
  },
  {
    category: 'Food Storage',
    icon: <Refrigerator className="w-6 h-6 text-primary" />,
    items: [
      "Ensure refrigerators and freezers are at the correct temperatures.",
      "Use clear, airtight containers to store food, and label them with the date of storage.",
      "Store vegetables and fruits in appropriate conditions to prolong freshness.",
      "Separate ethylene-producing fruits (like bananas and apples) from ethylene-sensitive produce."
    ],
  },
  {
    category: 'Staff Engagement',
    icon: <Users className="w-6 h-6 text-primary" />,
    items: [
      "Educate staff about the cost of food waste and its environmental impact.",
      "Involve staff in waste reduction brainstorming sessions.",
      "Create a 'waste wall of shame' or 'waste hero of the week' to build awareness.",
      "Offer incentives for teams that meet waste reduction targets."
    ],
  },
  {
    category: 'Menu & Preperation',
    icon: <Lightbulb className="w-6 h-6 text-primary" />,
    items: [
      "Repurpose ingredients. For example, use vegetable scraps to make stock.",
      "Run daily or weekly specials to use up ingredients that are close to their expiration date.",
      "Design your menu to cross-utilize ingredients across multiple dishes.",
      "Prep ingredients in smaller batches more frequently, rather than large batches at once."
    ],
  },
];

export default function TipsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PublicHeader />
      <main className="flex-grow">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Tips to Reduce Waste</h1>
              <p className="mt-4 text-lg md:text-xl text-muted-foreground">
                Discover practical and effective strategies to minimize food waste in your restaurant, save money, and boost your sustainability.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tips.map((tipCategory) => (
                <Card key={tipCategory.category} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      {tipCategory.icon}
                    </div>
                    <CardTitle className="font-headline">{tipCategory.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 list-disc list-inside text-muted-foreground">
                      {tipCategory.items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
