import puppeteer from "puppeteer";
import fs from "fs-extra";
import path from "path";
import { randomUUID } from "crypto";

/**
 * Replace placeholders like {{key}} in the HTML with actual values
 */
function fillTemplate(template: string, data: Record<string, string>): string {
  return template.replace(/{{(.*?)}}/g, (_, key) => data[key.trim()] || "");
}

/**
 * Generate a PDF from an HTML template and save it with a random filename in /assets
 * @param templateName Name of the HTML template file in the templates folder
 * @param data Key-value map of placeholder values to fill the template
 * @returns Absolute path of the generated PDF
 */
export async function generateAndSavePDF(
  templateName: string,
  data: Record<string, string>
): Promise<string | null> {
  try {
    const templatePath = path.join(
      __dirname,
      "..",
      "..",
      "src/templates",
      templateName
    );
    const rawHtml = await fs.readFile(templatePath, "utf-8");
    const filledHtml = fillTemplate(rawHtml, data);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(filledHtml, { waitUntil: "networkidle0" });

    const outputDir = path.join(__dirname, "..", "..", "src/assets");
    await fs.ensureDir(outputDir); // Create directory if not exists

    const fileName = `doc_${randomUUID()}.pdf`;
    const filePath = path.join(outputDir, fileName);

    await page.pdf({
      path: filePath,
      format: "A4",
      printBackground: true,
    });

    await browser.close();
    return filePath;
  } catch (error) {
    console.error("❌ Failed to generate PDF:", error);
    return null;
  }
}
