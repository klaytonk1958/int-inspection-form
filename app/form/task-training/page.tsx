"use client";

import React, { useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function TaskTrainingForm() {
  const [employeeName, setEmployeeName] = useState("");
  const [employeeInitials, setEmployeeInitials] = useState("");
  const [competentPerson, setCompetentPerson] = useState("");
  const [taskEquipment, setTaskEquipment] = useState("");
  const [trainingDate, setTrainingDate] = useState("");
  const [subjectLength, setSubjectLength] = useState("");

  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  function resetForm() {
    setEmployeeName("");
    setEmployeeInitials("");
    setCompetentPerson("");
    setTaskEquipment("");
    setTrainingDate("");
    setSubjectLength("");
    setSubmitMessage(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitMessage(null);
    setLoading(true);

    // Validation
    if (!competentPerson.trim()) {
      setSubmitMessage("Please fill required field: Competent Person");
      setLoading(false);
      return;
    }
    if (!trainingDate.trim()) {
      setSubmitMessage("Please fill required field: Training Date");
      setLoading(false);
      return;
    }
    if (!subjectLength.trim()) {
      setSubmitMessage("Please fill required field: Subject Length");
      setLoading(false);
      return;
    }

    try {
      setSubmitMessage("Submitting record...");

      const payload: Record<string, any> = {
        "Timestamp": new Date().toLocaleString("en-US", {
          timeZone: "America/New_York",
          month: "numeric",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: false,
        }).replace(",", ""),
        "Employee Name:": employeeName,
        "Employee Initials:": employeeInitials,
        "Competent Person:": competentPerson,
        "Task or Equipment Make and Model:": taskEquipment,
        "Training Date:": trainingDate,
        "Subject Length:": subjectLength,
      };

      const res = await fetch(`${API_URL}/api/task-training`, {
        method: "POST",
        redirect: "follow",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ task: "init", data: payload }),
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Submission failed");
      }

      setLoading(false);
      setShowThankYou(true);
    } catch (err: any) {
      setSubmitMessage(`Error: ${err.message || err}`);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 text-slate-800 relative">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mb-6"></div>
          <span className="text-lg text-slate-800 font-medium">Submitting...</span>
        </div>
      )}

      {/* Thank You Screen */}
      {showThankYou && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center px-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Thank you!</h2>
          <p className="text-slate-600 text-center mb-6">
            The Task Training Record has been submitted successfully.
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowThankYou(false);
              }}
              className="w-full bg-slate-800 text-white px-6 py-2.5 rounded-xl text-sm font-medium shadow hover:bg-slate-700 transition"
            >
              Submit Another Record
            </button>
            <Link
              href="/"
              className="w-full text-center bg-white border border-slate-300 text-slate-700 px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
            >
              ← Main Menu
            </Link>
          </div>
        </div>
      )}

      {/* Main Form */}
      {!showThankYou && (
        <div className="bg-white rounded-2xl shadow-md p-4">
          {/* Header */}
          <header className="mb-6 border-b border-slate-100 pb-5">
            <Link href="/" className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-700 mb-3 transition">
              ← Main Menu
            </Link>
            <div className="bg-slate-900 text-white rounded-xl p-4 text-center mb-4">
              <h1 className="text-xl font-bold tracking-wider font-sans uppercase">
                EPM Task Training Record
              </h1>
              <p className="text-xs text-slate-400 tracking-widest uppercase mt-1">
                Even Par Mine ID# 38-00774
              </p>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed text-center mb-3">
              Complete this form to document all Task Training for Main Office documentation and MSHA recordkeeping requirements.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center mb-4">
              <span className="text-xs font-semibold text-amber-800 block">
                The miner received the following training before performing a new task, or a change occurred in an assignment task that affects health and safety risk.
              </span>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 text-center mb-4">
              <span className="text-[11px] text-red-700 block leading-relaxed">
                ⚠️ False certification is punishable under section 110A and 110F of the Federal Mine Safety and Health Act
              </span>
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-400">
              <span>
                Support:{" "}
                <a
                  href="tel:8033007596"
                  className="text-slate-600 hover:text-slate-800 underline font-medium"
                >
                  Klayton (803-300-7596)
                </a>
              </span>
              <span>
                <span className="text-red-500">*</span> Required field
              </span>
            </div>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Employee Name */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">
                Employee Name:
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                placeholder="Full name"
              />
            </div>

            {/* Employee Initials */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">
                Employee Initials:
              </label>
              <input
                type="text"
                maxLength={6}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none uppercase"
                value={employeeInitials}
                onChange={(e) => setEmployeeInitials(e.target.value.toUpperCase())}
                placeholder="e.g. JD"
              />
            </div>

            {/* Competent Person */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">
                Competent Person: <span className="text-red-500">*</span>
              </label>
              <p className="text-[11px] text-slate-400 -mt-0.5">
                Person Responsible for Health and Safety Training
              </p>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                value={competentPerson}
                onChange={(e) => setCompetentPerson(e.target.value)}
                placeholder="Name of competent person"
                required
              />
            </div>

            {/* Task or Equipment */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">
                Task or Equipment Make and Model:
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                value={taskEquipment}
                onChange={(e) => setTaskEquipment(e.target.value)}
                placeholder="e.g. Cat 390 Excavator or Haul Road Inspection"
              />
            </div>

            {/* Training Date */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">
                Training Date: <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                value={trainingDate}
                onChange={(e) => setTrainingDate(e.target.value)}
                required
              />
            </div>

            {/* Subject Length */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">
                Subject Length: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                value={subjectLength}
                onChange={(e) => setSubjectLength(e.target.value)}
                placeholder="e.g. 30 min, 1 hour"
                required
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-slate-800 text-white py-3 rounded-xl text-sm font-medium shadow hover:bg-slate-700 transition"
              >
                Submit Training Record
              </button>
              {submitMessage && (
                <p className="text-sm mt-3 text-center text-red-600 font-medium">
                  {submitMessage}
                </p>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
