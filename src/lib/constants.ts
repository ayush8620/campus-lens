export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Chandigarh", "Jammu and Kashmir",
  "Puducherry",
] as const;

export const MAJOR_CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata",
  "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh", "Bhopal",
  "Thiruvananthapuram", "Bhubaneswar", "Guwahati", "Patna", "Ranchi",
  "Dehradun", "Raipur", "Noida", "Greater Noida", "Ghaziabad",
] as const;

export const ENGINEERING_COURSES = [
  "Computer Science & Engineering",
  "Electronics & Communication Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Information Technology",
  "Chemical Engineering",
  "Biotechnology",
  "Aerospace Engineering",
  "Data Science & AI",
  "Artificial Intelligence & ML",
] as const;

export const EXAM_LABELS: Record<string, string> = {
  JEE_MAIN: "JEE Main",
  JEE_ADVANCED: "JEE Advanced",
  CUET: "CUET",
  AKTU: "AKTU Counselling",
  NEET: "NEET",
  BITSAT: "BITSAT",
  VITEEE: "VITEEE",
  COMEDK: "COMEDK",
  MET: "MET (Manipal)",
  STATE_CET: "State CET",
};

export const CATEGORY_LABELS: Record<string, string> = {
  GENERAL: "General",
  OBC: "OBC",
  SC: "SC",
  ST: "ST",
  EWS: "EWS",
};

export const OWNERSHIP_LABELS: Record<string, string> = {
  GOVERNMENT: "Government",
  PRIVATE: "Private",
  PUBLIC_PRIVATE: "Public-Private",
  DEEMED: "Deemed University",
  AUTONOMOUS: "Autonomous",
};

export const NAAC_LABELS: Record<string, string> = {
  A_PLUS_PLUS: "A++",
  A_PLUS: "A+",
  A: "A",
  B_PLUS_PLUS: "B++",
  B_PLUS: "B+",
  B: "B",
  C: "C",
  NOT_ACCREDITED: "Not Accredited",
};

export const SORT_OPTIONS = [
  { value: "rating_desc", label: "Highest Rating" },
  { value: "fees_asc", label: "Lowest Fees" },
  { value: "fees_desc", label: "Highest Fees" },
  { value: "placement_desc", label: "Best Placements" },
  { value: "name_asc", label: "A → Z" },
  { value: "name_desc", label: "Z → A" },
] as const;

export const BRANCHES = [
  "Computer Science & Engineering",
  "Electronics & Communication Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Information Technology",
  "Chemical Engineering",
  "Biotechnology",
] as const;

export const PAGE_SIZE = 12;

export const MAX_COMPARE_COLLEGES = 3;

export const COLLEGE_IMAGES = [
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
] as const;
