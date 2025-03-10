"use client"
import {MedicationOutput} from "../../components/MedicationDisplay";

// Test page for working on components.

export default function Test() {
  const testData = [
    {
        id: 1,
        start: "2023-01-01",
        stop: "2023-01-10",
        medication: "Aspirin",
        time: "",
        initial: "",
        site: "",
        ndc: "123456789"
    },
    {
        id: 2,
        start: "2023-02-01",
        stop: "2023-02-10",
        medication: "Ibuprofen",
        time: "",
        initial: "",
        site: "",
        ndc: "987654321"
    }
];
  return (
    <div>
      {/* Replace this with the component you want to test */}
      <MedicationOutput initialData={testData}/> 
    </div>
  );
}
