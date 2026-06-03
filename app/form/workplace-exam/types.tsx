export type ExamOption = "OK" | "Not OK" | "";

export interface ExamRow {
  id: string;
  label: string;            // Matches column name for status (e.g. "Ground Conditions:")
  commentsLabel: string;    // Matches column name for comments (e.g. "Comments GC:")
  mitigationLabel: string;  // Matches column name for mitigation (e.g. "Mitigation GC:")
  value: ExamOption;
  comments: string;
  mitigation: string;
}

export const INITIAL_EXAM_ROWS: ExamRow[] = [
  {
    id: "ground_conditions",
    label: "Ground Conditions:",
    commentsLabel: "Comments GC:",
    mitigationLabel: "Mitigation GC:",
    value: "",
    comments: "",
    mitigation: "",
  },
  {
    id: "berms_roadways",
    label: "Berms Roadways:",
    commentsLabel: "Comments BR:",
    mitigationLabel: "Mitigation BR:",
    value: "",
    comments: "",
    mitigation: "",
  },
  {
    id: "ponds",
    label: "Ponds:",
    commentsLabel: "Comments P:",
    mitigationLabel: "Mitigation P:",
    value: "",
    comments: "",
    mitigation: "",
  },
  {
    id: "drainage",
    label: "Drainage:",
    commentsLabel: "Comments D:",
    mitigationLabel: "Mitigation D:",
    value: "",
    comments: "",
    mitigation: "",
  },
  {
    id: "signage",
    label: "Signage:",
    commentsLabel: "Comments S:",
    mitigationLabel: "Mitigation S:",
    value: "",
    comments: "",
    mitigation: "",
  },
  {
    id: "fuel_trailer",
    label: "Fuel Trailer:",
    commentsLabel: "Comments FFT:",
    mitigationLabel: "Mitigation FFT:",
    value: "",
    comments: "",
    mitigation: "",
  },
  {
    id: "traffic_patterns",
    label: "Traffic Patterns:",
    commentsLabel: "Comments TP:",
    mitigationLabel: "Mitigation TP:",
    value: "",
    comments: "",
    mitigation: "",
  },
  {
    id: "gates",
    label: "Gates :", // Note the space before colon to match sheet column "Gates :"
    commentsLabel: "Comments G:",
    mitigationLabel: "Mitigation G:",
    value: "",
    comments: "",
    mitigation: "",
  },
  {
    id: "power_lines",
    label: "Under & Overhead Power Lines:",
    commentsLabel: "Comments UOPL:",
    mitigationLabel: "Mitigation UOPL:",
    value: "",
    comments: "",
    mitigation: "",
  },
];

export const OPTION_COLORS = {
  "OK": "bg-green-600 border-green-600 text-white",
  "Not OK": "bg-red-600 border-red-600 text-white",
};
