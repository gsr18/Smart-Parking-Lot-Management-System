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
  slotType: SlotType;
  hourlyRate: number;
  status: SlotStatus;
  occupiedByVehicleNumber?: string;
}

export interface Vehicle {
  id: number;
  vehicleNumber?: string;
  registrationNumber?: string;
  vehicleType: VehicleType;
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

// ==========================================
// Added missing types to resolve build issues
// ==========================================

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export type VehicleType = 'CAR' | 'BIKE' | 'TRUCK';
export type SlotType = 'CAR' | 'BIKE' | 'TRUCK';
export type SlotStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'DISABLED';
export type PaymentMethod = 'CASH' | 'CARD' | 'UPI' | 'MOBILE' | 'WALLET' | 'OTHER';
export type ParkingStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface AiChatResponse {
  response: string;
  suggestedActions?: string[];
  provider?: string;
  confidenceScore?: number;
}

export type ReportData = ReportResponse;

export interface SlotRecommendation {
  slotNumber: string;
  slotType: 'CAR' | 'BIKE' | 'TRUCK';
  floorNumber: number;
  reason: string;
  aiRecommendationSummary?: string;
}

export interface DashboardSummary {
  totalSlots: number;
  availableSlots: number;
  occupiedSlots: number;
  disabledSlots: number;
  occupancyPercentage: number;
  activeSessions: number;
  vehiclesParkedToday: number;
  vehiclesExitedToday: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  lifetimeRevenue: number;
}

export interface RecentActivity {
  sessionId: number;
  vehicleNumber: string;
  vehicleType: 'CAR' | 'BIKE' | 'TRUCK';
  slotNumber: string;
  entryTime: string;
  exitTime?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

export interface VehicleDistribution {
  totalCars: number;
  totalBikes: number;
  totalTrucks: number;
  carPercentage: number;
  bikePercentage: number;
  truckPercentage: number;
}

export interface CheckInRequest {
  vehicleNumber: string;
  vehicleType: 'CAR' | 'BIKE' | 'TRUCK';
  ownerName?: string;
  ownerContact?: string;
  preferredSlotNumber?: string;
}

export interface CheckInResponse {
  sessionId: number;
  vehicleNumber: string;
  vehicleType: 'CAR' | 'BIKE' | 'TRUCK';
  ownerName: string;
  slotNumber: string;
  floorNumber: number;
  entryTime: string;
  status: string;
}

export interface CheckOutRequest {
  vehicleNumber?: string;
  slotNumber?: string;
  paymentMethod?: string;
}

export interface RevenueSummary {
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  lifetimeRevenue: number;
}

