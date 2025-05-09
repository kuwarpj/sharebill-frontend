
"use client";
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, BarChart, ShieldCheck, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <Users className="h-10 w-10 text-primary mb-4" />,
    title: "Easy Group Creation",
    description: "Quickly create groups for trips, roommates, or any shared expenses.",
    imageHint: "team collaboration"
  },
  {
    icon: <CreditCard className="h-10 w-10 text-primary mb-4" />,
    title: "Track Shared Bills",
    description: "Log expenses and see who paid what, ensuring transparency.",
    imageHint: "receipt bill"
  },
  {
    icon: <BarChart className="h-10 w-10 text-primary mb-4" />,
    title: "Clear Balances",
    description: "Instantly know who owes whom, making settlements straightforward.",
    imageHint: "finance chart"
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-primary mb-4" />,
    title: "Secure & Private",
    description: "Your financial data is kept secure and private within your groups.",
    imageHint: "security lock"
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i:number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};


export default function LandingPageContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden"> {/* Added overflow-x-hidden */}
      {/* Hero Section */}
      <motion.section 
        className="py-16 sm:py-24 bg-gradient-to-br from-background to-muted/30"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Share Bills, Not Headaches.
            </motion.h1>
            <motion.p 
              className="text-lg sm:text-xl text-muted-foreground mb-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              ShareBill makes splitting expenses with friends, family, and colleagues simple and stress-free.
              Track who paid, who owes, and settle up with ease.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row justify-center items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-shadow w-full sm:w-auto">
                <Link href="/signup">Get Started for Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="shadow-md hover:shadow-lg transition-shadow w-full sm:w-auto">
                <Link href="/login">I already have an account</Link>
              </Button>
            </motion.div>
          </div>
          <motion.div 
            className="mt-12 sm:mt-16 max-w-4xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <Image
              src="https://picsum.photos/seed/landing-hero/1200/600"
              alt="ShareBill application mockup"
              width={1200}
              height={600}
              className="rounded-xl shadow-2xl object-cover"
              priority
              data-ai-hint="app interface finance"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        id="features" 
        className="py-16 sm:py-24 bg-background"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">Everything you need, nothing you don't.</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              ShareBill is packed with features designed to make expense sharing effortless.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={cardVariants}
              >
                <Card className="text-center p-6 h-full hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
                  <CardHeader className="items-center p-0 mb-2">
                    {feature.icon}
                    <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section 
        className="py-16 sm:py-24 bg-muted/50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">Simple Steps to Shared Serenity</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { title: "Create a Group", description: "Invite friends, family, or colleagues to a shared group." },
              { title: "Add Expenses", description: "Log who paid and what for. Split bills equally or customize." },
              { title: "Settle Up", description: "See clear balances and settle debts easily. No more awkward IOUs!" }
            ].map((step, index) => (
              <motion.div 
                key={step.title} 
                className="p-6"
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={cardVariants}
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-primary text-primary-foreground rounded-full h-12 w-12 flex items-center justify-center text-xl font-bold shadow-md">{index + 1}</div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Call to Action Section */}
      <motion.section 
        className="py-16 sm:py-24 bg-background"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-6">Ready to Simplify Your Shared Expenses?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of users who trust ShareBill to manage their group finances.
              Sign up today and experience the ease of fair and transparent bill splitting.
            </p>
            <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
              <Link href="/signup">Sign Up Now - It's Free!</Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/40 bg-background">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} ShareBill. All rights reserved.</p>
          <p className="mt-1">
            Built with ❤️ for simpler sharing.
          </p>
        </div>
      </footer>
    </div>
  );
}
