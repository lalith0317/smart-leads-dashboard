import connectDb from "./config/db.js";
import { Lead } from "./models/Lead.js";
import { User } from "./models/User.js";

await connectDb();

await Promise.all([User.deleteMany({}), Lead.deleteMany({})]);

const [admin, sales] = await User.create([
  { name: "Admin User", email: "admin@smartleads.dev", password: "Admin@12345", role: "admin" },
  { name: "Sales User", email: "sales@smartleads.dev", password: "Sales@12345", role: "sales" }
]);

const names = [
  "Rahul Sharma",
  "Asha Mehta",
  "Neha Kapoor",
  "Vikram Rao",
  "Priya Nair",
  "Ishaan Verma",
  "Ananya Singh",
  "Karan Malhotra",
  "Meera Iyer",
  "Rohan Das",
  "Simran Gill",
  "Dev Patel",
  "Tara Joshi",
  "Arjun Sen",
  "Nisha Balan"
];
const statuses = ["new", "contacted", "qualified", "lost"] as const;
const sources = ["website", "instagram", "referral"] as const;

await Lead.insertMany(
  names.map((name, index) => ({
    name,
    email: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
    status: statuses[index % statuses.length],
    source: sources[index % sources.length],
    owner: index % 2 === 0 ? admin._id : sales._id,
    createdAt: new Date(Date.now() - index * 86400000)
  }))
);

console.log("Seed complete");
await process.exit(0);
