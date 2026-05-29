import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse, ReviewInfo, PaginationMeta } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const collegeId = searchParams.get("collegeId");
    const cursor = searchParams.get("cursor");
    const limitParam = searchParams.get("limit");
    const limit = Math.min(Math.max(parseInt(limitParam || "10", 10) || 10, 1), 50);

    if (!collegeId) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "Missing 'collegeId' query parameter.",
        },
        { status: 400 }
      );
    }

    // Verify college exists
    const college = await prisma.college.findUnique({
      where: { id: collegeId },
      select: { id: true },
    });

    if (!college) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "College not found." },
        { status: 404 }
      );
    }

    // Count total reviews
    const total = await prisma.review.count({
      where: { collegeId },
    });

    // Fetch reviews with cursor-based pagination
    const reviews = await prisma.review.findMany({
      where: { collegeId },
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
      select: {
        id: true,
        userId: true,
        userName: true,
        rating: true,
        title: true,
        content: true,
        pros: true,
        cons: true,
        createdAt: true,
      },
    });

    const hasMore = reviews.length > limit;
    const results = hasMore ? reviews.slice(0, limit) : reviews;
    const nextCursor = hasMore ? results[results.length - 1]?.id : undefined;

    // Serialize dates
    const data: ReviewInfo[] = results.map((review) => ({
      ...review,
      createdAt: review.createdAt.toISOString(),
    }));

    const meta: PaginationMeta = {
      total,
      page: cursor ? -1 : 1,
      pageSize: limit,
      hasMore,
      cursor: nextCursor,
    };

    return NextResponse.json<ApiResponse<ReviewInfo[]>>({
      success: true,
      data,
      meta,
    });
  } catch (error) {
    console.error("[API] GET /api/reviews error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: "Failed to fetch reviews. Please try again later.",
      },
      { status: 500 }
    );
  }
}
