"use client";

import { RotateCcw, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useFilterStore } from "@/store/filter-store";
import { INDIAN_STATES, SORT_OPTIONS, OWNERSHIP_LABELS, NAAC_LABELS } from "@/lib/constants";

function FilterContent() {
  const filters = useFilterStore();
  const activeCount = [
    filters.state, filters.city, filters.minFees, filters.maxFees,
    filters.minRating, filters.ownership, filters.naacGrade, filters.course,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">Filters</h3>
          {activeCount > 0 && (
            <Badge variant="secondary" className="text-xs">{activeCount}</Badge>
          )}
        </div>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={filters.resetFilters} className="text-xs">
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        )}
      </div>

      <Separator />

      {/* State */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider">State</Label>
        <Select
          value={filters.state || "all"}
          onValueChange={(v) => filters.setFilter("state", v === "all" ? undefined : v)}
        >
          <SelectTrigger><SelectValue placeholder="All States" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {INDIAN_STATES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* City */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider">City</Label>
        <Input
          placeholder="Enter city..."
          value={filters.city || ""}
          onChange={(e) => filters.setFilter("city", e.target.value || undefined)}
        />
      </div>

      {/* Fee Range */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Fee Range (₹/year)</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minFees || ""}
            onChange={(e) => filters.setFilter("minFees", e.target.value ? Number(e.target.value) : undefined)}
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxFees || ""}
            onChange={(e) => filters.setFilter("maxFees", e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Min Rating</Label>
        <Select
          value={filters.minRating?.toString() || "any"}
          onValueChange={(v) => filters.setFilter("minRating", v === "any" ? undefined : Number(v))}
        >
          <SelectTrigger><SelectValue placeholder="Any Rating" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Rating</SelectItem>
            <SelectItem value="4">4+ Stars</SelectItem>
            <SelectItem value="3.5">3.5+ Stars</SelectItem>
            <SelectItem value="3">3+ Stars</SelectItem>
            <SelectItem value="2.5">2.5+ Stars</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Ownership */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Ownership</Label>
        <Select
          value={filters.ownership || "all"}
          onValueChange={(v) => filters.setFilter("ownership", v === "all" ? undefined : v as any)}
        >
          <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(OWNERSHIP_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* NAAC */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider">NAAC Grade</Label>
        <Select
          value={filters.naacGrade || "all"}
          onValueChange={(v) => filters.setFilter("naacGrade", v === "all" ? undefined : v as any)}
        >
          <SelectTrigger><SelectValue placeholder="Any Grade" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Grade</SelectItem>
            {Object.entries(NAAC_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Sort By</Label>
        <Select
          value={filters.sort || "rating_desc"}
          onValueChange={(v) => filters.setFilter("sort", v)}
        >
          <SelectTrigger><SelectValue placeholder="Sort by..." /></SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function CollegeFilters() {
  const activeCount = useFilterStore((s) => {
    return [s.state, s.city, s.minFees, s.maxFees, s.minRating, s.ownership, s.naacGrade, s.course].filter(Boolean).length;
  });

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-20 rounded-xl border bg-card p-5">
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <FilterContent />
          </ScrollArea>
        </div>
      </aside>

      {/* Mobile bottom sheet trigger */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeCount > 0 && (
                <Badge variant="secondary" className="text-xs ml-1">{activeCount}</Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[80vh]">
            <SheetHeader>
              <SheetTitle>Filter Colleges</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[60vh] mt-4 pr-4">
              <FilterContent />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
