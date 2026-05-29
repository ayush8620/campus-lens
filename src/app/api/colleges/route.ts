import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { collegeQuerySchema } from "@/validators/college";
import type { ApiResponse, CollegeCard, PaginationMeta } from "@/types";
import type { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate query parameters
    const rawParams = Object.fromEntries(searchParams.entries());
    const parseResult = collegeQuerySchema.safeParse(rawParams);

    if (!parseResult.success) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: parseResult.error.issues.map((e) => e.message).join(", "),
        },
        { status: 400 }
      );
    }

    const {
      search,
      state,
      city,
      minFees,
      maxFees,
      minRating,
      ownership,
      naacGrade,
      course,
      sort,
      cursor,
      limit,
    } = parseResult.data;

    // ─── Build WHERE clause ─────────────────────────────
    const where: Prisma.CollegeWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { state: { contains: search, mode: "insensitive" } },
      ];
    }

    if (state) {
      where.state = { equals: state, mode: "insensitive" };
    }

    if (city) {
      where.city = { equals: city, mode: "insensitive" };
    }

    if (minFees !== undefined || maxFees !== undefined) {
      where.avgFees = {};
      if (minFees !== undefined) where.avgFees.gte = minFees;
      if (maxFees !== undefined) where.avgFees.lte = maxFees;
    }

    if (minRating !== undefined) {
      where.rating = { gte: minRating };
    }

    if (ownership) {
      where.ownershipType = ownership;
    }

    if (naacGrade) {
      where.naacGrade = naacGrade;
    }

    if (course) {
      where.courses = {
        some: {
          name: { contains: course, mode: "insensitive" },
        },
      };
    }

    // ─── Build ORDER BY clause ──────────────────────────
    let orderBy: Prisma.CollegeOrderByWithRelationInput[];

    switch (sort) {
      case "rating_desc":
        orderBy = [{ rating: "desc" }, { id: "asc" }];
        break;
      case "fees_asc":
        orderBy = [{ avgFees: "asc" }, { id: "asc" }];
        break;
      case "fees_desc":
        orderBy = [{ avgFees: "desc" }, { id: "asc" }];
        break;
      case "placement_desc":
        orderBy = [
          { placements: { averagePackage: "desc" } },
          { id: "asc" }
        ];
        break;
      case "name_asc":
        orderBy = [{ name: "asc" }, { id: "asc" }];
        break;
      case "name_desc":
        orderBy = [{ name: "desc" }, { id: "asc" }];
        break;
      default:
        orderBy = [{ rating: "desc" }, { id: "asc" }];
    }

    // ─── Count total matching records ───────────────────
    const total = await prisma.college.count({ where });

    // ─── Fetch colleges with cursor-based pagination ────
    const colleges = await prisma.college.findMany({
      where,
      orderBy,
      take: limit + 1, // Fetch one extra to determine hasMore
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
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
    });

    // Determine if there are more results
    const hasMore = colleges.length > limit;
    const results = hasMore ? colleges.slice(0, limit) : colleges;
    const nextCursor = hasMore ? results[results.length - 1]?.id : undefined;

    const meta: PaginationMeta = {
      total,
      page: cursor ? -1 : 1, // -1 indicates cursor-based pagination in use
      pageSize: limit,
      hasMore,
      cursor: nextCursor,
    };

    return NextResponse.json<ApiResponse<CollegeCard[]>>({
      success: true,
      data: results as CollegeCard[],
      meta,
    });
  } catch (error) {
    console.error("[API] GET /api/colleges error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: "Failed to fetch colleges. Please try again later.",
      },
      { status: 500 }
    );
  }
}
