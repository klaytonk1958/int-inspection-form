import { NextRequest, NextResponse } from "next/server";
import { appendRowToSheet } from "@/app/utils/google";

export const runtime = "nodejs";

const NEAR_MISS_HEADERS = [
  "Timestamp",
  "Operator Name:",
  "Date of Incident:",
  "Near Miss Incident:",
  "Action Taken:",
  "Critical Behaviors:",
  "Other:",
  "Other Comments & Concerns:",
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
    const sheetId = process.env.NEAR_MISS_SHEET_ID;
    if (!sheetId) {
      return NextResponse.json(
        { error: "NEAR_MISS_SHEET_ID is not configured" },
        { status: 500 }
      );
    }

    const sheetName = process.env.NEAR_MISS_SHEET_NAME || "Near Miss Data";

    // 3. Append the row to Google Sheets
    await appendRowToSheet({
      spreadsheetId: sheetId,
      sheetName,
      data,
      fallbackHeaders: NEAR_MISS_HEADERS,
    });

    return NextResponse.json({ success: true, message: "Data added successfully" });
  } catch (error: any) {
    console.error("Error submitting near miss entry:", error);
    return NextResponse.json(
      { error: "Failed to add data", details: error.message || error },
      { status: 500 }
    );
  }
}
