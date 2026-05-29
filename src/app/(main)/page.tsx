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
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-violet-500/5" />
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
              🎓 Trusted by 10,000+ students
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Discover Your{" "}
              <span className="gradient-text">Perfect College</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Explore 150+ top colleges across India. Compare fees, placements, and ratings.
              Make data-driven decisions for your academic future.
            </p>

            <form onSubmit={handleSearch} className="flex gap-3 max-w-xl mx-auto mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search colleges by name..."
                  className="pl-12 h-13 text-base rounded-xl"
                />
              </div>
              <Button type="submit" size="xl" className="rounded-xl px-8">
                Search
              </Button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/colleges">
                <Button variant="outline" size="lg" className="rounded-xl gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Explore All Colleges
                </Button>
              </Link>
              <Link href="/predictor">
                <Button variant="ghost" size="lg" className="rounded-xl gap-2">
                  <Brain className="h-4 w-4" />
                  Try College Predictor
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to{" "}
              <span className="gradient-text">Decide</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful tools designed to simplify your college search and help you make the best decision.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                {...stagger}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50">
                  <CardContent className="p-6">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg} mb-4`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
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
