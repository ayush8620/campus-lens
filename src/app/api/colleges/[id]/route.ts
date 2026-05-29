import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse, CollegeDetail } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Support both slug and id lookups
    const college = await prisma.college.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        courses: {
          select: {
            id: true,
            name: true,
            duration: true,
            fees: true,
            eligibility: true,
            seats: true,
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
        reviews: {
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
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!college) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "College not found.",
        },
        { status: 404 }
      );
    }

    // Serialize dates for ReviewInfo (createdAt -> string)
    const serializedCollege: CollegeDetail = {
      id: college.id,
      name: college.name,
      slug: college.slug,
      description: college.description,
      shortDescription: college.shortDescription,
      logo: college.logo,
      bannerImage: college.bannerImage,
      images: college.images,
      website: college.website,
      city: college.city,
      state: college.state,
      address: college.address,
      pincode: college.pincode,
      established: college.established,
      ownershipType: college.ownershipType,
      naacGrade: college.naacGrade,
      nirfRanking: college.nirfRanking,
      rating: college.rating,
      accreditation: college.accreditation,
      avgFees: college.avgFees,
      minFees: college.minFees,
      maxFees: college.maxFees,
      hostel: college.hostel,
      wifi: college.wifi,
      library: college.library,
      sports: college.sports,
      lab: college.lab,
      cafeteria: college.cafeteria,
      medicalFacility: college.medicalFacility,
      courses: college.courses,
      placements: college.placements,
      reviews: college.reviews.map((review) => ({
        ...review,
        createdAt: review.createdAt.toISOString(),
      })),
    };

    return NextResponse.json<ApiResponse<CollegeDetail>>({
      success: true,
      data: serializedCollege,
    });
  } catch (error) {
    console.error("[API] GET /api/colleges/[id] error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: "Failed to fetch college details. Please try again later.",
      },
      { status: 500 }
    );
  }
}
