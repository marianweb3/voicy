import api from "../lib/axios";

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    full_name: string;
    email: string;
    role: string;
    photo?: string;
  };
}

export interface Admin {
  id: number;
  full_name: string;
  email: string;
  role: string[];
  photo?: string;
  is_blocked: number;
  created_at: string;
  last_login_at: string | null;
}

export interface AdminCreateRequest {
  full_name: string;
  email: string;
  role: string;
  password: string;
  photo?: File;
}

export interface AdminEditRequest {
  full_name?: string;
  email?: string;
  role?: string;
  password?: string;
  photo?: File;
}

export interface AdminResponse {
  status: boolean;
  message: string;
  data?: Admin;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  };
}

export interface AdminsCatalogResponse {
  status: boolean;
  message: string;
  time_update: string;
  data: {
    items: Admin[];
    pagination: {
      total: number;
      page: number;
      per_page: number;
      total_pages: number;
    };
  };
}

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export interface DashboardKPIData {
  total_analyses: number;
  avg_call_duration: string;
  total_on_line: string;
  ai_score_avg: string;
  weak_followup_pct: number;
}

export interface DashboardKPIResponse {
  status: boolean;
  message: string;
  time_update: string;
  data: DashboardKPIData;
}

export interface DashboardDynamicsDataPoint {
  point_label: string;
  value: number;
}

export interface DashboardDynamicsResponse {
  status: boolean;
  message: string;
  time_update: string;
  type: "calls" | "ai_avg";
  range: "week" | "month" | "year";
  data: DashboardDynamicsDataPoint[];
}

export interface DashboardRejectsBreakdownItem {
  key: string;
  label: string;
  count: number;
  percent: number;
}

export interface DashboardRejectsTotals {
  total_calls: number;
  avg_ai_score: number;
  total_on_line: string;
  weak_followup_pct: number;
}

export interface DashboardRejectsData {
  scope: string;
  range: "all" | "year" | "month" | "week" | "day";
  totals: DashboardRejectsTotals;
  text: string;
  breakdown: DashboardRejectsBreakdownItem[];
}

export interface DashboardRejectsResponse {
  status: boolean;
  message: string;
  time_update: string;
  data: DashboardRejectsData;
}

export interface DashboardManagerData {
  name: string;
  ai_score: number;
}

export interface DashboardBestManagersResponse {
  status: boolean;
  message: string;
  data: DashboardManagerData[];
}

export interface DashboardWorstManagersResponse {
  status: boolean;
  message: string;
  data: DashboardManagerData[];
}

// Manager types
export interface Manager {
  id: number;
  name: string;
  photo?: string;
  // API response fields
  total_calls: number;
  avg_duration: string;
  ai_score_avg: string;
  ai_color_avg: string;
  top_rejects_text: string;
  // Additional fields that might be used in create/edit
  email?: string;
  phone?: string;
  crm_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ManagerCreateRequest {
  full_name: string;
  email: string;
  phone?: string;
  crm_id?: string;
  photo?: File;
  department_id?: number;
}

export interface ManagerEditRequest {
  full_name?: string;
  email?: string;
  phone?: string;
  crm_id?: string;
  photo?: File;
  department_id?: number;
}

export interface ManagerResponse {
  status: boolean;
  message: string;
  data?: Manager;
}

export interface ManagersCatalogResponse {
  status: boolean;
  message: string;
  time_update: string;
  data: {
    items: Manager[];
    pagination: {
      total: number;
      page: number;
      per_page: number;
      total_pages: number;
    };
  };
}

// Authentication API
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post("/login", credentials);
    return response.data;
  },

  getProfile: async (): Promise<Admin> => {
    const response = await api.get("/profile");
    return response.data.data; // Extract data from the nested response structure
  },
};

// Admins API
export const adminsAPI = {
  getCatalog: async (
    page: number = 1,
    per_page: number = 10,
    search: string = ""
  ): Promise<AdminsCatalogResponse> => {
    const response = await api.get("/admins/catalog", {
      params: { page, per_page, search },
    });
    return response.data;
  },

  create: async (adminData: AdminCreateRequest): Promise<AdminResponse> => {
    const formData = new FormData();
    formData.append("full_name", adminData.full_name);
    formData.append("email", adminData.email);
    formData.append("role", adminData.role);
    formData.append("password", adminData.password);

    if (adminData.photo) {
      formData.append("photo", adminData.photo);
    }

    const response = await api.post("/admins/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  edit: async (
    id: number,
    adminData: AdminEditRequest
  ): Promise<AdminResponse> => {
    const formData = new FormData();

    if (adminData.full_name) formData.append("full_name", adminData.full_name);
    if (adminData.email) formData.append("email", adminData.email);
    if (adminData.role) formData.append("role", adminData.role);
    if (adminData.password) formData.append("password", adminData.password);
    if (adminData.photo) formData.append("photo", adminData.photo);

    const response = await api.post(`/admins/edit/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  delete: async (id: number): Promise<AdminResponse> => {
    const response = await api.delete(`/admins/delete/${id}`);
    return response.data;
  },

  deletePhoto: async (id: number): Promise<AdminResponse> => {
    const response = await api.delete(`/admins/delete_photo/${id}`);
    return response.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getMainKPIs: async (): Promise<DashboardKPIResponse> => {
    const response = await api.get("/dashboard/main");
    return response.data;
  },

  getDynamics: async (
    range: "week" | "month" | "year" = "year",
    type: "calls" | "ai_avg" = "ai_avg"
  ): Promise<DashboardDynamicsResponse> => {
    const response = await api.get("/dashboard/dynamics", {
      params: { range, type },
    });
    return response.data;
  },

  getRejects: async (
    range: "all" | "year" | "month" | "week" | "day" = "day"
  ): Promise<DashboardRejectsResponse> => {
    const response = await api.get("/dashboard/rejects", {
      params: { range },
    });
    return response.data;
  },

  getBest: async (
    range: "week" | "month" | "year" = "week"
  ): Promise<DashboardBestManagersResponse> => {
    const response = await api.get("/dashboard/best", {
      params: { range },
    });
    return response.data;
  },

  getWorst: async (
    range: "week" | "month" | "year" = "year"
  ): Promise<DashboardWorstManagersResponse> => {
    const response = await api.get("/dashboard/worst", {
      params: { range },
    });
    return response.data;
  },
};

// Manager view types
export interface ManagerViewData {
  manager: {
    id: number;
    crm_id: number;
    full_name: string;
    email: string;
    photo?: string;
  };
  stats: {
    range: string;
    total_calls: number;
    avg_ai_score: string;
    avg_duration: string;
    total_duration: string;
  };
  rejects: {
    total: number;
    items: {
      name: string;
      value: number;
      color: string;
    }[];
    text: string;
  };
}

export interface ManagerViewResponse {
  status: boolean;
  message: string;
  time_update: string;
  data: ManagerViewData;
}

// Managers API
export const managersAPI = {
  getCatalog: async (
    page: number = 1,
    per_page: number = 10,
    search: string = ""
  ): Promise<ManagersCatalogResponse> => {
    const response = await api.get("/managers/catalog", {
      params: { page, per_page, search },
    });
    return response.data;
  },

  getView: async (
    id: number,
    range: "all" | "year" | "month" | "week" | "day" = "all"
  ): Promise<ManagerViewResponse> => {
    const response = await api.get(`/managers/view/${id}`, {
      params: { range },
    });
    return response.data;
  },

  create: async (
    managerData: ManagerCreateRequest
  ): Promise<ManagerResponse> => {
    const formData = new FormData();
    formData.append("full_name", managerData.full_name);
    formData.append("email", managerData.email);

    if (managerData.phone) formData.append("phone", managerData.phone);
    if (managerData.crm_id) formData.append("crm_id", managerData.crm_id);
    if (managerData.photo) formData.append("photo", managerData.photo);
    if (managerData.department_id)
      formData.append("department_id", managerData.department_id.toString());

    const response = await api.post("/managers/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  edit: async (
    id: number,
    managerData: ManagerEditRequest
  ): Promise<ManagerResponse> => {
    const formData = new FormData();

    if (managerData.full_name)
      formData.append("full_name", managerData.full_name);
    if (managerData.email) formData.append("email", managerData.email);
    if (managerData.phone) formData.append("phone", managerData.phone);
    if (managerData.crm_id) formData.append("crm_id", managerData.crm_id);
    if (managerData.photo) formData.append("photo", managerData.photo);
    if (managerData.department_id)
      formData.append("department_id", managerData.department_id.toString());

    const response = await api.post(`/managers/edit/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deletePhoto: async (id: number): Promise<ManagerResponse> => {
    const response = await api.delete(`/managers/delete_photo/${id}`);
    return response.data;
  },

  getDynamics: async (
    id: number,
    range: "week" | "month" | "year" = "year",
    type: "calls" | "ai_avg" = "calls"
  ): Promise<{
    status: boolean;
    message: string;
    type: string;
    range: string;
    data: Array<{
      point_label: string;
      value: number;
    }>;
  }> => {
    const response = await api.get(`/managers/dynamics/${id}`, {
      params: { range, type },
    });
    return response.data;
  },

  getCalls: async (
    id: number,
    page: number = 1,
    per_page: number = 10,
    search: string = ""
  ): Promise<{
    status: boolean;
    message: string;
    time_update: string;
    data: {
      items: Array<{
        id: number;
        time: string;
        date: string;
        duration: string;
        client_phone: string;
        ai_score: string;
        ai_color: string;
        status_label: string;
        status_color: string;
        can_open: boolean;
      }>;
      pagination: {
        total: number;
        page: number;
        per_page: number;
        total_pages: number;
      };
    };
  }> => {
    const response = await api.get(`/managers/calls/${id}`, {
      params: { page, per_page, search },
    });
    return response.data;
  },

  analyzeAI: async (analysisData: {
    id_crm: string;
    manager_id: string;
    client_phone: string;
    file: File;
  }): Promise<{ status: boolean; message: string; data?: any }> => {
    const formData = new FormData();
    formData.append("crm_order_id", analysisData.id_crm);
    formData.append("manager_id", analysisData.manager_id);
    formData.append("client_phone", analysisData.client_phone);
    formData.append("file", analysisData.file);

    const response = await api.post("/managers/ai", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

// Settings types
export interface Setting {
  id: number;
  status_id: number;
  status_name: string;
  field_id: number;
  prompt_full: string;
  prompt_for_table: string;
  enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SettingCreateRequest {
  status_id: number;
  status_name: string;
  field_id: number;
  prompt_full: string;
  prompt_for_table: string;
}

export interface SettingEditRequest {
  status_id: number;
  status_name: string;
  field_id: number;
  prompt: string;
}

export interface SettingResponse {
  status: boolean;
  message: string;
  data?: Setting;
}

export interface SettingsCatalogResponse {
  status: boolean;
  message: string;
  time_update: string;
  data: {
    items: Setting[];
    pagination: {
      total: number;
      page: number;
      per_page: number;
      total_pages: number;
    };
  };
}

// Settings API
export const settingsAPI = {
  getCatalog: async (
    page: number = 1,
    per_page: number = 10
  ): Promise<SettingsCatalogResponse> => {
    const response = await api.get("/settings/catalog", {
      params: { page, per_page },
    });
    return response.data;
  },

  create: async (
    settingData: SettingCreateRequest
  ): Promise<SettingResponse> => {
    const response = await api.post("/settings/create", settingData);
    return response.data;
  },

  edit: async (
    id: number,
    settingData: SettingEditRequest
  ): Promise<SettingResponse> => {
    const response = await api.post(`/settings/edit/${id}`, settingData);
    return response.data;
  },

  switch: async (id: number): Promise<SettingResponse> => {
    const response = await api.post(`/settings/switch/${id}`);
    return response.data;
  },
};

// Processes types
export interface ProcessStatistic {
  count: number;
  percent: number;
}

export interface ProcessStatisticsData {
  total: ProcessStatistic;
  search_call: ProcessStatistic;
  voice_to_text: ProcessStatistic;
  ai: ProcessStatistic;
  sent: ProcessStatistic;
}

export interface ProcessStatisticsResponse {
  status: boolean;
  message: string;
  time_update: string;
  data: ProcessStatisticsData;
}

export interface ProcessTask {
  id: string;
  date: string;
  time: string;
  stage_label: string;
  status_label: string;
  status_color: string;
}

export interface ProcessFilterOption {
  value: string;
  label: string;
}

export interface ProcessFilters {
  stages: ProcessFilterOption[];
  statuses: ProcessFilterOption[];
}

export interface ProcessFiltersApplied {
  stage: string;
  status: string;
  search: string | null;
  date_from: string | null;
  date_to: string | null;
}

export interface ProcessCatalogData {
  items: ProcessTask[];
  pagination: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
  filters: ProcessFilters;
  filters_applied: ProcessFiltersApplied;
}

export interface ProcessCatalogResponse {
  status: boolean;
  message: string;
  time_update: string;
  data: ProcessCatalogData;
}

// Processes API
export const processesAPI = {
  getStatistics: async (): Promise<ProcessStatisticsResponse> => {
    const response = await api.get("/processes/statistic");
    return response.data;
  },

  getCatalog: async (
    page: number = 1,
    per_page: number = 10,
    search: string = "",
    stage: string = "all",
    status: string = "all",
    date_from: string = "",
    date_to: string = ""
  ): Promise<ProcessCatalogResponse> => {
    const params: Record<string, string | number> = {
      page,
      per_page,
    };

    if (search) params.search = search;
    if (stage && stage !== "all") params.stage = stage;
    if (status && status !== "all") params.status = status;
    if (date_from) params.date_from = date_from;
    if (date_to) params.date_to = date_to;

    const response = await api.get("/processes/catalog", { params });
    return response.data;
  },
};

// Calls types
export interface Call {
  id: number;
  time: string;
  date: string;
  manager_id: number;
  manager_name: string;
  manager_photo: string;
  check: boolean;
  duration_call: string;
  client_phone: string;
  ai_score: string;
  ai_color: string;
  reject_reason: string;
  status_label: string;
  status_color: string;
  can_open: boolean;
}

export interface CallsCatalogData {
  items: Call[];
  pagination: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}

export interface CallsCatalogResponse {
  status: boolean;
  message: string;
  time_update: string;
  data: CallsCatalogData;
}

// Call View types
export interface CallViewInfo {
  date: string;
  manager_id: number;
  manager_name: string;
  manager_photo: string;
  duration_call: string;
  client_phone: string;
  recording_link: string;
  is_checked: boolean;
}

export interface CallViewAIScore {
  label: string;
  title: string;
  score: number;
}

export interface CallViewAI {
  ai_score: string;
  ai_color: string;
  status_label: string;
  status_color: string;
  reject_reason: string;
  scores: CallViewAIScore[];
  analysis_text: string;
}

export interface CallViewData {
  info: CallViewInfo;
  ai: CallViewAI;
}

export interface CallViewResponse {
  status: boolean;
  message: string;
  data: CallViewData;
}

// Call Transcript types
export interface CallTranscriptMessage {
  id: string;
  speaker: "manager" | "client";
  content: string;
  timestamp?: string;
}

export interface CallTranscriptData {
  transcript?: CallTranscriptMessage[];
  messages?: any[]; // Flexible structure for unknown API format
  [key: string]: any; // Allow for other potential fields
}

export interface CallTranscriptResponse {
  status: boolean;
  message: string;
  data: CallTranscriptData;
}

// Call Comments types
export interface CallCommentAdmin {
  name: string;
  photo: string;
}

export interface CallComment {
  id: number;
  admin: CallCommentAdmin;
  text: string;
  created_human: string;
}

export interface CallCommentsData {
  items: CallComment[];
}

export interface CallCommentsResponse {
  status: boolean;
  message: string;
  data: CallCommentsData;
}

export interface AddCommentRequest {
  text: string;
}

export interface AddCommentResponse {
  status: boolean;
  message: string;
  data?: any;
}

// Calls API
export const callsAPI = {
  getCatalog: async (
    page: number = 1,
    per_page: number = 10,
    search: string = "",
    manager_id?: number,
    is_checked?: number,
    ai_score?: string,
    reject_reason?: string,
    status?: string,
    date_from?: string,
    date_to?: string,
    department_id?: number
  ): Promise<CallsCatalogResponse> => {
    const params: Record<string, string | number> = {
      page,
      per_page,
    };

    if (search) params.search = search;
    if (manager_id) params.manager_id = manager_id;
    if (is_checked !== undefined) params.is_checked = is_checked;
    if (ai_score) params.ai_score = ai_score;
    if (reject_reason) params.reject_reason = reject_reason;
    if (status) params.status = status;
    if (date_from) params.date_from = date_from;
    if (date_to) params.date_to = date_to;
    if (department_id) params.department_id = department_id;

    const response = await api.get("/calls/catalog", { params });
    return response.data;
  },

  getView: async (id: number): Promise<CallViewResponse> => {
    const response = await api.get(`/calls/view/${id}`);
    return response.data;
  },

  checkCall: async (
    id: number
  ): Promise<{ status: boolean; message: string }> => {
    const response = await api.post(`/calls/check/${id}`);
    return response.data;
  },

  getTranscript: async (id: number): Promise<CallTranscriptResponse> => {
    const response = await api.get(`/calls/transcript/${id}`);
    return response.data;
  },

  getComments: async (id: number): Promise<CallCommentsResponse> => {
    const response = await api.get(`/calls/comments/${id}`);
    return response.data;
  },

  addComment: async (
    id: number,
    commentData: AddCommentRequest
  ): Promise<AddCommentResponse> => {
    const response = await api.post(`/calls/add_comment/${id}`, commentData);
    return response.data;
  },
};

// Export all APIs
export const apiService = {
  auth: authAPI,
  admins: adminsAPI,
  managers: managersAPI,
  dashboard: dashboardAPI,
  settings: settingsAPI,
  processes: processesAPI,
  calls: callsAPI,
};
