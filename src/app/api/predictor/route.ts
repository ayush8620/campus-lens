import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { predictorSchema } from "@/validators/predictor";
import type { ApiResponse, PredictorResponse, PredictorResult, CollegeCard } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const parseResult = predictorSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: parseResult.error.issues.map((e) => e.message).join(", "),
        },
        { status: 400 }
      );
    }

    const { exam, rank, category, homeState, preferredBranch } = parseResult.data;

    // Query cutoff data matching exam, category, and branch
    const cutoffs = await prisma.cutoffData.findMany({
      where: {
        exam,
        category,
        branch: { contains: preferredBranch, mode: "insensitive" },
      },
      include: {
        college: {
          select: {
            id: true,
            name: true,
            slug: true,
            shortDescription: true,
            bannerImage: true,
            city: true,
            state: true,
            rating: true,
            avgFees: true,
            ownershipType: true,
            naacGrade: true,
            nirfRanking: true,
            courses: {
              select: { name: true },
            },
            placements: {
              select: {
                averagePackage: true,
                placementRate: true,
              },
            },
          },
        },
      },
    });

    const safe: PredictorResult[] = [];
    const moderate: PredictorResult[] = [];
    const dream: PredictorResult[] = [];

    // Track processed college IDs to avoid duplicates (keep the best chance)
    const processedColleges = new Map<string, PredictorResult>();

    for (const cutoff of cutoffs) {
      let chance: "Safe" | "Moderate" | "Dream";
      let chancePercentage: number;

      if (rank <= cutoff.openingRank) {
        // Rank is better than (lower than) opening rank
        chance = "Safe";
        chancePercentage = 95;
      } else if (rank <= cutoff.closingRank) {
        // Rank is between opening and closing
        chance = "Moderate";
        // Linear interpolation: closer to opening = higher chance
        const range = cutoff.closingRank - cutoff.openingRank;
        const position = rank - cutoff.openingRank;
        chancePercentage = Math.round(89 - ((position / range) * 39)); // 89% to 50%
      } else if (rank <= cutoff.closingRank * 1.15) {
        // Rank is within 15% beyond closing rank
        chance = "Dream";
        const beyondRange = cutoff.closingRank * 0.15;
        const position = rank - cutoff.closingRank;
        chancePercentage = Math.round(49 - ((position / beyondRange) * 29)); // 49% to 20%
      } else {
        // Rank is too high — skip
        continue;
      }

      // Home state boost: +10% if student's home state matches college state
      if (homeState && cutoff.college.state.toLowerCase() === homeState.toLowerCase()) {
        chancePercentage = Math.min(99, chancePercentage + 10);
      }

      const result: PredictorResult = {
        college: cutoff.college as CollegeCard,
        chance,
        chancePercentage,
        matchedBranch: cutoff.branch,
        closingRank: cutoff.closingRank,
        openingRank: cutoff.openingRank,
      };

      // Keep the best result per college
      const existing = processedColleges.get(cutoff.college.id);
      if (!existing || result.chancePercentage > existing.chancePercentage) {
        processedColleges.set(cutoff.college.id, result);
      }
    }

    // Group deduplicated results by chance category
    for (const result of processedColleges.values()) {
      switch (result.chance) {
        case "Safe":
          safe.push(result);
          break;
        case "Moderate":
          moderate.push(result);
          break;
        case "Dream":
          dream.push(result);
          break;
      }
    }

    // Sort each group by college rating descending
    const sortByRating = (a: PredictorResult, b: PredictorResult) =>
      b.college.rating - a.college.rating;

    safe.sort(sortByRating);
    moderate.sort(sortByRating);
    dream.sort(sortByRating);

    const response: PredictorResponse = {
      safe,
      moderate,
      dream,
      total: safe.length + moderate.length + dream.length,
    };

    return NextResponse.json<ApiResponse<PredictorResponse>>({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("[API] POST /api/predictor error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: "Failed to predict college chances. Please try again later.",
      },
      { status: 500 }
    );
  }
}
