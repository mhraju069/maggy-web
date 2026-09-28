/**
 * Unified API Integration Layer Exports
 * 
 * Usage:
 * import { ApiClient, authService, ENDPOINTS, useApi } from "@/lib/api";
 */

export { default as ApiClient } from "./client";
export * from "./config";
export * from "./endpoints";
export * from "./services";
export * from "./token";
export * from "./types";
export { default as useApi } from "../../hooks/useApi";

