"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Brain, Search, Loader2, MapPin, Star, IndianRupee,
  TrendingUp, Heart, Plus, Check, GraduationCap, Trophy, Target, Sparkles,
} from "lucide-react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";
import { usePredictor } from "@/hooks/use-predictor";
import { useSaveCollege, useUnsaveCollege, useIsSaved } from "@/hooks/use-saved";
import { useCompareStore } from "@/store/compare-store";
import { predictorSchema, type PredictorInput } from "@/validators/predictor";
import { formatCurrency, getRatingBg, getChanceColor } from "@/lib/utils";
import { INDIAN_STATES, EXAM_LABELS, CATEGORY_LABELS, BRANCHES } from "@/lib/constants";
import type { PredictorResult, PredictorResponse } from "@/types";

function ResultCard({ result }: { result: PredictorResult }) {
  const { isSignedIn } = useUser();
  const { addCollege, removeCollege, colleges } = useCompareStore();
  const isInCompare = colleges.some((c) => c.id === result.college.id);
  const { data: isSaved } = useIsSaved(result.college.id);
  const saveMutation = useSaveCollege();
  const unsaveMutation = useUnsaveCollege();
  const colors = getChanceColor(result.chance);

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
      <Card className={`border ${colors.border}`}>
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Link href={`/college/${result.college.slug}`} className="font-semibold hover:text-primary transition-colors truncate">
                  {result.college.name}
                </Link>
                <Badge className={`${colors.bg} ${colors.text} border-0 shrink-0`}>{result.chance}</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{result.college.city}, {result.college.state}</span>
                <span className="flex items-center gap-1"><IndianRupee className="h-3.5 w-3.5" />{formatCurrency(result.college.avgFees)}/yr</span>
                {result.college.placements && (
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="h-3.5 w-3.5" />{result.college.placements.placementRate.toFixed(0)}% placed
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <span>Branch: {result.matchedBranch}</span>
                <span>•</span>
                <span>Cutoff: {result.openingRank} - {result.closingRank}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="text-center mr-2">
                <div className={`text-2xl font-bold ${colors.text}`}>{result.chancePercentage}%</div>
                <div className="text-[10px] text-muted-foreground">chance</div>
              </div>
              <Badge className={getRatingBg(result.college.rating)}>
                <Star className="h-3 w-3 mr-0.5 fill-current" />{result.college.rating.toFixed(1)}
              </Badge>
              {isSignedIn ? (
                <Button variant={isSaved ? "default" : "outline"} size="icon" className="h-8 w-8"
                  onClick={() => isSaved ? unsaveMutation.mutate(result.college.id) : saveMutation.mutate(result.college.id)}>
                  <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                </Button>
              ) : (
                <SignInButton mode="modal">
                  <Button variant="outline" size="icon" className="h-8 w-8"><Heart className="h-4 w-4" /></Button>
                </SignInButton>
              )}
              <Button variant={isInCompare ? "default" : "outline"} size="icon" className="h-8 w-8"
                onClick={() => isInCompare ? removeCollege(result.college.id) : addCollege({ id: result.college.id, name: result.college.name, slug: result.college.slug })}>
                {isInCompare ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ResultSection({ title, icon: Icon, results, color }: { title: string; icon: React.ElementType; results: PredictorResult[]; color: string }) {
  if (results.length === 0) return null;
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className={`h-5 w-5 ${color}`} />
        <h3 className="text-lg font-semibold">{title}</h3>
        <Badge variant="secondary">{results.length}</Badge>
      </div>
      <div className="space-y-3">
        {results.map((r) => <ResultCard key={r.college.id + r.matchedBranch} result={r} />)}
      </div>
    </div>
  );
}

export default function PredictorPage() {
  const [results, setResults] = useState<PredictorResponse | null>(null);
  const { mutate, isPending } = usePredictor();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PredictorInput>({
    resolver: zodResolver(predictorSchema),
    defaultValues: { rank: undefined, homeState: "", preferredCity: "", preferredBranch: "" },
  });

  const onSubmit = (data: PredictorInput) => {
    mutate(data, {
      onSuccess: (response) => {
        if (response.success && response.data) setResults(response.data);
      },
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-4">
          <Brain className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">College Predictor</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Enter your exam details and get personalized college recommendations with admission chances.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Form */}
        <Card className="lg:col-span-2 h-fit lg:sticky lg:top-20">
          <CardHeader><CardTitle>Enter Your Details</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Exam */}
              <div className="space-y-2">
                <Label>Exam *</Label>
                <Select onValueChange={(v) => setValue("exam", v as PredictorInput["exam"])}>
                  <SelectTrigger><SelectValue placeholder="Select exam" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(EXAM_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.exam && <p className="text-xs text-destructive">{errors.exam.message}</p>}
              </div>

              {/* Rank */}
              <div className="space-y-2">
                <Label>Rank *</Label>
                <Input type="number" placeholder="Enter your rank" {...register("rank", { valueAsNumber: true })} />
                {errors.rank && <p className="text-xs text-destructive">{errors.rank.message}</p>}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select onValueChange={(v) => setValue("category", v as PredictorInput["category"])}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
              </div>

              {/* Branch */}
              <div className="space-y-2">
                <Label>Preferred Branch *</Label>
                <Select onValueChange={(v) => setValue("preferredBranch", v)}>
                  <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
                  <SelectContent>
                    {BRANCHES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.preferredBranch && <p className="text-xs text-destructive">{errors.preferredBranch.message}</p>}
              </div>

              {/* Home State */}
              <div className="space-y-2">
                <Label>Home State <span className="text-muted-foreground">(optional)</span></Label>
                <Select onValueChange={(v) => setValue("homeState", v)}>
                  <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                  <SelectContent>
                    {INDIAN_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Preferred City */}
              <div className="space-y-2">
                <Label>Preferred City <span className="text-muted-foreground">(optional)</span></Label>
                <Input placeholder="e.g., Mumbai" {...register("preferredCity")} />
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Predicting...</> : <><Search className="h-4 w-4 mr-2" />Find Colleges</>}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="lg:col-span-3 space-y-8">
          <AnimatePresence mode="wait">
            {isPending ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i}><CardContent className="p-5"><div className="flex gap-4"><div className="flex-1 space-y-2"><div className="h-5 w-3/4 bg-muted animate-pulse rounded" /><div className="h-4 w-1/2 bg-muted animate-pulse rounded" /></div><div className="h-10 w-16 bg-muted animate-pulse rounded" /></div></CardContent></Card>
                ))}
              </motion.div>
            ) : results ? (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {results.total === 0 ? (
                  <EmptyState
                    icon={GraduationCap}
                    title="No matching colleges found"
                    description="Try changing your exam, rank, branch, or category to see more results."
                  />
                ) : (
                  <div className="space-y-8">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span>Found <strong className="text-foreground">{results.total}</strong> colleges matching your profile</span>
                    </div>
                    <ResultSection title="Safe Choices" icon={Trophy} results={results.safe} color="text-emerald-500" />
                    <ResultSection title="Moderate Chances" icon={Target} results={results.moderate} color="text-amber-500" />
                    <ResultSection title="Dream Colleges" icon={Sparkles} results={results.dream} color="text-violet-500" />
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <Brain className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Enter your details</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Fill out the form with your exam, rank, and preferences to get personalized college recommendations.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
