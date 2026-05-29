import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse, CompareCollege } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get("ids");

    if (!idsParam) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "Missing 'ids' query parameter. Provide comma-separated college IDs.",
        },
        { status: 400 }
      );
    }

    const ids = idsParam
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    if (ids.length < 2 || ids.length > 3) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "Please provide 2 or 3 college IDs for comparison.",
        },
        { status: 400 }
      );
    }

    const colleges = await prisma.college.findMany({
      where: {
        id: { in: ids },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        bannerImage: true,
        city: true,
        state: true,
        rating: true,
        avgFees: true,
        established: true,
        ownershipType: true,
        naacGrade: true,
        nirfRanking: true,
        accreditation: true,
        hostel: true,
        wifi: true,
        library: true,
        sports: true,
        lab: true,
        cafeteria: true,
        medicalFacility: true,
        courses: {
          select: {
            name: true,
            fees: true,
            duration: true,
          },
        },
        placements: {
          select: {
            id: true,
            averagePackage: true,
            highestPackage: true,
            medianPackage: true,
            placementRate: true,
            topRecruiters: true,
            year: true,
          },
        },
      },
    });

    if (colleges.length < 2) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "One or more colleges not found. Please check the IDs.",
        },
        { status: 404 }
      );
    }

    // Preserve the order of IDs as requested
    const orderedColleges = ids
      .map((id) => colleges.find((c) => c.id === id))
      .filter((c): c is NonNullable<typeof c> => c !== undefined);

    return NextResponse.json<ApiResponse<CompareCollege[]>>({
      success: true,
      data: orderedColleges as CompareCollege[],
    });
  } catch (error) {
    console.error("[API] GET /api/compare error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: "Failed to fetch comparison data. Please try again later.",
      },
      { status: 500 }
    );
  }
}
