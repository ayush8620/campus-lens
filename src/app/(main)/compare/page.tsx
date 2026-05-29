"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  X, Plus, Search, Check, Star, MapPin, IndianRupee,
  TrendingUp, GraduationCap, GitCompareArrows, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useCompareStore } from "@/store/compare-store";
import { useCompare } from "@/hooks/use-compare";
import { formatCurrency, formatLPA, formatPercentage, getRatingBg } from "@/lib/utils";
import { OWNERSHIP_LABELS, NAAC_LABELS } from "@/lib/constants";
import type { CompareCollege } from "@/types";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
} from "recharts";

export default function ComparePage() {
  const { colleges: selectedColleges, removeCollege, clearAll } = useCompareStore();
  const { data: compareData, isLoading, isError } = useCompare();
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);

  if (selectedColleges.length < 2) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Compare Colleges</h1>
          <p className="text-muted-foreground">Add at least 2 colleges to compare side by side</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
          {Array.from({ length: 3 }).map((_, i) => {
            const selected = selectedColleges[i];
            return (
              <Card key={i} className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-8 min-h-[200px]">
                  {selected ? (
                    <div className="text-center">
                      <p className="font-medium text-sm mb-2">{selected.name}</p>
                      <Button variant="ghost" size="sm" onClick={() => removeCollege(selected.id)}>
                        <X className="h-4 w-4 mr-1" />Remove
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-3">
                        <Plus className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {i < 2 ? "Required" : "Optional"}
                      </p>
                      <Link href="/colleges">
                        <Button variant="outline" size="sm">Browse Colleges</Button>
                      </Link>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <EmptyState
          icon={GitCompareArrows}
          title="Start Comparing"
          description="Browse colleges and click the Compare button to add them here."
          actionLabel="Browse Colleges"
          actionHref="/colleges"
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-12">
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="grid grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !compareData) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-12 text-center">
        <p className="text-destructive">Failed to load comparison data.</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const colleges: CompareCollege[] = compareData;
  const chartData = colleges.map((c) => ({
    name: c.name.length > 20 ? c.name.slice(0, 18) + "…" : c.name,
    "Avg Package": c.placements?.averagePackage || 0,
    "Placement %": c.placements?.placementRate || 0,
    Rating: c.rating,
  }));

  const COLORS = ["hsl(262,83%,58%)", "hsl(173,58%,39%)", "hsl(43,96%,56%)"];

  const compareRows = [
    { label: "Location", render: (c: CompareCollege) => `${c.city}, ${c.state}` },
    { label: "Rating", render: (c: CompareCollege) => c.rating.toFixed(1), best: "max" as const },
    { label: "NIRF Ranking", render: (c: CompareCollege) => c.nirfRanking ? `#${c.nirfRanking}` : "N/A", best: "min" as const },
    { label: "Ownership", render: (c: CompareCollege) => OWNERSHIP_LABELS[c.ownershipType] || c.ownershipType },
    { label: "NAAC Grade", render: (c: CompareCollege) => c.naacGrade ? NAAC_LABELS[c.naacGrade] : "N/A" },
    { label: "Established", render: (c: CompareCollege) => c.established?.toString() || "N/A" },
    { label: "Avg Fees", render: (c: CompareCollege) => formatCurrency(c.avgFees) + "/yr", best: "min" as const },
    { label: "Avg Package", render: (c: CompareCollege) => c.placements ? formatLPA(c.placements.averagePackage) : "N/A", best: "max" as const },
    { label: "Highest Package", render: (c: CompareCollege) => c.placements ? formatLPA(c.placements.highestPackage) : "N/A", best: "max" as const },
    { label: "Placement Rate", render: (c: CompareCollege) => c.placements ? formatPercentage(c.placements.placementRate) : "N/A", best: "max" as const },
    { label: "Courses", render: (c: CompareCollege) => c.courses.map((co) => co.name).join(", ") },
    { label: "Hostel", render: (c: CompareCollege) => c.hostel ? "✓" : "✗" },
    { label: "Wi-Fi", render: (c: CompareCollege) => c.wifi ? "✓" : "✗" },
    { label: "Library", render: (c: CompareCollege) => c.library ? "✓" : "✗" },
    { label: "Sports", render: (c: CompareCollege) => c.sports ? "✓" : "✗" },
    { label: "Labs", render: (c: CompareCollege) => c.lab ? "✓" : "✗" },
    { label: "Cafeteria", render: (c: CompareCollege) => c.cafeteria ? "✓" : "✗" },
    { label: "Medical", render: (c: CompareCollege) => c.medicalFacility ? "✓" : "✗" },
  ];

  function getBestIndex(row: typeof compareRows[0]) {
    if (!row.best) return -1;
    const values = colleges.map((c) => {
      const v = row.render(c);
      const num = parseFloat(v.replace(/[^\d.]/g, ""));
      return isNaN(num) ? -Infinity : num;
    });
    if (row.best === "max") return values.indexOf(Math.max(...values));
    return values.indexOf(Math.min(...values.filter((v) => v > -Infinity)));
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Compare Colleges</h1>
          <p className="text-muted-foreground">Side-by-side comparison of {colleges.length} colleges</p>
        </div>
        <Button variant="outline" size="sm" onClick={clearAll}>Clear All</Button>
      </div>

      {/* College Headers */}
      <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: `repeat(${colleges.length}, 1fr)` }}>
        {colleges.map((c) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="overflow-hidden">
              <div className="relative h-32 bg-muted">
                <Image
                  src={c.bannerImage || "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80"}
                  alt={c.name} fill className="object-cover" sizes="33vw"
                />
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-background/80 h-7 w-7" onClick={() => removeCollege(c.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardContent className="p-4">
                <Link href={`/college/${c.slug}`} className="font-semibold text-sm hover:text-primary transition-colors line-clamp-2">
                  {c.name}
                </Link>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3" />{c.city}, {c.state}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <Card className="mb-8">
        <CardHeader><CardTitle>Visual Comparison</CardTitle></CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="Avg Package" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Placement %" fill={COLORS[1]} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Rating" fill={COLORS[2]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <tbody>
                {compareRows.map((row) => {
                  const bestIdx = getBestIndex(row);
                  return (
                    <tr key={row.label} className="border-b last:border-0">
                      <td className="p-4 font-medium text-muted-foreground bg-muted/30 w-40 whitespace-nowrap">
                        {row.label}
                      </td>
                      {colleges.map((c, i) => (
                        <td key={c.id} className={`p-4 ${bestIdx === i ? "font-semibold text-primary" : ""}`}>
                          {row.render(c)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
