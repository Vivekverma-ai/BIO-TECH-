import { db, users, businesses, employees } from "./index";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const seed = async () => {
  console.log("🌱 Seeding database with Businesses, Employees, Users, and Relations...");

  try {
    // 1. Create Users
    console.log("Creating Users...");
    const [ownerUser] = await db
      .insert(users)
      .values({
        name: "Dr. Alexander Wright",
        email: "alexander.wright@biotech-innovations.io",
        role: "business_owner",
        phone: "+1-555-0199",
      })
      .onConflictDoNothing()
      .returning();

    const [managerUser] = await db
      .insert(users)
      .values({
        name: "Dr. Elena Rostova",
        email: "elena.rostova@biotech-innovations.io",
        role: "employee",
        phone: "+1-555-0245",
      })
      .onConflictDoNothing()
      .returning();

    const [scientistUser] = await db
      .insert(users)
      .values({
        name: "Liam Chen",
        email: "liam.chen@biotech-innovations.io",
        role: "employee",
        phone: "+1-555-0312",
      })
      .onConflictDoNothing()
      .returning();

    const targetOwner = ownerUser || (await db.query.users.findFirst({ where: (u, { eq }) => eq(u.email, "alexander.wright@biotech-innovations.io") }));
    const targetManager = managerUser || (await db.query.users.findFirst({ where: (u, { eq }) => eq(u.email, "elena.rostova@biotech-innovations.io") }));
    const targetScientist = scientistUser || (await db.query.users.findFirst({ where: (u, { eq }) => eq(u.email, "liam.chen@biotech-innovations.io") }));

    if (!targetOwner || !targetManager || !targetScientist) {
      throw new Error("Failed to resolve seed users.");
    }

    // 2. Create Business owned by the Owner User
    console.log("Creating Business...");
    const [business] = await db
      .insert(businesses)
      .values({
        name: "BioTech Innovations Lab",
        slug: "biotech-innovations",
        email: "contact@biotech-innovations.io",
        phone: "+1-800-BIO-TECH",
        website: "https://biotech-innovations.io",
        address: "450 Innovation Parkway, Suite 800, Boston, MA 02115",
        ownerId: targetOwner.id,
        status: "active",
        metadata: {
          industry: "Biotechnology & Genomics",
          foundedYear: 2024,
          certifications: ["ISO-9001", "GLP-Compliant"],
        },
      })
      .onConflictDoNothing()
      .returning();

    const targetBusiness = business || (await db.query.businesses.findFirst({ where: (b, { eq }) => eq(b.slug, "biotech-innovations") }));

    if (!targetBusiness) {
      throw new Error("Failed to resolve seed business.");
    }

    // 3. Create Manager Employee
    console.log("Creating Manager Employee Profile...");
    const [managerEmployee] = await db
      .insert(employees)
      .values({
        businessId: targetBusiness.id,
        userId: targetManager.id,
        employeeCode: "EMP-MGR-001",
        jobTitle: "Lead Research Scientist & Lab Director",
        department: "Molecular Genetics",
        employmentType: "full_time",
        employmentStatus: "active",
        salary: "145000.00",
        hireDate: new Date("2024-01-15"),
        notes: "Head of gene sequencing pipeline",
      })
      .onConflictDoNothing()
      .returning();

    const targetManagerEmployee = managerEmployee || (await db.query.employees.findFirst({ where: (e, { eq }) => eq(e.employeeCode, "EMP-MGR-001") }));

    // 4. Create Staff Employee reporting to the Manager
    console.log("Creating Staff Employee Profile (Subordinate)...");
    await db
      .insert(employees)
      .values({
        businessId: targetBusiness.id,
        userId: targetScientist.id,
        employeeCode: "EMP-SCI-002",
        jobTitle: "Senior Bioinformatics Engineer",
        department: "Computational Biology",
        employmentType: "full_time",
        employmentStatus: "active",
        salary: "115000.00",
        hireDate: new Date("2024-06-01"),
        managerId: targetManagerEmployee?.id,
        notes: "Specializes in CRISPR guide RNA optimization",
      })
      .onConflictDoNothing();

    // 5. Query and demonstrate relational structure
    console.log("\n🔍 Verifying relational query (Business -> Owner & Employees with Users & Managers):");
    const fullBusinessData = await db.query.businesses.findFirst({
      where: (b, { eq }) => eq(b.id, targetBusiness.id),
      with: {
        owner: true,
        employees: {
          with: {
            user: true,
            manager: {
              with: {
                user: true,
              },
            },
          },
        },
      },
    });

    console.log(JSON.stringify(fullBusinessData, null, 2));
    console.log("\n✅ Database seeded successfully with full relations!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    process.exit(0);
  }
};

seed();
