import Department from "../models/Department";
import DocumentType from "../models/DocumentType";
import Role from "../models/Role";
import { performAssociations } from "./associations";

const seedDatabase = async () => {
  try {
    let departmentCount = await Department.count({
      where: {},
    });
    if (departmentCount > 0) return;
    // Seed Departments
    const departments = await Department.bulkCreate(
      [
        { title: "Computer Science" },
        { title: "Dean Student Welfare" },
        { title: "Library" },
        { title: "Finance" },
        { title: "Exam Cell" },
      ],
      { ignoreDuplicates: true }
    );

    // Map department names to IDs
    const departmentMap = Object.fromEntries(
      departments.map((dept) => [dept.dataValues.title, dept.dataValues.id])
    );

    // Seed Document Types
    await DocumentType.bulkCreate(
      [
        {
          title: "ID Card",
          canGenerateDigitally: true,
          canGeneratePhysically: true,
          multipleAllowed: false,
          departmentId: departmentMap["Dean Student Welfare"],
          templateName: "id-card",
        },
        {
          title: "Bonafide Certificate",
          canGenerateDigitally: true,
          canGeneratePhysically: true,
          multipleAllowed: true,
          departmentId: departmentMap["Computer Science"],
          templateName: "bonafide",
        },
        {
          title: "Library Due Clearance",
          canGenerateDigitally: false,
          canGeneratePhysically: true,
          multipleAllowed: false,
          departmentId: departmentMap["Library"],
          templateName: "library-clearance",
        },
      ],
      { ignoreDuplicates: true }
    );

    // Seed Roles
    await Role.bulkCreate(
      [
        {
          title: "HOD",
          departmentId: departmentMap["Computer Science"],
          allowMultiple: false,
        },
        {
          title: "Dean",
          departmentId: departmentMap["Dean Student Welfare"],
          allowMultiple: false,
        },
        {
          title: "Librarian",
          departmentId: departmentMap["Library"],
          allowMultiple: false,
        },
        {
          title: "Finance Officer",
          departmentId: departmentMap["Finance"],
          allowMultiple: false,
        },
        {
          title: "Exam Controller",
          departmentId: departmentMap["Exam Cell"],
          allowMultiple: false,
        },
      ],
      { ignoreDuplicates: true }
    );

    console.log("✅ Database seeding successful!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
};

export const init = () => {
  performAssociations();
  seedDatabase();
};
