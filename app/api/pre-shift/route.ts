import { NextRequest, NextResponse } from "next/server";
import { getGoogleServices } from "@/app/utils/google";

export const runtime = "nodejs";

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

    // 2. Setup Google Sheets & Drive services
    const { sheets, drive } = await getGoogleServices();

    // 3. Try to get sheet ID from environment
    let sheetId = process.env.PRE_SHIFT_SHEET_ID;


    // 5. Read headers from first row of sheet "Data"
    const headerResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "'Pre Shift Data'!1:1",
    });
    const rows = headerResponse.data.values;
    if (!rows || rows.length === 0 || !rows[0]) {
      return NextResponse.json(
        { error: "Target sheet 'Data' is empty or has no headers" },
        { status: 500 }
      );
    }

    const headers = rows[0];

    // 6. Prepare new row matching the headers
    const newRow = headers.map((h: string) => (data[h] !== undefined ? data[h] : ""));

    // 7. Append the row to the sheet "Data"
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "'Pre Shift Data'!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [newRow],
      },
    });

    return NextResponse.json({ success: true, message: "Data added successfully" });
  } catch (error: any) {
    console.error("Error submitting pre-shift inspection data:", error);
    return NextResponse.json(
      { error: "Failed to add data", details: error.message || error },
      { status: 500 }
    );
  }
}
