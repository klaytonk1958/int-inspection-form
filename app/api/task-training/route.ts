import { NextRequest, NextResponse } from "next/server";
import { appendRowToSheet } from "@/app/utils/google";

export const runtime = "nodejs";

const TASK_TRAINING_HEADERS = [
  "Timestamp",
  "Employee Name:",
  "Employee Initials:",
  "Competent Person:",
  "Task or Equipment Make and Model:",
  "Training Date:",
  "Subject Length:",
];

export async function POST(request: NextRequest) {
  try {
    // 1. Parse JSON body robustly
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

    // 2. Resolve sheet ID
    const sheetId = process.env.TASK_TRAINING_SHEET_ID || process.env.PRE_SHIFT_SHEET_ID;
    if (!sheetId) {
      return NextResponse.json(
        { error: "Spreadsheet ID is not configured" },
        { status: 500 }
      );
    }

    const sheetName = process.env.TASK_TRAINING_SHEET_NAME || "Task Training Data";

    // 3. Append the row to Google Sheets
    await appendRowToSheet({
      spreadsheetId: sheetId,
      sheetName,
      data,
      fallbackHeaders: TASK_TRAINING_HEADERS,
    });

    return NextResponse.json({ success: true, message: "Data added successfully" });
  } catch (error: any) {
    console.error("Error submitting task training record:", error);
    return NextResponse.json(
      { error: "Failed to add data", details: error.message || error },
      { status: 500 }
    );
  }
}
