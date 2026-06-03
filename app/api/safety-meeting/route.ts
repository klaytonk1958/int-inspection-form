import { NextRequest, NextResponse } from "next/server";
import { appendRowToSheet } from "@/app/utils/google";

export const runtime = "nodejs";

const SAFETY_MEETING_HEADERS = [
  "Timestamp",
  "Safety Leader:",
  "Date:",
  "Safety Subject:",
  "Topics Discussed:",
  "Employee Attendees:",
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
    const sheetId = process.env.SAFETY_MEETING_SHEET_ID;
    if (!sheetId) {
      return NextResponse.json(
        { error: "Spreadsheet ID is not configured" },
        { status: 500 }
      );
    }

    const sheetName = process.env.SAFETY_MEETING_SHEET_NAME || "Safety Meeting Data";

    // 3. Append the row to Google Sheets
    await appendRowToSheet({
      spreadsheetId: sheetId,
      sheetName,
      data,
      fallbackHeaders: SAFETY_MEETING_HEADERS,
    });

    return NextResponse.json({ success: true, message: "Data added successfully" });
  } catch (error: any) {
    console.error("Error submitting safety meeting record:", error);
    return NextResponse.json(
      { error: "Failed to add data", details: error.message || error },
      { status: 500 }
    );
  }
}
