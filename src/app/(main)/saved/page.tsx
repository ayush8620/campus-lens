"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, MapPin, Star, IndianRupee, TrendingUp, Trash2, Bookmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useGetSaved, useUnsaveCollege } from "@/hooks/use-saved";
import { formatCurrency, getRatingBg } from "@/lib/utils";
import { toast } from "sonner";

export default function SavedPage() {
  const { data: savedItems, isLoading, isError } = useGetSaved();
  const unsaveMutation = useUnsaveCollege();

  const handleRemove = (collegeId: string, name: string) => {
    unsaveMutation.mutate(collegeId, {
      onSuccess: () => toast.success(`Removed ${name} from saved`),
    });
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-8">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-5 w-72 mb-8" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-12 text-center">
        <p className="text-destructive mb-4">Failed to load saved colleges.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">Saved Colleges</h1>
        <p className="text-muted-foreground mb-8">
          {savedItems && savedItems.length > 0
            ? `You have ${savedItems.length} saved college${savedItems.length > 1 ? "s" : ""}`
            : "Your bookmarked colleges will appear here"}
        </p>
      </motion.div>

      {!savedItems || savedItems.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved colleges yet"
          description="Browse colleges and click the heart icon to save them to your list."
          actionLabel="Browse Colleges"
          actionHref="/colleges"
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedItems.map((item: any, i: number) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="overflow-hidden card-hover group">
                <Link href={`/college/${item.college.slug}`}>
                  <div className="relative h-40 bg-muted">
                    <Image
                      src={item.college.bannerImage || "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80"}
                      alt={item.college.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <Badge className={`absolute top-3 right-3 ${getRatingBg(item.college.rating)}`}>
                      <Star className="h-3 w-3 mr-1 fill-current" />{item.college.rating.toFixed(1)}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                      {item.college.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                      <MapPin className="h-3 w-3" />{item.college.city}, {item.college.state}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1">
                        <IndianRupee className="h-3 w-3" />{formatCurrency(item.college.avgFees)}/yr
                      </span>
                      {item.college.placements && (
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                          <TrendingUp className="h-3 w-3" />{item.college.placements.placementRate.toFixed(0)}%
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Link>
                <div className="px-4 pb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs text-destructive hover:text-destructive gap-1"
                    onClick={() => handleRemove(item.college.id, item.college.name)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />Remove
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
