export const USER = {
    name: "Shubham Joshi",
    rollNo: "BT2401",
    room: "A-106",
    hostel: "Praveen Boys Hostel",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
};

export const NOTICES = [
    {
        id: 1,
        title: "WiFi Maintenance",
        date: "24 Jan, 2026",
        desc: "WiFi will be down from 2 PM to 4 PM for server upgrade.",
        urgent: true,
    },
    {
        id: 2,
        title: "Mess Committee Meeting",
        date: "22 Jan, 2026",
        desc: "Interested students gather in Common Room at 6 PM.",
        urgent: false,
    },
    {
        id: 3,
        title: "Fee Deadline Extended",
        date: "20 Jan, 2026",
        desc: "Last date for hostel fee submission is now 30th Jan.",
        urgent: false,
    },
];

export const MESS_MENU = {
    Monday: {
        Breakfast: ["Aloo Paratha", "Curd", "Tea/Coffee"],
        Lunch: ["Rajma Masala", "Jeera Rice", "Roti", "Salad"],
        Dinner: ["Mix Veg", "Dal Tadka", "Roti", "Kheer"],
    },
    Tuesday: {
        Breakfast: ["Poha", "Sev", "Tea/Coffee"],
        Lunch: ["Kadhi Pakoda", "Rice", "Roti", "Achar"],
        Dinner: ["Egg Curry / Paneer", "Rice", "Roti", "Gulab Jamun"],
    },
    Wednesday: {
        Breakfast: ["Idli", "Sambar", "Coconut Chutney", "Tea/Coffee"],
        Lunch: ["Chole", "Bhature", "Rice", "Salad"],
        Dinner: ["Palak Paneer", "Dal Fry", "Roti", "Rice"],
    },
    Thursday: {
        Breakfast: ["Upma", "Chutney", "Tea/Coffee"],
        Lunch: ["Dal Makhani", "Rice", "Roti", "Papad"],
        Dinner: ["Chicken Curry / Soya Chunks", "Rice", "Roti", "Ice Cream"],
    },
    Friday: {
        Breakfast: ["Chole Bhature", "Tea/Coffee"],
        Lunch: ["Aloo Gobi", "Rice", "Roti", "Raita"],
        Dinner: ["Paneer Butter Masala", "Dal Tadka", "Roti", "Kheer"],
    },
    Saturday: {
        Breakfast: ["Dosa", "Sambar", "Chutney", "Tea/Coffee"],
        Lunch: ["Biryani", "Raita", "Salad"],
        Dinner: ["Mix Veg", "Dal", "Roti", "Fruit Custard"],
    },
    Sunday: {
        Breakfast: ["Puri", "Aloo Sabji", "Tea/Coffee"],
        Lunch: ["Special Thali", "Sweet Dish"],
        Dinner: ["Paneer Tikka Masala", "Rice", "Roti", "Gulab Jamun"],
    },
};

export const COMPLAINTS = [
    {
        id: 101,
        category: "Plumbing",
        title: "Tap Leaking in Washroom",
        date: "24 Jan",
        status: "Pending",
        color: "yellow",
    },
    {
        id: 102,
        category: "Electricity",
        title: "Fan making noise",
        date: "20 Jan",
        status: "Resolved",
        color: "green",
    },
    {
        id: 103,
        category: "WiFi",
        title: "No internet connectivity",
        date: "18 Jan",
        status: "Resolved",
        color: "green",
    },
];

export const GATE_PASS = {
    status: "APPROVED",
    validUntil: "25 Jan, 10:00 PM",
    reason: "Family Function",
    qrValue: "PASS-12345-BT2401-APPROVED",
};

export type MealType = "Breakfast" | "Lunch" | "Dinner";
export type DayType = keyof typeof MESS_MENU;
