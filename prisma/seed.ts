import { PrismaClient, OwnershipType, NAACGrade, ExamType, Category } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, "");
}

function rand(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const IMAGES = [
  "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
  "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
  "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=800&q=80",
  "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80",
  "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80",
  "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=800&q=80",
  "https://images.unsplash.com/photo-1559135197-8a45ea74d367?w=800&q=80",
  "https://images.unsplash.com/photo-1574958269340-fa927503f3dd?w=800&q=80",
  "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=800&q=80",
];

const GALLERY = [
  "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=600&q=80",
  "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=600&q=80",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80",
  "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=600&q=80",
  "https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80",
];

const RECRUITERS_POOL = [
  "Google", "Microsoft", "Amazon", "Apple", "Meta", "Goldman Sachs", "JP Morgan",
  "Deloitte", "McKinsey", "Infosys", "TCS", "Wipro", "Flipkart", "Uber",
  "Adobe", "Samsung", "Intel", "Oracle", "PayPal", "Qualcomm", "Nvidia",
  "Morgan Stanley", "Cisco", "IBM", "Accenture", "Capgemini", "HCL",
  "Zomato", "Paytm", "PhonePe", "Razorpay", "Ola", "Swiggy",
];

const REVIEW_NAMES = [
  "Aarav S.", "Priya M.", "Rohan K.", "Sneha D.", "Arjun P.", "Kavya R.",
  "Vikram N.", "Ananya G.", "Rahul T.", "Divya L.", "Aditya V.", "Meera J.",
  "Karthik B.", "Pooja W.", "Nikhil C.", "Riya A.", "Sameer H.", "Tanvi F.",
];

const REVIEW_TITLES = [
  "Great overall experience", "Excellent placements", "Good academics",
  "Wonderful campus life", "Decent education", "Value for money",
  "Could be better", "Amazing faculty", "Best years of my life",
  "Solid infrastructure", "Good exposure", "Supportive environment",
];

interface TierConfig {
  feeRange: [number, number];
  ratingRange: [number, number];
  avgPackage: [number, number];
  highestPackage: [number, number];
  placementRate: [number, number];
  reviewRating: [number, number];
  recruitersCount: [number, number];
  naacGrades: NAACGrade[];
  exams: ExamType[];
  cutoffRange: [number, number]; // closing rank range
}

const TIERS: Record<string, TierConfig> = {
  IIT: {
    feeRange: [200000, 300000], ratingRange: [4.2, 4.8],
    avgPackage: [15, 28], highestPackage: [50, 200],
    placementRate: [85, 98], reviewRating: [4.0, 5.0],
    recruitersCount: [8, 15], naacGrades: [NAACGrade.A_PLUS_PLUS, NAACGrade.A_PLUS],
    exams: [ExamType.JEE_ADVANCED], cutoffRange: [100, 15000],
  },
  NIT: {
    feeRange: [150000, 250000], ratingRange: [3.8, 4.5],
    avgPackage: [8, 16], highestPackage: [30, 80],
    placementRate: [75, 95], reviewRating: [3.5, 4.8],
    recruitersCount: [6, 12], naacGrades: [NAACGrade.A_PLUS, NAACGrade.A],
    exams: [ExamType.JEE_MAIN], cutoffRange: [1000, 60000],
  },
  IIIT: {
    feeRange: [100000, 300000], ratingRange: [3.5, 4.4],
    avgPackage: [8, 20], highestPackage: [25, 100],
    placementRate: [70, 95], reviewRating: [3.5, 4.7],
    recruitersCount: [5, 10], naacGrades: [NAACGrade.A_PLUS, NAACGrade.A],
    exams: [ExamType.JEE_MAIN], cutoffRange: [2000, 45000],
  },
  AKTU: {
    feeRange: [80000, 200000], ratingRange: [2.8, 3.8],
    avgPackage: [3, 8], highestPackage: [10, 30],
    placementRate: [40, 75], reviewRating: [2.5, 4.0],
    recruitersCount: [3, 8], naacGrades: [NAACGrade.B_PLUS, NAACGrade.B, NAACGrade.A],
    exams: [ExamType.AKTU], cutoffRange: [5000, 200000],
  },
  PRIVATE_TOP: {
    feeRange: [300000, 1500000], ratingRange: [3.5, 4.6],
    avgPackage: [6, 18], highestPackage: [20, 80],
    placementRate: [60, 95], reviewRating: [3.0, 4.5],
    recruitersCount: [5, 12], naacGrades: [NAACGrade.A_PLUS, NAACGrade.A, NAACGrade.A_PLUS_PLUS],
    exams: [ExamType.JEE_MAIN, ExamType.BITSAT, ExamType.VITEEE],
    cutoffRange: [5000, 100000],
  },
  PRIVATE_MID: {
    feeRange: [150000, 600000], ratingRange: [2.5, 3.5],
    avgPackage: [3, 7], highestPackage: [8, 25],
    placementRate: [40, 70], reviewRating: [2.5, 3.8],
    recruitersCount: [3, 7], naacGrades: [NAACGrade.B_PLUS, NAACGrade.B, NAACGrade.A],
    exams: [ExamType.JEE_MAIN, ExamType.STATE_CET],
    cutoffRange: [20000, 300000],
  },
  GOVT_OTHER: {
    feeRange: [50000, 200000], ratingRange: [3.5, 4.3],
    avgPackage: [6, 14], highestPackage: [15, 50],
    placementRate: [65, 90], reviewRating: [3.5, 4.5],
    recruitersCount: [5, 10], naacGrades: [NAACGrade.A_PLUS, NAACGrade.A],
    exams: [ExamType.JEE_MAIN, ExamType.STATE_CET],
    cutoffRange: [3000, 80000],
  },
};

const COURSES_POOL = [
  { name: "Computer Science & Engineering", seats: [60, 180] },
  { name: "Electronics & Communication Engineering", seats: [60, 120] },
  { name: "Electrical Engineering", seats: [40, 90] },
  { name: "Mechanical Engineering", seats: [60, 120] },
  { name: "Civil Engineering", seats: [40, 90] },
  { name: "Information Technology", seats: [60, 120] },
  { name: "Chemical Engineering", seats: [30, 60] },
  { name: "Biotechnology", seats: [30, 60] },
];

function generateCourses(tier: TierConfig, count: number) {
  const selected = COURSES_POOL.sort(() => 0.5 - Math.random()).slice(0, count);
  return selected.map((c) => ({
    name: c.name,
    duration: "4 Years",
    fees: rand(tier.feeRange[0], tier.feeRange[1]),
    eligibility: "10+2 with PCM, min 75% aggregate. Valid entrance exam score required.",
    seats: randInt(c.seats[0], c.seats[1]),
  }));
}

function generatePlacements(tier: TierConfig) {
  const avg = rand(tier.avgPackage[0], tier.avgPackage[1]);
  return {
    averagePackage: avg,
    highestPackage: rand(tier.highestPackage[0], tier.highestPackage[1]),
    medianPackage: rand(avg * 0.6, avg * 0.9),
    placementRate: rand(tier.placementRate[0], tier.placementRate[1]),
    topRecruiters: RECRUITERS_POOL.sort(() => 0.5 - Math.random()).slice(0, randInt(tier.recruitersCount[0], tier.recruitersCount[1])),
    year: 2024,
  };
}

function generateReviews(tier: TierConfig, count: number) {
  return Array.from({ length: count }, () => ({
    userId: `user_${Math.random().toString(36).slice(2, 10)}`,
    userName: pick(REVIEW_NAMES),
    rating: rand(tier.reviewRating[0], tier.reviewRating[1]),
    title: pick(REVIEW_TITLES),
    content: "The college provides a great learning environment with excellent faculty and modern infrastructure. Campus life is vibrant with numerous clubs and activities. The placement cell is very active and brings top companies for recruitment.",
    pros: pick(["Great faculty", "Good placements", "Beautiful campus", "Strong alumni network", "Modern labs", "Excellent library"]),
    cons: pick(["Strict rules", "Food quality", "Far from city", "Expensive fees", "Limited hostel seats", "Average sports facilities"]),
  }));
}

function generateCutoffs(tier: TierConfig, branches: string[]) {
  const cutoffs: any[] = [];
  for (const exam of tier.exams) {
    for (const branch of branches.slice(0, 4)) {
      for (const category of [Category.GENERAL, Category.OBC, Category.SC, Category.ST, Category.EWS]) {
        const base = randInt(tier.cutoffRange[0], tier.cutoffRange[1]);
        const categoryMultiplier = category === Category.GENERAL ? 1 : category === Category.OBC ? 1.3 : category === Category.EWS ? 1.2 : 1.8;
        const opening = Math.max(1, Math.floor(base * 0.7));
        const closing = Math.floor(base * categoryMultiplier);
        cutoffs.push({
          exam, year: 2024, category, branch,
          openingRank: opening, closingRank: closing,
        });
      }
    }
  }
  return cutoffs;
}

// ─── College Data ─────────────────────────────────────

interface CollegeDef {
  name: string; city: string; state: string; established: number;
  ownershipType: OwnershipType; tier: string; nirfRanking?: number;
}

const IITs: CollegeDef[] = [
  { name: "Indian Institute of Technology Bombay", city: "Mumbai", state: "Maharashtra", established: 1958, ownershipType: OwnershipType.GOVERNMENT, tier: "IIT", nirfRanking: 3 },
  { name: "Indian Institute of Technology Delhi", city: "New Delhi", state: "Delhi", established: 1961, ownershipType: OwnershipType.GOVERNMENT, tier: "IIT", nirfRanking: 2 },
  { name: "Indian Institute of Technology Madras", city: "Chennai", state: "Tamil Nadu", established: 1959, ownershipType: OwnershipType.GOVERNMENT, tier: "IIT", nirfRanking: 1 },
  { name: "Indian Institute of Technology Kanpur", city: "Kanpur", state: "Uttar Pradesh", established: 1959, ownershipType: OwnershipType.GOVERNMENT, tier: "IIT", nirfRanking: 4 },
  { name: "Indian Institute of Technology Kharagpur", city: "Kharagpur", state: "West Bengal", established: 1951, ownershipType: OwnershipType.GOVERNMENT, tier: "IIT", nirfRanking: 5 },
  { name: "Indian Institute of Technology Roorkee", city: "Roorkee", state: "Uttarakhand", established: 1847, ownershipType: OwnershipType.GOVERNMENT, tier: "IIT", nirfRanking: 6 },
  { name: "Indian Institute of Technology Guwahati", city: "Guwahati", state: "Assam", established: 1994, ownershipType: OwnershipType.GOVERNMENT, tier: "IIT", nirfRanking: 7 },
  { name: "Indian Institute of Technology Hyderabad", city: "Hyderabad", state: "Telangana", established: 2008, ownershipType: OwnershipType.GOVERNMENT, tier: "IIT", nirfRanking: 8 },
  { name: "Indian Institute of Technology Indore", city: "Indore", state: "Madhya Pradesh", established: 2009, ownershipType: OwnershipType.GOVERNMENT, tier: "IIT", nirfRanking: 11 },
  { name: "Indian Institute of Technology BHU Varanasi", city: "Varanasi", state: "Uttar Pradesh", established: 1919, ownershipType: OwnershipType.GOVERNMENT, tier: "IIT", nirfRanking: 10 },
  { name: "Indian Institute of Technology Dhanbad", city: "Dhanbad", state: "Jharkhand", established: 1926, ownershipType: OwnershipType.GOVERNMENT, tier: "IIT", nirfRanking: 12 },
  { name: "Indian Institute of Technology Gandhinagar", city: "Gandhinagar", state: "Gujarat", established: 2008, ownershipType: OwnershipType.GOVERNMENT, tier: "IIT", nirfRanking: 16 },
  { name: "Indian Institute of Technology Ropar", city: "Rupnagar", state: "Punjab", established: 2008, ownershipType: OwnershipType.GOVERNMENT, tier: "IIT", nirfRanking: 20 },
  { name: "Indian Institute of Technology Patna", city: "Patna", state: "Bihar", established: 2008, ownershipType: OwnershipType.GOVERNMENT, tier: "IIT", nirfRanking: 23 },
  { name: "Indian Institute of Technology Bhubaneswar", city: "Bhubaneswar", state: "Odisha", established: 2008, ownershipType: OwnershipType.GOVERNMENT, tier: "IIT", nirfRanking: 22 },
  { name: "Indian Institute of Technology Mandi", city: "Mandi", state: "Himachal Pradesh", established: 2009, ownershipType: OwnershipType.GOVERNMENT, tier: "IIT", nirfRanking: 25 },
  { name: "Indian Institute of Technology Jodhpur", city: "Jodhpur", state: "Rajasthan", established: 2008, ownershipType: OwnershipType.GOVERNMENT, tier: "IIT", nirfRanking: 28 },
  { name: "Indian Institute of Technology Tirupati", city: "Tirupati", state: "Andhra Pradesh", established: 2015, ownershipType: OwnershipType.GOVERNMENT, tier: "IIT", nirfRanking: 40 },
  { name: "Indian Institute of Technology Palakkad", city: "Palakkad", state: "Kerala", established: 2015, ownershipType: OwnershipType.GOVERNMENT, tier: "IIT", nirfRanking: 48 },
  { name: "Indian Institute of Technology Goa", city: "Goa", state: "Goa", established: 2016, ownershipType: OwnershipType.GOVERNMENT, tier: "IIT", nirfRanking: 55 },
  { name: "Indian Institute of Technology Jammu", city: "Jammu", state: "Jammu and Kashmir", established: 2016, ownershipType: OwnershipType.GOVERNMENT, tier: "IIT", nirfRanking: 60 },
  { name: "Indian Institute of Technology Dharwad", city: "Dharwad", state: "Karnataka", established: 2016, ownershipType: OwnershipType.GOVERNMENT, tier: "IIT", nirfRanking: 65 },
  { name: "Indian Institute of Technology Bhilai", city: "Bhilai", state: "Chhattisgarh", established: 2016, ownershipType: OwnershipType.GOVERNMENT, tier: "IIT", nirfRanking: 70 },
];

const NITs: CollegeDef[] = [
  { name: "National Institute of Technology Tiruchirappalli", city: "Tiruchirappalli", state: "Tamil Nadu", established: 1964, ownershipType: OwnershipType.GOVERNMENT, tier: "NIT", nirfRanking: 9 },
  { name: "National Institute of Technology Surathkal", city: "Surathkal", state: "Karnataka", established: 1960, ownershipType: OwnershipType.GOVERNMENT, tier: "NIT", nirfRanking: 13 },
  { name: "National Institute of Technology Warangal", city: "Warangal", state: "Telangana", established: 1959, ownershipType: OwnershipType.GOVERNMENT, tier: "NIT", nirfRanking: 14 },
  { name: "National Institute of Technology Rourkela", city: "Rourkela", state: "Odisha", established: 1961, ownershipType: OwnershipType.GOVERNMENT, tier: "NIT", nirfRanking: 15 },
  { name: "National Institute of Technology Calicut", city: "Calicut", state: "Kerala", established: 1961, ownershipType: OwnershipType.GOVERNMENT, tier: "NIT", nirfRanking: 18 },
  { name: "Visvesvaraya National Institute of Technology", city: "Nagpur", state: "Maharashtra", established: 1960, ownershipType: OwnershipType.GOVERNMENT, tier: "NIT", nirfRanking: 19 },
  { name: "Motilal Nehru National Institute of Technology", city: "Allahabad", state: "Uttar Pradesh", established: 1961, ownershipType: OwnershipType.GOVERNMENT, tier: "NIT", nirfRanking: 21 },
  { name: "National Institute of Technology Durgapur", city: "Durgapur", state: "West Bengal", established: 1960, ownershipType: OwnershipType.GOVERNMENT, tier: "NIT", nirfRanking: 26 },
  { name: "National Institute of Technology Jamshedpur", city: "Jamshedpur", state: "Jharkhand", established: 1960, ownershipType: OwnershipType.GOVERNMENT, tier: "NIT", nirfRanking: 29 },
  { name: "National Institute of Technology Kurukshetra", city: "Kurukshetra", state: "Haryana", established: 1963, ownershipType: OwnershipType.GOVERNMENT, tier: "NIT", nirfRanking: 31 },
  { name: "Sardar Vallabhbhai National Institute of Technology", city: "Surat", state: "Gujarat", established: 1961, ownershipType: OwnershipType.GOVERNMENT, tier: "NIT", nirfRanking: 27 },
  { name: "Malaviya National Institute of Technology", city: "Jaipur", state: "Rajasthan", established: 1963, ownershipType: OwnershipType.GOVERNMENT, tier: "NIT", nirfRanking: 30 },
  { name: "Maulana Azad National Institute of Technology", city: "Bhopal", state: "Madhya Pradesh", established: 1960, ownershipType: OwnershipType.GOVERNMENT, tier: "NIT", nirfRanking: 33 },
  { name: "National Institute of Technology Silchar", city: "Silchar", state: "Assam", established: 1967, ownershipType: OwnershipType.GOVERNMENT, tier: "NIT", nirfRanking: 41 },
  { name: "National Institute of Technology Hamirpur", city: "Hamirpur", state: "Himachal Pradesh", established: 1986, ownershipType: OwnershipType.GOVERNMENT, tier: "NIT", nirfRanking: 44 },
  { name: "National Institute of Technology Jalandhar", city: "Jalandhar", state: "Punjab", established: 1987, ownershipType: OwnershipType.GOVERNMENT, tier: "NIT", nirfRanking: 46 },
  { name: "National Institute of Technology Patna", city: "Patna", state: "Bihar", established: 2004, ownershipType: OwnershipType.GOVERNMENT, tier: "NIT", nirfRanking: 42 },
  { name: "National Institute of Technology Raipur", city: "Raipur", state: "Chhattisgarh", established: 1956, ownershipType: OwnershipType.GOVERNMENT, tier: "NIT", nirfRanking: 49 },
  { name: "National Institute of Technology Agartala", city: "Agartala", state: "Tripura", established: 1965, ownershipType: OwnershipType.GOVERNMENT, tier: "NIT", nirfRanking: 62 },
  { name: "National Institute of Technology Meghalaya", city: "Shillong", state: "Meghalaya", established: 2010, ownershipType: OwnershipType.GOVERNMENT, tier: "NIT", nirfRanking: 75 },
  { name: "National Institute of Technology Nagaland", city: "Dimapur", state: "Nagaland", established: 2010, ownershipType: OwnershipType.GOVERNMENT, tier: "NIT", nirfRanking: 80 },
  { name: "National Institute of Technology Manipur", city: "Imphal", state: "Manipur", established: 2010, ownershipType: OwnershipType.GOVERNMENT, tier: "NIT", nirfRanking: 82 },
  { name: "National Institute of Technology Mizoram", city: "Aizawl", state: "Mizoram", established: 2010, ownershipType: OwnershipType.GOVERNMENT, tier: "NIT", nirfRanking: 85 },
  { name: "National Institute of Technology Sikkim", city: "Ravangla", state: "Sikkim", established: 2010, ownershipType: OwnershipType.GOVERNMENT, tier: "NIT", nirfRanking: 88 },
  { name: "National Institute of Technology Arunachal Pradesh", city: "Yupia", state: "Arunachal Pradesh", established: 2010, ownershipType: OwnershipType.GOVERNMENT, tier: "NIT", nirfRanking: 90 },
  { name: "National Institute of Technology Goa", city: "Ponda", state: "Goa", established: 2010, ownershipType: OwnershipType.GOVERNMENT, tier: "NIT", nirfRanking: 68 },
  { name: "National Institute of Technology Puducherry", city: "Karaikal", state: "Puducherry", established: 2010, ownershipType: OwnershipType.GOVERNMENT, tier: "NIT", nirfRanking: 72 },
  { name: "National Institute of Technology Uttarakhand", city: "Srinagar", state: "Uttarakhand", established: 2009, ownershipType: OwnershipType.GOVERNMENT, tier: "NIT", nirfRanking: 78 },
  { name: "National Institute of Technology Srinagar", city: "Srinagar", state: "Jammu and Kashmir", established: 1960, ownershipType: OwnershipType.GOVERNMENT, tier: "NIT", nirfRanking: 52 },
  { name: "National Institute of Technology Karnataka", city: "Surathkal", state: "Karnataka", established: 1960, ownershipType: OwnershipType.GOVERNMENT, tier: "NIT", nirfRanking: 13 },
  { name: "National Institute of Technology Andhra Pradesh", city: "Tadepalligudem", state: "Andhra Pradesh", established: 2015, ownershipType: OwnershipType.GOVERNMENT, tier: "NIT", nirfRanking: 92 },
];

const IIITs: CollegeDef[] = [
  { name: "IIIT Hyderabad", city: "Hyderabad", state: "Telangana", established: 1998, ownershipType: OwnershipType.PUBLIC_PRIVATE, tier: "IIIT", nirfRanking: 35 },
  { name: "IIIT Allahabad", city: "Allahabad", state: "Uttar Pradesh", established: 1999, ownershipType: OwnershipType.GOVERNMENT, tier: "IIIT", nirfRanking: 50 },
  { name: "IIIT Bangalore", city: "Bangalore", state: "Karnataka", established: 1999, ownershipType: OwnershipType.PUBLIC_PRIVATE, tier: "IIIT", nirfRanking: 38 },
  { name: "IIIT Delhi", city: "New Delhi", state: "Delhi", established: 2008, ownershipType: OwnershipType.GOVERNMENT, tier: "IIIT", nirfRanking: 36 },
  { name: "ABV-IIIT Gwalior", city: "Gwalior", state: "Madhya Pradesh", established: 1997, ownershipType: OwnershipType.GOVERNMENT, tier: "IIIT", nirfRanking: 56 },
  { name: "IIIT Jabalpur", city: "Jabalpur", state: "Madhya Pradesh", established: 2005, ownershipType: OwnershipType.PUBLIC_PRIVATE, tier: "IIIT", nirfRanking: 63 },
  { name: "IIIT Kancheepuram", city: "Chennai", state: "Tamil Nadu", established: 2007, ownershipType: OwnershipType.PUBLIC_PRIVATE, tier: "IIIT", nirfRanking: 66 },
  { name: "IIIT Guwahati", city: "Guwahati", state: "Assam", established: 2013, ownershipType: OwnershipType.PUBLIC_PRIVATE, tier: "IIIT", nirfRanking: 83 },
  { name: "IIIT Vadodara", city: "Vadodara", state: "Gujarat", established: 2013, ownershipType: OwnershipType.PUBLIC_PRIVATE, tier: "IIIT", nirfRanking: 86 },
  { name: "IIIT Kota", city: "Kota", state: "Rajasthan", established: 2013, ownershipType: OwnershipType.PUBLIC_PRIVATE, tier: "IIIT", nirfRanking: 89 },
  { name: "IIIT Sri City", city: "Chittoor", state: "Andhra Pradesh", established: 2013, ownershipType: OwnershipType.PUBLIC_PRIVATE, tier: "IIIT", nirfRanking: 73 },
  { name: "IIIT Lucknow", city: "Lucknow", state: "Uttar Pradesh", established: 2015, ownershipType: OwnershipType.PUBLIC_PRIVATE, tier: "IIIT", nirfRanking: 91 },
  { name: "IIIT Dharwad", city: "Dharwad", state: "Karnataka", established: 2015, ownershipType: OwnershipType.PUBLIC_PRIVATE, tier: "IIIT", nirfRanking: 93 },
  { name: "IIIT Kalyani", city: "Kalyani", state: "West Bengal", established: 2014, ownershipType: OwnershipType.PUBLIC_PRIVATE, tier: "IIIT", nirfRanking: 95 },
  { name: "IIIT Sonepat", city: "Sonepat", state: "Haryana", established: 2014, ownershipType: OwnershipType.PUBLIC_PRIVATE, tier: "IIIT", nirfRanking: 96 },
  { name: "IIIT Una", city: "Una", state: "Himachal Pradesh", established: 2014, ownershipType: OwnershipType.PUBLIC_PRIVATE, tier: "IIIT", nirfRanking: 97 },
  { name: "IIIT Nagpur", city: "Nagpur", state: "Maharashtra", established: 2016, ownershipType: OwnershipType.PUBLIC_PRIVATE, tier: "IIIT", nirfRanking: 98 },
  { name: "IIIT Pune", city: "Pune", state: "Maharashtra", established: 2016, ownershipType: OwnershipType.PUBLIC_PRIVATE, tier: "IIIT", nirfRanking: 99 },
  { name: "IIIT Ranchi", city: "Ranchi", state: "Jharkhand", established: 2016, ownershipType: OwnershipType.PUBLIC_PRIVATE, tier: "IIIT", nirfRanking: 100 },
  { name: "IIIT Surat", city: "Surat", state: "Gujarat", established: 2017, ownershipType: OwnershipType.PUBLIC_PRIVATE, tier: "IIIT" },
  { name: "IIIT Bhopal", city: "Bhopal", state: "Madhya Pradesh", established: 2017, ownershipType: OwnershipType.PUBLIC_PRIVATE, tier: "IIIT" },
  { name: "IIIT Bhagalpur", city: "Bhagalpur", state: "Bihar", established: 2017, ownershipType: OwnershipType.PUBLIC_PRIVATE, tier: "IIIT" },
  { name: "IIIT Agartala", city: "Agartala", state: "Tripura", established: 2018, ownershipType: OwnershipType.PUBLIC_PRIVATE, tier: "IIIT" },
  { name: "IIIT Raichur", city: "Raichur", state: "Karnataka", established: 2019, ownershipType: OwnershipType.PUBLIC_PRIVATE, tier: "IIIT" },
  { name: "IIIT Manipur", city: "Imphal", state: "Manipur", established: 2015, ownershipType: OwnershipType.PUBLIC_PRIVATE, tier: "IIIT" },
];

const AKTU_COLLEGES: CollegeDef[] = [
  { name: "KIET Group of Institutions", city: "Ghaziabad", state: "Uttar Pradesh", established: 1998, ownershipType: OwnershipType.PRIVATE, tier: "AKTU" },
  { name: "ABES Engineering College", city: "Ghaziabad", state: "Uttar Pradesh", established: 2000, ownershipType: OwnershipType.PRIVATE, tier: "AKTU" },
  { name: "BIET Jhansi", city: "Jhansi", state: "Uttar Pradesh", established: 1986, ownershipType: OwnershipType.GOVERNMENT, tier: "AKTU" },
  { name: "GL Bajaj Institute of Technology", city: "Greater Noida", state: "Uttar Pradesh", established: 2005, ownershipType: OwnershipType.PRIVATE, tier: "AKTU" },
  { name: "AKGEC Ghaziabad", city: "Ghaziabad", state: "Uttar Pradesh", established: 1998, ownershipType: OwnershipType.PRIVATE, tier: "AKTU" },
  { name: "IMS Engineering College", city: "Ghaziabad", state: "Uttar Pradesh", established: 2002, ownershipType: OwnershipType.PRIVATE, tier: "AKTU" },
  { name: "KNIT Sultanpur", city: "Sultanpur", state: "Uttar Pradesh", established: 1977, ownershipType: OwnershipType.GOVERNMENT, tier: "AKTU" },
  { name: "MMMUT Gorakhpur", city: "Gorakhpur", state: "Uttar Pradesh", established: 1962, ownershipType: OwnershipType.GOVERNMENT, tier: "AKTU" },
  { name: "HBTU Kanpur", city: "Kanpur", state: "Uttar Pradesh", established: 1921, ownershipType: OwnershipType.GOVERNMENT, tier: "AKTU" },
  { name: "JSS Academy of Technical Education", city: "Noida", state: "Uttar Pradesh", established: 1998, ownershipType: OwnershipType.PRIVATE, tier: "AKTU" },
  { name: "ITS Engineering College", city: "Greater Noida", state: "Uttar Pradesh", established: 2006, ownershipType: OwnershipType.PRIVATE, tier: "AKTU" },
  { name: "Galgotias College of Engineering", city: "Greater Noida", state: "Uttar Pradesh", established: 2000, ownershipType: OwnershipType.PRIVATE, tier: "AKTU" },
  { name: "Krishna Institute of Engineering", city: "Ghaziabad", state: "Uttar Pradesh", established: 2001, ownershipType: OwnershipType.PRIVATE, tier: "AKTU" },
  { name: "BBDNITM Lucknow", city: "Lucknow", state: "Uttar Pradesh", established: 2001, ownershipType: OwnershipType.PRIVATE, tier: "AKTU" },
  { name: "Raj Kumar Goel Institute of Technology", city: "Ghaziabad", state: "Uttar Pradesh", established: 2000, ownershipType: OwnershipType.PRIVATE, tier: "AKTU" },
  { name: "NIET Greater Noida", city: "Greater Noida", state: "Uttar Pradesh", established: 2001, ownershipType: OwnershipType.PRIVATE, tier: "AKTU" },
  { name: "Ajay Kumar Garg Engineering College", city: "Ghaziabad", state: "Uttar Pradesh", established: 1998, ownershipType: OwnershipType.PRIVATE, tier: "AKTU" },
  { name: "RKGIT Ghaziabad", city: "Ghaziabad", state: "Uttar Pradesh", established: 2000, ownershipType: OwnershipType.PRIVATE, tier: "AKTU" },
  { name: "Shri Ram Murti Smarak College", city: "Bareilly", state: "Uttar Pradesh", established: 1996, ownershipType: OwnershipType.PRIVATE, tier: "AKTU" },
  { name: "United Institute of Technology", city: "Allahabad", state: "Uttar Pradesh", established: 2003, ownershipType: OwnershipType.PRIVATE, tier: "AKTU" },
];

const PRIVATE_COLLEGES: CollegeDef[] = [
  { name: "BITS Pilani", city: "Pilani", state: "Rajasthan", established: 1964, ownershipType: OwnershipType.DEEMED, tier: "PRIVATE_TOP", nirfRanking: 17 },
  { name: "VIT Vellore", city: "Vellore", state: "Tamil Nadu", established: 1984, ownershipType: OwnershipType.DEEMED, tier: "PRIVATE_TOP", nirfRanking: 24 },
  { name: "SRM Institute of Science and Technology", city: "Chennai", state: "Tamil Nadu", established: 1985, ownershipType: OwnershipType.DEEMED, tier: "PRIVATE_TOP", nirfRanking: 32 },
  { name: "Manipal Institute of Technology", city: "Manipal", state: "Karnataka", established: 1957, ownershipType: OwnershipType.DEEMED, tier: "PRIVATE_TOP", nirfRanking: 34 },
  { name: "Thapar Institute of Engineering", city: "Patiala", state: "Punjab", established: 1956, ownershipType: OwnershipType.DEEMED, tier: "PRIVATE_TOP", nirfRanking: 37 },
  { name: "BITS Goa", city: "Goa", state: "Goa", established: 2004, ownershipType: OwnershipType.DEEMED, tier: "PRIVATE_TOP", nirfRanking: 39 },
  { name: "BITS Hyderabad", city: "Hyderabad", state: "Telangana", established: 2008, ownershipType: OwnershipType.DEEMED, tier: "PRIVATE_TOP", nirfRanking: 43 },
  { name: "Amity University Noida", city: "Noida", state: "Uttar Pradesh", established: 2005, ownershipType: OwnershipType.PRIVATE, tier: "PRIVATE_TOP", nirfRanking: 45 },
  { name: "LPU Jalandhar", city: "Jalandhar", state: "Punjab", established: 2005, ownershipType: OwnershipType.PRIVATE, tier: "PRIVATE_MID" },
  { name: "Chandigarh University", city: "Mohali", state: "Punjab", established: 2012, ownershipType: OwnershipType.PRIVATE, tier: "PRIVATE_TOP", nirfRanking: 47 },
  { name: "Shiv Nadar University", city: "Greater Noida", state: "Uttar Pradesh", established: 2011, ownershipType: OwnershipType.PRIVATE, tier: "PRIVATE_TOP", nirfRanking: 51 },
  { name: "PES University", city: "Bangalore", state: "Karnataka", established: 1972, ownershipType: OwnershipType.PRIVATE, tier: "PRIVATE_TOP", nirfRanking: 53 },
  { name: "RV College of Engineering", city: "Bangalore", state: "Karnataka", established: 1963, ownershipType: OwnershipType.PRIVATE, tier: "PRIVATE_TOP", nirfRanking: 54 },
  { name: "Kalinga Institute of Industrial Technology", city: "Bhubaneswar", state: "Odisha", established: 1997, ownershipType: OwnershipType.DEEMED, tier: "PRIVATE_TOP", nirfRanking: 57 },
  { name: "Symbiosis Institute of Technology", city: "Pune", state: "Maharashtra", established: 2008, ownershipType: OwnershipType.DEEMED, tier: "PRIVATE_TOP" },
  { name: "BMS College of Engineering", city: "Bangalore", state: "Karnataka", established: 1946, ownershipType: OwnershipType.PRIVATE, tier: "PRIVATE_TOP", nirfRanking: 58 },
  { name: "Galgotias University", city: "Greater Noida", state: "Uttar Pradesh", established: 2011, ownershipType: OwnershipType.PRIVATE, tier: "PRIVATE_MID" },
  { name: "Chitkara University", city: "Rajpura", state: "Punjab", established: 2002, ownershipType: OwnershipType.PRIVATE, tier: "PRIVATE_MID" },
  { name: "Bennett University", city: "Greater Noida", state: "Uttar Pradesh", established: 2016, ownershipType: OwnershipType.PRIVATE, tier: "PRIVATE_TOP" },
  { name: "UPES Dehradun", city: "Dehradun", state: "Uttarakhand", established: 2003, ownershipType: OwnershipType.PRIVATE, tier: "PRIVATE_MID" },
  { name: "SRM University AP", city: "Amaravati", state: "Andhra Pradesh", established: 2017, ownershipType: OwnershipType.PRIVATE, tier: "PRIVATE_MID" },
  { name: "Woxsen University", city: "Hyderabad", state: "Telangana", established: 2014, ownershipType: OwnershipType.PRIVATE, tier: "PRIVATE_MID" },
  { name: "Karunya Institute of Technology", city: "Coimbatore", state: "Tamil Nadu", established: 1986, ownershipType: OwnershipType.DEEMED, tier: "PRIVATE_MID" },
  { name: "Vel Tech University", city: "Chennai", state: "Tamil Nadu", established: 1997, ownershipType: OwnershipType.DEEMED, tier: "PRIVATE_MID" },
  { name: "KLE Technological University", city: "Hubballi", state: "Karnataka", established: 1947, ownershipType: OwnershipType.PRIVATE, tier: "PRIVATE_MID" },
  { name: "MIT Pune", city: "Pune", state: "Maharashtra", established: 1983, ownershipType: OwnershipType.PRIVATE, tier: "PRIVATE_TOP" },
  { name: "Nirma University", city: "Ahmedabad", state: "Gujarat", established: 2003, ownershipType: OwnershipType.PRIVATE, tier: "PRIVATE_TOP", nirfRanking: 59 },
  { name: "Dayananda Sagar College of Engineering", city: "Bangalore", state: "Karnataka", established: 1979, ownershipType: OwnershipType.PRIVATE, tier: "PRIVATE_MID" },
  { name: "MS Ramaiah Institute of Technology", city: "Bangalore", state: "Karnataka", established: 1962, ownershipType: OwnershipType.PRIVATE, tier: "PRIVATE_TOP", nirfRanking: 61 },
  { name: "New Horizon College of Engineering", city: "Bangalore", state: "Karnataka", established: 2001, ownershipType: OwnershipType.PRIVATE, tier: "PRIVATE_MID" },
];

const GOVT_OTHER: CollegeDef[] = [
  { name: "Delhi Technological University", city: "New Delhi", state: "Delhi", established: 1941, ownershipType: OwnershipType.GOVERNMENT, tier: "GOVT_OTHER", nirfRanking: 33 },
  { name: "Netaji Subhas University of Technology", city: "New Delhi", state: "Delhi", established: 1983, ownershipType: OwnershipType.GOVERNMENT, tier: "GOVT_OTHER", nirfRanking: 36 },
  { name: "Jadavpur University", city: "Kolkata", state: "West Bengal", established: 1955, ownershipType: OwnershipType.GOVERNMENT, tier: "GOVT_OTHER", nirfRanking: 16 },
  { name: "College of Engineering Pune", city: "Pune", state: "Maharashtra", established: 1854, ownershipType: OwnershipType.GOVERNMENT, tier: "GOVT_OTHER", nirfRanking: 25 },
  { name: "Anna University", city: "Chennai", state: "Tamil Nadu", established: 1978, ownershipType: OwnershipType.GOVERNMENT, tier: "GOVT_OTHER", nirfRanking: 20 },
  { name: "Jamia Millia Islamia", city: "New Delhi", state: "Delhi", established: 1920, ownershipType: OwnershipType.GOVERNMENT, tier: "GOVT_OTHER", nirfRanking: 22 },
  { name: "PSG College of Technology", city: "Coimbatore", state: "Tamil Nadu", established: 1951, ownershipType: OwnershipType.AUTONOMOUS, tier: "GOVT_OTHER", nirfRanking: 40 },
  { name: "IIEST Shibpur", city: "Howrah", state: "West Bengal", established: 1856, ownershipType: OwnershipType.GOVERNMENT, tier: "GOVT_OTHER", nirfRanking: 42 },
  { name: "Cochin University of Science and Technology", city: "Kochi", state: "Kerala", established: 1971, ownershipType: OwnershipType.GOVERNMENT, tier: "GOVT_OTHER" },
  { name: "University Visvesvaraya College of Engineering", city: "Bangalore", state: "Karnataka", established: 1917, ownershipType: OwnershipType.GOVERNMENT, tier: "GOVT_OTHER" },
  { name: "Government College of Technology Coimbatore", city: "Coimbatore", state: "Tamil Nadu", established: 1945, ownershipType: OwnershipType.GOVERNMENT, tier: "GOVT_OTHER" },
  { name: "Andhra University College of Engineering", city: "Visakhapatnam", state: "Andhra Pradesh", established: 1933, ownershipType: OwnershipType.GOVERNMENT, tier: "GOVT_OTHER" },
  { name: "Osmania University", city: "Hyderabad", state: "Telangana", established: 1918, ownershipType: OwnershipType.GOVERNMENT, tier: "GOVT_OTHER" },
  { name: "JNTU Hyderabad", city: "Hyderabad", state: "Telangana", established: 1972, ownershipType: OwnershipType.GOVERNMENT, tier: "GOVT_OTHER" },
  { name: "College of Engineering Trivandrum", city: "Thiruvananthapuram", state: "Kerala", established: 1939, ownershipType: OwnershipType.GOVERNMENT, tier: "GOVT_OTHER" },
  { name: "Government Engineering College Thrissur", city: "Thrissur", state: "Kerala", established: 1957, ownershipType: OwnershipType.GOVERNMENT, tier: "GOVT_OTHER" },
  { name: "Thiagarajar College of Engineering", city: "Madurai", state: "Tamil Nadu", established: 1957, ownershipType: OwnershipType.AUTONOMOUS, tier: "GOVT_OTHER" },
  { name: "Siddaganga Institute of Technology", city: "Tumkur", state: "Karnataka", established: 1963, ownershipType: OwnershipType.PRIVATE, tier: "GOVT_OTHER" },
  { name: "Government Model Engineering College", city: "Kochi", state: "Kerala", established: 1989, ownershipType: OwnershipType.GOVERNMENT, tier: "GOVT_OTHER" },
  { name: "National Institute of Engineering Mysore", city: "Mysore", state: "Karnataka", established: 1946, ownershipType: OwnershipType.AUTONOMOUS, tier: "GOVT_OTHER" },
];

async function main() {
  console.log("🌱 Starting seed...");
  console.log("🗑️  Clearing existing data...");

  await prisma.cutoffData.deleteMany();
  await prisma.review.deleteMany();
  await prisma.savedCollege.deleteMany();
  await prisma.course.deleteMany();
  await prisma.placementStats.deleteMany();
  await prisma.college.deleteMany();

  const allColleges = [...IITs, ...NITs, ...IIITs, ...AKTU_COLLEGES, ...PRIVATE_COLLEGES, ...GOVT_OTHER];
  console.log(`📦 Seeding ${allColleges.length} colleges...`);

  let count = 0;
  for (const def of allColleges) {
    const tier = TIERS[def.tier];
    const rating = rand(tier.ratingRange[0], tier.ratingRange[1]);
    const avgFees = rand(tier.feeRange[0], tier.feeRange[1]);
    const courses = generateCourses(tier, randInt(4, 7));
    const placements = generatePlacements(tier);
    const reviews = generateReviews(tier, randInt(2, 4));
    const cutoffs = generateCutoffs(tier, courses.map((c) => c.name));
    const slug = slugify(def.name);

    const description = `${def.name} is a prestigious institution located in ${def.city}, ${def.state}, established in ${def.established}. Known for its excellent academic programs, state-of-the-art infrastructure, and strong industry connections, the institute has consistently produced top-tier graduates who excel in various fields of engineering and technology.\n\nThe campus spans a large area with modern facilities including well-equipped laboratories, a comprehensive library, sports complexes, and comfortable hostel accommodations. The institute maintains strong ties with leading companies, ensuring excellent placement opportunities for its students.\n\nWith a focus on research, innovation, and holistic development, ${def.name} continues to be a top choice for aspiring engineers across the country.`;

    await prisma.college.create({
      data: {
        name: def.name,
        slug,
        description,
        shortDescription: `${def.name} — a leading ${def.ownershipType.toLowerCase()} institution in ${def.city}, ${def.state}.`,
        bannerImage: pick(IMAGES),
        images: GALLERY.sort(() => 0.5 - Math.random()).slice(0, randInt(3, 5)),
        website: `https://${slug}.ac.in`,
        city: def.city,
        state: def.state,
        address: `${def.name}, ${def.city}, ${def.state}`,
        established: def.established,
        ownershipType: def.ownershipType,
        naacGrade: pick(tier.naacGrades),
        nirfRanking: def.nirfRanking,
        rating,
        accreditation: ["AICTE", "UGC", ...(rating > 3.5 ? ["NBA"] : [])],
        avgFees,
        minFees: avgFees * 0.8,
        maxFees: avgFees * 1.5,
        hostel: Math.random() > 0.1,
        wifi: Math.random() > 0.15,
        library: true,
        sports: Math.random() > 0.2,
        lab: true,
        cafeteria: Math.random() > 0.1,
        medicalFacility: Math.random() > 0.3,
        courses: { create: courses },
        placements: { create: placements },
        reviews: { create: reviews },
        cutoffs: { create: cutoffs },
      },
    });

    count++;
    if (count % 20 === 0) console.log(`  ✓ ${count}/${allColleges.length} colleges created`);
  }

  console.log(`✅ Seed complete! Created ${count} colleges.`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
