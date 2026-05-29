"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Search, GitCompareArrows, Brain, Bookmark,
  GraduationCap, MapPin, BookOpen, Trophy,
  ArrowRight, Star, TrendingUp, IndianRupee,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatCurrency, getRatingBg } from "@/lib/utils";
import { useState, useEffect } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count}{suffix}</span>;
}

const features = [
  {
    icon: Search,
    title: "Smart Search & Filters",
    description: "Find your ideal college with advanced filters — by state, fees, rating, courses, and more.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: GitCompareArrows,
    title: "Compare Side-by-Side",
    description: "Compare up to 3 colleges on fees, placements, facilities, and courses in one view.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Brain,
    title: "College Predictor",
    description: "Enter your rank and exam — get personalized college recommendations with admission chances.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    icon: Bookmark,
    title: "Save & Organize",
    description: "Bookmark colleges you love. Build your shortlist and revisit anytime.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
];

const stats = [
  { value: 150, suffix: "+", label: "Colleges" },
  { value: 50, suffix: "+", label: "Cities" },
  { value: 10, suffix: "+", label: "Exams" },
  { value: 1000, suffix: "+", label: "Courses" },
];

interface TopCollege {
  id: string;
  name: string;
  slug: string;
  bannerImage: string | null;
  city: string;
  state: string;
  rating: number;
  avgFees: number;
  placements: { averagePackage: number; placementRate: number } | null;
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [topColleges, setTopColleges] = useState<TopCollege[]>([]);

  useEffect(() => {
    fetch("/api/colleges?sort=rating_desc&limit=6")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setTopColleges(res.data);
      })
      .catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/colleges?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="relative">
      {/* Premium Hero */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center justify-center">
        {/* Animated Mesh Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background z-0" />
        <div className="absolute inset-0 opacity-40 dark:opacity-20 z-0">
          <div className="absolute top-[-10%] left-[-10%] h-[50vh] w-[50vw] rounded-full bg-primary/30 blur-[120px] mix-blend-multiply animate-float" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[50vh] w-[50vw] rounded-full bg-violet-500/30 blur-[120px] mix-blend-multiply animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute top-[40%] left-[40%] h-[30vh] w-[30vw] rounded-full bg-indigo-500/20 blur-[100px] mix-blend-multiply animate-float" style={{ animationDelay: "4s" }} />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24 sm:pb-32 lg:pb-40 pt-28 sm:pt-36 lg:pt-40 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="text-center max-w-4xl mx-auto flex flex-col items-center"
          >
            <Badge variant="outline" className="mb-8 px-4 py-1.5 text-sm rounded-full border-primary/30 bg-primary/5 text-primary backdrop-blur-md">
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Trusted by 10,000+ students
              </span>
            </Badge>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Discover Your <br className="hidden sm:block" />
              <span className="gradient-text">Perfect College</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Explore 150+ top colleges across India. Compare fees, placements, and ratings.
              Make data-driven decisions for your academic future.
            </p>

            <motion.form 
              onSubmit={handleSearch} 
              className="w-full max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="relative flex items-center p-2 premium-glass-card rounded-2xl premium-shadow">
                <Search className="absolute left-6 h-5 w-5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search colleges, courses, or cities..."
                  className="pl-14 h-14 text-lg border-0 bg-transparent shadow-none focus-visible:ring-0 rounded-xl"
                />
                <Button type="submit" size="lg" className="rounded-xl px-8 h-12 text-base font-semibold ios-press shrink-0">
                  Search
                </Button>
              </div>
            </motion.form>

            <motion.div 
              className="flex flex-wrap items-center justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Link href="/colleges">
                <Button variant="outline" size="lg" className="rounded-xl gap-2 h-12 px-6 ios-press bg-background/50 backdrop-blur-sm border-border/50 hover:bg-background/80">
                  <GraduationCap className="h-5 w-5" />
                  Explore All Colleges
                </Button>
              </Link>
              <Link href="/predictor">
                <Button variant="ghost" size="lg" className="rounded-xl gap-2 h-12 px-6 ios-press hover:bg-primary/10 hover:text-primary">
                  <Brain className="h-5 w-5" />
                  Try College Predictor
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Premium Stats */}
      <section className="py-16 border-y border-border/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-muted/20 backdrop-blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div 
                key={stat.label} 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="text-4xl sm:text-5xl font-extrabold gradient-text mb-2 tracking-tight">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Premium Features */}
      <section className="py-24 sm:py-32 relative">
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-5xl font-bold mb-6 tracking-tight">
              Everything You Need to{" "}
              <span className="gradient-text">Decide</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Powerful tools designed to simplify your college search and help you make the best decision.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="h-full"
              >
                <div className="h-full p-8 rounded-3xl premium-glass-card transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group">
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${feature.bg} mb-6 transition-transform duration-300 group-hover:scale-110`}>
                    <feature.icon className={`h-7 w-7 ${feature.color}`} />
                  </div>
                  <h3 className="font-semibold text-xl mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Colleges */}
      {topColleges.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeInUp} className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold mb-2">Top Rated Colleges</h2>
                <p className="text-muted-foreground">Highest rated institutions across India</p>
              </div>
              <Link href="/colleges?sort=rating_desc">
                <Button variant="outline" className="gap-2 hidden sm:inline-flex">
                  View All <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {topColleges.map((college, i) => (
                <motion.div key={college.id} {...stagger} transition={{ duration: 0.4, delay: i * 0.08 }}>
                  <Link href={`/college/${college.slug}`}>
                    <Card className="overflow-hidden card-hover group cursor-pointer">
                      <div className="relative h-40 bg-muted">
                        <Image
                          src={college.bannerImage || "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80"}
                          alt={college.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <Badge className={`absolute top-3 right-3 ${getRatingBg(college.rating)}`}>
                          <Star className="h-3 w-3 mr-1 fill-current" />{college.rating.toFixed(1)}
                        </Badge>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-sm line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                          {college.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                          <MapPin className="h-3 w-3" />{college.city}, {college.state}
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1">
                            <IndianRupee className="h-3 w-3" />{formatCurrency(college.avgFees)}/yr
                          </span>
                          {college.placements && (
                            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                              <TrendingUp className="h-3 w-3" />{college.placements.placementRate.toFixed(0)}% placed
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8 sm:hidden">
              <Link href="/colleges?sort=rating_desc">
                <Button variant="outline" className="gap-2">
                  View All Colleges <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp}>
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary/10 via-primary/5 to-violet-500/10">
              <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
              <CardContent className="relative p-12 sm:p-16 text-center">
                <Trophy className="h-12 w-12 text-primary mx-auto mb-6" />
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Ready to Find Your Dream College?
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                  Join thousands of students making smarter college decisions with CampusLens.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link href="/colleges">
                    <Button size="xl" className="rounded-xl gap-2">
                      <BookOpen className="h-5 w-5" />
                      Start Exploring
                    </Button>
                  </Link>
                  <Link href="/predictor">
                    <Button variant="outline" size="xl" className="rounded-xl gap-2">
                      <Brain className="h-5 w-5" />
                      Try Predictor
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
