import { NextRequest, NextResponse } from "next/server";
import { getGoogleServices } from "@/app/utils/google";

export const runtime = "nodejs";

const equipmentCache = new Map();

// cache expires after 5 minutes
const MAX_CACHE_AGE = 1000 * 60 * 5;

export async function GET(request: NextRequest) {
  try {
    if (equipmentCache.has("equipmentList")) {
      const { equipmentList, timestamp } = equipmentCache.get("equipmentList");
      const cacheAge = Date.now() - timestamp;
      if (cacheAge < MAX_CACHE_AGE) {
        console.log("Returning cached data");
        return NextResponse.json(equipmentList);
      }
      console.log("Cache expired, fetching new data");
    }

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

    const equipmentList: Array<{ id: string; name: string; serial: string }> = [];

    // Filter rows that have a valid name and either 'X' or 'V' in Column E
    for (const row of rows) {
      const id = row[0]?.toString().trim();
      const name = row[1]?.toString().trim();
      const serial = row[2]?.toString().trim();
      const status = row[4]?.toString().trim().toUpperCase();

      if (id && name && (status === "X" || status === "V")) {
        equipmentList.push({
          id,
          name,
          serial: serial || "",
        });
      }
    }

    equipmentCache.set("equipmentList", { equipmentList, timestamp: Date.now() });

    return NextResponse.json(equipmentList);
  } catch (error: any) {
    console.error("Error fetching active equipment:", error);
    return NextResponse.json(
      { error: "Failed to fetch active equipment", details: error.message || error },
      { status: 500 }
    );
  }
}
