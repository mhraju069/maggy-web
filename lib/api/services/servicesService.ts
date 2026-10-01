/**
 * Services API Service
 * Fetches services from http://localhost/api/services/
 */

import ApiClient from "../client";
import { ENDPOINTS } from "../endpoints";
import { ServiceItem } from "../types";

export const servicesService = {
  /**
   * Get list of services from http://localhost/api/services/
   * Optionally filtered by service_type (e.g. 'sauna', 'arrangement', 'activity', 'lunchroom')
   */
  async getServices(serviceType?: string): Promise<ServiceItem[]> {
    const response = await ApiClient.get<ServiceItem[] | { results: ServiceItem[] }>(
      ENDPOINTS.SERVICES.LIST,
      {
        skipAuth: true,
        params: serviceType ? { service_type: serviceType } : undefined,
      }
    );

    const items = Array.isArray(response)
      ? response
      : response?.results || [];

    if (serviceType) {
      return items.filter(
        (item) => item.service_type?.toLowerCase() === serviceType.toLowerCase()
      );
    }

    return items;
  },

  /**
   * Get details of a single service
   */
  async getServiceDetails(id: string | number): Promise<ServiceItem> {
    return ApiClient.get<ServiceItem>(ENDPOINTS.SERVICES.DETAIL(id), { skipAuth: true });
  },
};

export default servicesService;
