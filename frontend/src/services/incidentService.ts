import api from './api';
import { ApiResponse } from '../types';

export interface IncidentData {
  id: number;
  incidentNumber: string;
  reportedByUsername: string;
  reportedByFullName: string;
  slotNumber?: string;
  vehicleNumber?: string;
  type: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  notes: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  adminNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface IncidentRequest {
  slotId?: number;
  vehicleNumber?: string;
  type: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  notes: string;
}

export const incidentService = {
  reportIncident: async (req: IncidentRequest): Promise<IncidentData> => {
    const response = await api.post<ApiResponse<IncidentData>>('/incidents', req);
    return response.data.data;
  },

  resolveIncident: async (id: number, adminNotes?: string): Promise<IncidentData> => {
    const response = await api.put<ApiResponse<IncidentData>>(`/incidents/${id}/resolve`, null, {
      params: { adminNotes },
    });
    return response.data.data;
  },

  getCompanyIncidents: async (): Promise<IncidentData[]> => {
    const response = await api.get<ApiResponse<IncidentData[]>>('/incidents');
    return response.data.data;
  },
};
