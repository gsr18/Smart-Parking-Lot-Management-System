import api from './api';
import { ApiResponse } from '../types';

export interface AuditLogData {
  id: number;
  adminUsername: string;
  adminFullName: string;
  actionType: string;
  entityName: string;
  entityId?: number;
  reason: string;
  timestamp: string;
}

export const auditLogService = {
  getAuditLogs: async (): Promise<AuditLogData[]> => {
    const response = await api.get<ApiResponse<AuditLogData[]>>('/audit-logs');
    return response.data.data;
  },
};
