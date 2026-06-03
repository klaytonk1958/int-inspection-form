import { NextRequest, NextResponse } from "next/server";
import { appendRowToSheet } from "@/app/utils/google";

export const runtime = "nodejs";

const WORKPLACE_EXAM_HEADERS = [
  "Timestamp",
  "Supervisor Name:",
  "Ground Conditions:",
  "Comments GC:",
  "Mitigation GC:",
  "Berms Roadways:",
  "Comments BR:",
  "Mitigation BR:",
  "Ponds:",
  "Comments P:",
  "Mitigation P:",
  "Drainage:",
  "Comments D:",
  "Mitigation D:",
  "Signage:",
  "Comments S:",
  "Mitigation S:",
  "Fuel Trailer:",
  "Comments FFT:",
  "Mitigation FFT:",
  "Traffic Patterns:",
  "Comments TP:",
  "Mitigation TP:",
  "Gates :",
  "Comments G:",
  "Mitigation G:",
  "Under & Overhead Power Lines:",
  "Comments UOPL:",
  "Mitigation UOPL:",
  "Expected Date Correction:",
];

export async function POST(request: NextRequest) {
  try {
    // 1. Parse JSON body robustly (handling standard JSON and plain text submissions)
    let body: any;
    try {
      body = await request.json();
    } catch {
      try {
        const text = await request.text();
        body = JSON.parse(text);
      } catch (err: any) {
        return NextResponse.json(
          { error: "Invalid JSON payload", details: err.message },
          { status: 400 }
        );
      }
    }

    if (!body || body.task !== "init") {
      return NextResponse.json(
        { error: "Invalid task or missing initialization task" },
        { status: 400 }
      );
    }

    const data = body.data;
    if (!data) {
      return NextResponse.json(
        { error: "Missing data object" },
        { status: 400 }
      );
    }

    // 2. Resolve sheet credentials and targets
    const sheetId = process.env.WORKPLACE_EXAM_SHEET_ID || process.env.PRE_SHIFT_SHEET_ID;
    if (!sheetId) {
      return NextResponse.json(
        { error: "Spreadsheet ID is not configured" },
        { status: 500 }
      );
    }

    const sheetName = process.env.WORKPLACE_EXAM_SHEET_NAME || "Work Place Exam Data";

    // 3. Append the row to Google Sheets
    await appendRowToSheet({
      spreadsheetId: sheetId,
      sheetName,
      data,
      fallbackHeaders: WORKPLACE_EXAM_HEADERS,
    });

    return NextResponse.json({ success: true, message: "Data added successfully" });
  } catch (error: any) {
    console.error("Error submitting workplace exam data:", error);
    return NextResponse.json(
      { error: "Failed to add data", details: error.message || error },
      { status: 500 }
    );
  }
}
