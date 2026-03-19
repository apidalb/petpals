// ============================================
// PetPALS — Shared Types
// ============================================

export type PetStatus = 'Available' | 'Adopted' | 'In Process'
export type PetType   = 'Dog' | 'Cat' | 'Bird' | 'Reptile'
export type UserRole  = 'adopter' | 'admin'
export type AdoptionStatus = 'Pending' | 'Approved' | 'Rejected'

export interface Pet {
  id: number
  name: string
  type: PetType
  breed: string
  age: string
  gender: string
  weight: string
  location: string
  status: PetStatus
  vaccinated: boolean
  neutered: boolean
  img: string
  desc: string
}

export interface User {
  id?: string
  name: string
  email: string
  role: UserRole
  phone?: string
}

export interface Adoption {
  id: number | string
  petId: number
  petName: string
  petImg: string
  petBreed: string
  housing: string
  otherPets: string
  motivation: string
  experience?: string
  status: AdoptionStatus
  date: string
}
