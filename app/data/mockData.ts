import type { Patient } from "../types/types"

export const mockPatientData: Patient = {
  id: "12345",
  firstName: "Johnn",
  lastName: "Doe",
  age: 42,
  position: "Room 302, East Wing",
  location: {
    latitude: 36.71426,
    longitude: 3.17531,
  }, // Example coordinates (New York City)
  phoneNumber: "(555) 123-4567",
  email: "john.doe@example.com",
  height: 178,
  weight: 75,
  medicalRecords: [
    {
      id: "rec1",
      title: "Annual Physical Examination",
      date: "2023-03-15",
      description:
        "Patient appears to be in good health. Blood pressure slightly elevated. Recommended lifestyle changes including more exercise and reduced sodium intake.",
      doctor: "Dr. Sarah Johnson",
      medication: "None prescribed",
    },
    {
      id: "rec2",
      title: "Flu Symptoms",
      date: "2023-01-10",
      description:
        "Patient presented with fever, cough, and fatigue. Diagnosed with seasonal influenza. Recommended rest and increased fluid intake.",
      doctor: "Dr. Michael Chen",
      medication: "Oseltamivir 75mg twice daily for 5 days",
    },
    {
      id: "rec3",
      title: "Lower Back Pain",
      date: "2022-11-22",
      description:
        "Patient reported persistent lower back pain after moving furniture. Physical examination suggests muscle strain. Recommended rest and physical therapy.",
      doctor: "Dr. Emily Rodriguez",
      medication: "Ibuprofen 400mg as needed for pain",
    },
  ],
}
