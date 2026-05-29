"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useUser, SignInButton } from "@clerk/nextjs";
import {
  MapPin, Star, Heart, Plus, Check, Globe, Calendar, Award, Shield,
  Wifi, BookOpen, Dumbbell, FlaskConical, Coffee, Cross, Building2,
  IndianRupee, TrendingUp, Users, ExternalLink, ChevronRight, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollege } from "@/hooks/use-college";
import { useSaveCollege, useUnsaveCollege, useIsSaved } from "@/hooks/use-saved";
import { useCompareStore } from "@/store/compare-store";
import { formatCurrency, formatLPA, getRatingBg, formatPercentage } from "@/lib/utils";
import { OWNERSHIP_LABELS, NAAC_LABELS } from "@/lib/constants";
import type { CollegeDetail } from "@/types";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

export default function CollegeDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: college, isLoading, isError } = useCollege(slug);
  const { isSignedIn } = useUser();
  const { data: isSaved } = useIsSaved(college?.id || "");
  const saveMutation = useSaveCollege();
  const unsaveMutation = useUnsaveCollege();
  const { addCollege, removeCollege, colleges: compareList } = useCompareStore();
  const isInCompare = compareList.some((c) => c.id === college?.id);
  const [relatedColleges, setRelatedColleges] = useState<CollegeDetail[]>([]);

  useEffect(() => {
    if (college?.state) {
      fetch(`/api/colleges?state=${encodeURIComponent(college.state)}&limit=4`)
        .then((r) => r.json())
        .then((res) => {
          if (res.success) {
            setRelatedColleges(res.data.filter((c: CollegeDetail) => c.id !== college.id).slice(0, 3));
          }
        })
        .catch(() => {});
    }
  }, [college?.state, college?.id]);

  if (isLoading) return <DetailSkeleton />;
  if (isError || !college) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold mb-2">College not found</h2>
        <p className="text-muted-foreground mb-6">The college you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/colleges"><Button>Browse Colleges</Button></Link>
      </div>
    );
  }

  const handleSave = () => {
    if (isSaved) unsaveMutation.mutate(college.id);
    else saveMutation.mutate(college.id);
  };

  const handleCompare = () => {
    if (isInCompare) removeCollege(college.id);
    else addCollege({ id: college.id, name: college.name, slug: college.slug });
  };

  const facilities = [
    { icon: Building2, label: "Hostel", available: college.hostel },
    { icon: Wifi, label: "Wi-Fi", available: college.wifi },
    { icon: BookOpen, label: "Library", available: college.library },
    { icon: Dumbbell, label: "Sports", available: college.sports },
    { icon: FlaskConical, label: "Labs", available: college.lab },
    { icon: Coffee, label: "Cafeteria", available: college.cafeteria },
    { icon: Cross, label: "Medical", available: college.medicalFacility },
  ];

  const placementChartData = college.placements
    ? [
        { name: "Average", value: college.placements.averagePackage },
        { name: "Highest", value: college.placements.highestPackage },
        ...(college.placements.medianPackage ? [{ name: "Median", value: college.placements.medianPackage }] : []),
      ]
    : [];

  const ratingData = college.reviews.length > 0
    ? [5, 4, 3, 2, 1].map((star) => ({
        star: `${star}★`,
        count: college.reviews.filter((r) => Math.round(r.rating) === star).length,
      }))
    : [];

  const COLORS = ["hsl(262,83%,58%)", "hsl(173,58%,39%)", "hsl(43,96%,56%)"];

  return (
    <div>
      {/* Hero */}
      <div className="relative h-64 sm:h-80 bg-muted overflow-hidden">
        <Image
          src={college.bannerImage || "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80"}
          alt={college.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="mx-auto max-w-7xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Badge className={`mb-3 ${getRatingBg(college.rating)}`}>
                <Star className="h-3 w-3 mr-1 fill-current" />{college.rating.toFixed(1)}
              </Badge>
              <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">{college.name}</h1>
              <div className="flex flex-wrap items-center gap-3 text-white/80 text-sm">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{college.city}, {college.state}</span>
                {college.established && <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />Est. {college.established}</span>}
                {college.naacGrade && <Badge variant="outline" className="border-white/30 text-white text-xs">NAAC {NAAC_LABELS[college.naacGrade]}</Badge>}
                {college.nirfRanking && <Badge variant="outline" className="border-white/30 text-white text-xs">NIRF #{college.nirfRanking}</Badge>}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="border-b bg-card sticky top-16 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1"><IndianRupee className="h-4 w-4 text-muted-foreground" /><strong>{formatCurrency(college.avgFees)}</strong>/yr</span>
            {college.placements && (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-4 w-4" /><strong>{formatPercentage(college.placements.placementRate)}</strong> placed
              </span>
            )}
            <span className="hidden sm:inline text-muted-foreground">{OWNERSHIP_LABELS[college.ownershipType]}</span>
          </div>
          <div className="flex items-center gap-2">
            {college.website && (
              <a href={college.website} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-1"><Globe className="h-3.5 w-3.5" /><span className="hidden sm:inline">Website</span></Button>
              </a>
            )}
            {isSignedIn ? (
              <Button variant={isSaved ? "default" : "outline"} size="sm" onClick={handleSave} className="gap-1">
                <Heart className={`h-3.5 w-3.5 ${isSaved ? "fill-current" : ""}`} />{isSaved ? "Saved" : "Save"}
              </Button>
            ) : (
              <SignInButton mode="modal"><Button variant="outline" size="sm" className="gap-1"><Heart className="h-3.5 w-3.5" />Save</Button></SignInButton>
            )}
            <Button variant={isInCompare ? "default" : "outline"} size="sm" onClick={handleCompare} className="gap-1">
              {isInCompare ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              {isInCompare ? "Added" : "Compare"}
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="flex-wrap h-auto p-1 gap-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses ({college.courses.length})</TabsTrigger>
            <TabsTrigger value="placements">Placements</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({college.reviews.length})</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card>
                  <CardHeader><CardTitle>About</CardTitle></CardHeader>
                  <CardContent><p className="text-muted-foreground leading-relaxed whitespace-pre-line">{college.description}</p></CardContent>
                </Card>
                {college.accreditation.length > 0 && (
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" />Accreditation</CardTitle></CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {college.accreditation.map((a) => (
                          <Badge key={a} variant="secondary">{a}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader><CardTitle>Facilities</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {facilities.map((f) => (
                        <div key={f.label} className={`flex items-center gap-2 text-sm ${f.available ? "" : "opacity-40"}`}>
                          <f.icon className="h-4 w-4" />
                          <span>{f.label}</span>
                          {f.available && <Check className="h-3 w-3 text-emerald-500 ml-auto" />}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Quick Facts</CardTitle></CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {college.established && <div className="flex justify-between"><span className="text-muted-foreground">Established</span><span className="font-medium">{college.established}</span></div>}
                    <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-medium">{OWNERSHIP_LABELS[college.ownershipType]}</span></div>
                    {college.nirfRanking && <div className="flex justify-between"><span className="text-muted-foreground">NIRF Ranking</span><span className="font-medium">#{college.nirfRanking}</span></div>}
                    {college.naacGrade && <div className="flex justify-between"><span className="text-muted-foreground">NAAC Grade</span><span className="font-medium">{NAAC_LABELS[college.naacGrade]}</span></div>}
                    <div className="flex justify-between"><span className="text-muted-foreground">Avg Fees</span><span className="font-medium">{formatCurrency(college.avgFees)}/yr</span></div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Courses */}
          <TabsContent value="courses">
            <div className="grid gap-4">
              {college.courses.map((course) => (
                <Card key={course.id}>
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{course.name}</h3>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span>{course.duration}</span>
                          {course.seats && <span>• {course.seats} seats</span>}
                        </div>
                        {course.eligibility && <p className="text-xs text-muted-foreground mt-2">{course.eligibility}</p>}
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-lg font-bold">{formatCurrency(course.fees)}</div>
                        <div className="text-xs text-muted-foreground">per year</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Placements */}
          <TabsContent value="placements">
            {college.placements ? (
              <div className="space-y-8">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Average Package", value: formatLPA(college.placements.averagePackage), icon: IndianRupee, color: "text-primary" },
                    { label: "Highest Package", value: formatLPA(college.placements.highestPackage), icon: TrendingUp, color: "text-emerald-500" },
                    { label: "Placement Rate", value: formatPercentage(college.placements.placementRate), icon: Users, color: "text-blue-500" },
                    ...(college.placements.medianPackage ? [{ label: "Median Package", value: formatLPA(college.placements.medianPackage), icon: Award, color: "text-amber-500" }] : []),
                  ].map((stat) => (
                    <Card key={stat.label}>
                      <CardContent className="p-5 text-center">
                        <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {placementChartData.length > 0 && (
                  <Card>
                    <CardHeader><CardTitle>Package Distribution (LPA)</CardTitle></CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={placementChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <RechartsTooltip formatter={(value) => [`₹${value} LPA`]} />
                            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                              {placementChartData.map((_, i) => (
                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {college.placements.topRecruiters.length > 0 && (
                  <Card>
                    <CardHeader><CardTitle>Top Recruiters</CardTitle></CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {college.placements.topRecruiters.map((r) => (
                          <Badge key={r} variant="secondary" className="py-1.5 px-3">{r}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">No placement data available.</div>
            )}
          </TabsContent>

          {/* Reviews */}
          <TabsContent value="reviews">
            {college.reviews.length > 0 ? (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  {college.reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{review.title}</h4>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              <span>{review.userName}</span>
                              <span>•</span>
                              <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <Badge className={getRatingBg(review.rating)}>
                            <Star className="h-3 w-3 mr-1 fill-current" />{review.rating.toFixed(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{review.content}</p>
                        {(review.pros || review.cons) && (
                          <div className="grid sm:grid-cols-2 gap-4 mt-4 pt-4 border-t">
                            {review.pros && <div><span className="text-xs font-medium text-emerald-600">Pros</span><p className="text-sm text-muted-foreground mt-1">{review.pros}</p></div>}
                            {review.cons && <div><span className="text-xs font-medium text-red-500">Cons</span><p className="text-sm text-muted-foreground mt-1">{review.cons}</p></div>}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {ratingData.length > 0 && (
                  <div>
                    <Card className="sticky top-36">
                      <CardHeader><CardTitle>Rating Breakdown</CardTitle></CardHeader>
                      <CardContent>
                        <div className="text-center mb-6">
                          <div className="text-4xl font-bold">{college.rating.toFixed(1)}</div>
                          <div className="flex items-center justify-center gap-1 mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < Math.round(college.rating) ? "text-amber-500 fill-amber-500" : "text-muted"}`} />
                            ))}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">{college.reviews.length} reviews</div>
                        </div>
                        <div className="space-y-2">
                          {ratingData.map((d) => (
                            <div key={d.star} className="flex items-center gap-2 text-sm">
                              <span className="w-8">{d.star}</span>
                              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(d.count / college.reviews.length) * 100}%` }} />
                              </div>
                              <span className="w-6 text-right text-muted-foreground">{d.count}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">No reviews yet.</div>
            )}
          </TabsContent>

          {/* Gallery */}
          <TabsContent value="gallery">
            {college.images.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {college.images.map((img, i) => (
                  <div key={i} className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                    <Image src={img} alt={`${college.name} - Image ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">No gallery images available.</div>
            )}
          </TabsContent>
        </Tabs>

        {/* Related Colleges */}
        {relatedColleges.length > 0 && (
          <div className="mt-16">
            <Separator className="mb-8" />
            <h2 className="text-2xl font-bold mb-6">Related Colleges in {college.state}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedColleges.map((rc: any) => (
                <Link key={rc.id} href={`/college/${rc.slug}`}>
                  <Card className="card-hover cursor-pointer overflow-hidden">
                    <div className="relative h-32 bg-muted">
                      <Image src={rc.bannerImage || "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80"} alt={rc.name} fill className="object-cover" sizes="33vw" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm line-clamp-1">{rc.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />{rc.city}, {rc.state}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div>
      <Skeleton className="h-64 sm:h-80 w-full rounded-none" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Skeleton className="h-10 w-96" />
        <Skeleton className="h-6 w-64" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
