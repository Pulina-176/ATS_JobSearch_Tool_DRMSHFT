import React from "react";
import { createPdf } from "../utils/pdf-lib_function";


const PdfPreview = () => {
  const colors = [
    { name: "Red", color: "#FF0000" },
    { name: "Green", color: "#00FF00" },
    { name: "Blue", color: "#0000FF" },
    { name: "Yellow", color: "#FFFF00" },
    { name: "Cyan", color: "#00FFFF" },
    { name: "Magenta", color: "#FF00FF" },
    { name: "Black", color: "#000000" },
    { name: "White", color: "#FFFFFF" },
    { name: "Orange", color: "#FFA500" },
    { name: "Purple", color: "#800080" },
  ];

  const jobTitles = [
    "Operations Manager Bank",
    "Administrative & Account Assistant",
    "Administrative Assistant",
  ];
  const countries = ["Dubai", "Dubai", "Dubai"];
  const platforms = ["Jooble", "Indeed", "Indeed"];
  const links = [
    "https://ae.jooble.org/jdp/3874374147157176006",
    "https://devjobs.lk/dev-jobs/client/ads/215?utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic",
    "hhttps://devjobs.lk/dev-jobs/client/ads/215?utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic",
  ];

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Color Table</h1>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Color</th>
            </tr>
          </thead>
          <tbody>
            {colors.map((color, index) => (
              <tr key={index} className="text-center">
                <td className="py-2 px-4 border-b">{color.name}</td>
                <td
                  className="py-2 px-4 border-b"
                  style={{ backgroundColor: color.color }}
                >
                  {color.color}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="btn btn-primary mt-4" onClick={() => createPdf(jobTitles, countries, platforms, links)}>
        Download PDF
      </button>
    </div>
  );
};

export default PdfPreview;
