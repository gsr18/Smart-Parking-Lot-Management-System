export type RoleType = 'ROLE_ADMIN' | 'ROLE_STAFF';

export interface Company {
  id: number;
  name: string;
  companyCode: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  roles: string[];
  companyId?: number;
  companyName?: string;
  companyCode?: string;
  approvedByAdmin?: boolean;
}

export interface AuthResponse {
  accessToken?: string;
  tokenType?: string;
  id: number;
  username: string;
  email: string;
  fullName: string;
  roles: string[];
  companyId?: number;
  companyName?: string;
  companyCode?: string;
}

export interface PendingRegistration {
  id: number;
  fullName: string;
  email: string;
  username: string;
  companyName: string;
  companyId?: number;
  userType: string;
  status?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface ParkingSlot {
  id: number;
  slotNumber: string;
  floorNumber: number;
  slotType: 'CAR' | 'BIKE' | 'TRUCK';
  hourlyRate: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
  occupiedByVehicleNumber?: string;
}

export interface Vehicle {
  id: number;
  vehicleNumber?: string;
  registrationNumber?: string;
  vehicleType: 'CAR' | 'BIKE' | 'TRUCK';
  ownerName: string;
  ownerContact: string;
  currentlyParked?: boolean;
  activeSlotNumber?: string;
  createdAt: string;
}

export interface ReportResponse {
  reportPeriod: string;
  startDate: string;
  endDate: string;
  totalParkedVehicles: number;
  totalExitedVehicles: number;
  totalRevenue: number;
  carRevenue?: number;
  bikeRevenue?: number;
  truckRevenue?: number;
  averageDurationMinutes: number;
  vehicleDistribution?: {
    totalCars: number;
    totalBikes: number;
    totalTrucks: number;
    carPercentage: number;
    bikePercentage: number;
    truckPercentage: number;
  };
}

export interface ParkingSession {
  id: number;
  sessionNumber: string;
  vehicleNumber: string;
  ownerName: string;
  ownerContact: string;
  slotNumber: string;
  entryTime: string;
  exitTime?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  parkingFee?: number;
  durationMinutes?: number;
  staffId?: number;
  staffName?: string;
  vehicle?: Vehicle;
  slot?: ParkingSlot;
}

export interface CheckOutResponse {
  receiptNumber: string;
  vehicleNumber: string;
  slotNumber: string;
  ownerName: string;
  ownerContact: string;
  entryTime: string;
  exitTime: string;
  durationMinutes: number;
  parkingFee: number;
}
