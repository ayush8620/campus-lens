import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { saveCollegeSchema } from "@/validators/saved";
import type { ApiResponse, SavedCollegeItem, CollegeCard } from "@/types";

// ─── GET: Fetch user's saved colleges ───────────────────
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    const savedColleges = await prisma.savedCollege.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
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

    // Serialize response to match SavedCollegeItem type
    const data: SavedCollegeItem[] = savedColleges.map((saved) => ({
      id: saved.id,
      collegeId: saved.collegeId,
      createdAt: saved.createdAt.toISOString(),
      college: saved.college as CollegeCard,
    }));

    return NextResponse.json<ApiResponse<SavedCollegeItem[]>>({
      success: true,
      data,
    });
  } catch (error) {
    console.error("[API] GET /api/saved error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: "Failed to fetch saved colleges. Please try again later.",
      },
      { status: 500 }
    );
  }
}

// ─── POST: Save a college ───────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parseResult = saveCollegeSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: parseResult.error.issues.map((e) => e.message).join(", "),
        },
        { status: 400 }
      );
    }

    const { collegeId } = parseResult.data;

    // Verify the college exists
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

    // Upsert to prevent duplicate saves
    const savedCollege = await prisma.savedCollege.upsert({
      where: {
        userId_collegeId: { userId, collegeId },
      },
      create: { userId, collegeId },
      update: {}, // No-op on duplicate
      select: {
        id: true,
        collegeId: true,
        createdAt: true,
      },
    });

    return NextResponse.json<ApiResponse<{ id: string; collegeId: string; createdAt: string }>>(
      {
        success: true,
        data: {
          id: savedCollege.id,
          collegeId: savedCollege.collegeId,
          createdAt: savedCollege.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API] POST /api/saved error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: "Failed to save college. Please try again later.",
      },
      { status: 500 }
    );
  }
}

// ─── DELETE: Remove a saved college ─────────────────────
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const collegeId = searchParams.get("collegeId");

    if (!collegeId) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "Missing 'collegeId' query parameter.",
        },
        { status: 400 }
      );
    }

    // Delete the saved college entry
    await prisma.savedCollege.deleteMany({
      where: { userId, collegeId },
    });

    return NextResponse.json<ApiResponse<{ collegeId: string }>>({
      success: true,
      data: { collegeId },
    });
  } catch (error) {
    console.error("[API] DELETE /api/saved error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: "Failed to remove saved college. Please try again later.",
      },
      { status: 500 }
    );
  }
}
