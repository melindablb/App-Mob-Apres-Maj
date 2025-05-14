export interface MedicalRecord {
    id: string
    title: string
    date: string
    description: string
    doctor: string
    medication: string
  }
  
  export interface GeoLocation {
    latitude: number
    longitude: number
  }
  
  export interface Patient {
    id: string
    firstName: string
    lastName: string
    age: number
    position: string // Human-readable location description
    location: GeoLocation // Geographic coordinates for mapping
    phoneNumber: string
    email: string
    height: number
    weight: number
    medicalRecords: MedicalRecord[]
  }
  
  