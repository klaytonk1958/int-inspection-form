import { NextRequest, NextResponse } from "next/server";
import { getGoogleServices } from "@/app/utils/google";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const { sheets, drive } = await getGoogleServices();

    let sheetId = process.env.MASTER_EQUIPMENT_LIST_SHEET_ID;

    if (!sheetId) {
      console.error("MASTER_EQUIPMENT_LIST_SHEET_ID is not defined!");
      return NextResponse.json(
        { error: "MASTER_EQUIPMENT_LIST_SHEET_ID is not defined!" },
        { status: 500 }
      );
    }

    const range = "'Active Equipment'!A:E";
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return NextResponse.json([]);
    }

    const equipmentList: Array<{ name: string; serial: string }> = [];

    // Filter rows that have a valid name and either 'X' or 'V' in Column E
    for (const row of rows) {
      const name = row[1]?.toString().trim();
      const serial = row[2]?.toString().trim();
      const status = row[4]?.toString().trim().toUpperCase();

      if (name && (status === "X" || status === "V")) {
        equipmentList.push({
          name,
          serial: serial || "",
        });
      }
    }

    return NextResponse.json(equipmentList);
  } catch (error: any) {
    console.error("Error fetching active equipment:", error);
    return NextResponse.json(
      { error: "Failed to fetch active equipment", details: error.message || error },
      { status: 500 }
    );
  }
}
