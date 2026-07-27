import api from './api';
import { ApiResponse } from '../types';

export interface LayoutConfigDTO {
  totalFloors: number;
  floorTemplates: Record<number, string>; // e.g. { 1: "5x5", 2: "10x10" }
}

export interface CompanyLayoutDTO {
  id: number;
  name: string;
  companyCode: string;
  layoutConfig: string | null;
}

// Template definitions
export interface FloorTemplate {
  id: string;
  label: string;
  rows: number;
  cols: number;
  description: string;
}

export const FLOOR_TEMPLATES: FloorTemplate[] = [
  { id: '3x4',  label: 'Mini (3×4)',         rows: 3,  cols: 4,  description: '12 slots — ideal for a small gate or sub-section' },
  { id: '5x5',  label: 'Compact (5×5)',       rows: 5,  cols: 5,  description: '25 slots — standard small facility' },
  { id: '6x8',  label: 'Medium (6×8)',        rows: 6,  cols: 8,  description: '48 slots — mid-size parking facility' },
  { id: '8x10', label: 'Large (8×10)',        rows: 8,  cols: 10, description: '80 slots — large commercial facility' },
  { id: '10x12',label: 'Extra Large (10×12)', rows: 10, cols: 12, description: '120 slots — enterprise-level facility' },
];

export const companyService = {
  getMyCompanyLayout: async (): Promise<CompanyLayoutDTO> => {
    const response = await api.get<ApiResponse<CompanyLayoutDTO>>('/companies/my-layout');
    return response.data.data;
  },

  applyLayoutConfig: async (config: LayoutConfigDTO): Promise<CompanyLayoutDTO> => {
    const response = await api.put<ApiResponse<CompanyLayoutDTO>>('/companies/layout', config);
    return response.data.data;
  },
};
