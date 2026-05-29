"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Heart, Plus, IndianRupee, TrendingUp, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useUser, SignInButton } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCompareStore } from "@/store/compare-store";
import { useSaveCollege, useUnsaveCollege, useIsSaved } from "@/hooks/use-saved";
import { formatCurrency, getRatingBg } from "@/lib/utils";
import { OWNERSHIP_LABELS } from "@/lib/constants";
import type { CollegeCard as CollegeCardType } from "@/types";

interface CollegeCardProps {
  college: CollegeCardType;
  index?: number;
}

export function CollegeCard({ college, index = 0 }: CollegeCardProps) {
  const { isSignedIn } = useUser();
  const { addCollege, removeCollege, colleges: compareList } = useCompareStore();
  const isInCompare = compareList.some((c) => c.id === college.id);
  const { data: isSaved } = useIsSaved(college.id);
  const saveMutation = useSaveCollege();
  const unsaveMutation = useUnsaveCollege();

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved) {
      unsaveMutation.mutate(college.id);
    } else {
      saveMutation.mutate(college.id);
    }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCompare) {
      removeCollege(college.id);
    } else {
      addCollege({ id: college.id, name: college.name, slug: college.slug });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/college/${college.slug}`}>
        <Card className="overflow-hidden card-hover ios-press group cursor-pointer h-full flex flex-col rounded-2xl border-border/40">
          {/* Image */}
          <div className="relative h-44 overflow-hidden bg-muted">
            <Image
              src={college.bannerImage || "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80"}
              alt={college.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute top-3 right-3 flex gap-1.5">
              <Badge className={getRatingBg(college.rating)}>
                <Star className="h-3 w-3 mr-1 fill-current" />
                {college.rating.toFixed(1)}
              </Badge>
            </div>
            <div className="absolute bottom-3 left-3">
              <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-xs">
                {OWNERSHIP_LABELS[college.ownershipType] || college.ownershipType}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex-1 flex flex-col">
            <h3 className="font-semibold text-base line-clamp-2 mb-1.5 group-hover:text-primary transition-colors">
              {college.name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{college.city}, {college.state}</span>
            </div>

            {/* Course badges */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {college.courses.slice(0, 3).map((c) => (
                <Badge key={c.name} variant="outline" className="text-[10px] px-2 py-0.5">
                  {c.name.length > 20 ? c.name.slice(0, 18) + "…" : c.name}
                </Badge>
              ))}
              {college.courses.length > 3 && (
                <Badge variant="outline" className="text-[10px] px-2 py-0.5">
                  +{college.courses.length - 3}
                </Badge>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm mt-auto pt-3 border-t border-border/50">
              <div className="flex items-center gap-1">
                <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-medium">{formatCurrency(college.avgFees)}</span>
                <span className="text-muted-foreground text-xs">/yr</span>
              </div>
              {college.placements && (
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {college.placements.placementRate.toFixed(0)}%
                  </span>
                  <span className="text-muted-foreground text-xs">placed</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-3 pt-3 border-t border-border/50">
              <Button variant="default" size="sm" className="flex-1 text-xs rounded-xl h-9" asChild>
                <span>View Details</span>
              </Button>
              {isSignedIn ? (
                <Button
                  variant={isSaved ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={handleSave}
                >
                  <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                </Button>
              ) : (
                <SignInButton mode="modal">
                  <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={(e) => e.preventDefault()}>
                    <Heart className="h-4 w-4" />
                  </Button>
                </SignInButton>
              )}
              <Button
                variant={isInCompare ? "default" : "outline"}
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={handleCompare}
              >
                {isInCompare ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
