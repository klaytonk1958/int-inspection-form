import { google } from "googleapis";

const SCOPES = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/spreadsheets.readonly",
];

const jsonString = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT || "", "base64").toString("utf-8");
const serviceAccount = JSON.parse(jsonString);

const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount,
  scopes: SCOPES,
});


export const getGoogleServices = async () => {
  const authClient = await auth.getClient();
  const drive = google.drive({ version: "v3", auth: authClient });
  const sheets = google.sheets({ version: "v4", auth: authClient });
  return { drive, sheets };
};

export async function appendRowToSheet({
  spreadsheetId,
  sheetName,
  data,
  fallbackHeaders,
}: {
  spreadsheetId: string;
  sheetName: string;
  data: Record<string, any>;
  fallbackHeaders?: string[];
}) {
  const { sheets } = await getGoogleServices();

  // Try to read headers from the first row of the sheet
  let headers: string[] = [];
  try {
    const headerResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'${sheetName}'!1:1`,
    });
    const rows = headerResponse.data.values;
    if (rows && rows.length > 0 && rows[0]) {
      headers = rows[0];
    }
  } catch (error) {
    console.warn(`Could not fetch headers from sheet '${sheetName}', using fallbackHeaders if available.`, error);
  }

  if (headers.length === 0) {
    if (fallbackHeaders && fallbackHeaders.length > 0) {
      headers = fallbackHeaders;
    } else {
      throw new Error(`Target sheet '${sheetName}' headers could not be retrieved and no fallback headers were provided.`);
    }
  }

  // Prepare new row matching the headers
  const newRow = headers.map((h: string) => (data[h] !== undefined ? data[h] : ""));

  // Read column A to find the last row
  const allDataResponse = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `'${sheetName}'!A:A`,
  });

  const allRows = allDataResponse.data.values || [];

  // Find the last non-empty row in column A
  let lastDataRow = allRows.length;
  while (lastDataRow > 0 && !allRows[lastDataRow - 1]?.[0]) {
    lastDataRow--;
  }

  const nextRow = lastDataRow + 1;

  // Write the new row to the exact next empty row
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `'${sheetName}'!A${nextRow}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [newRow],
    },
  });

  return { success: true, nextRow };
}