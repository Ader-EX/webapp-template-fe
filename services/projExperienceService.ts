import Cookies from "js-cookie";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ---------- TYPES ----------
export type ProjectExperience = {
  id: number;
  no_sales_order: string;
  customer_name: string;
  project_name: string;
  project_year: string;
  category: string;
  consulting_manager_id: number | null;
};

export type ProjectExperienceInput = {
  no_sales_order: string;
  customer_name: string;
  project_name: string;
  project_year: string;
  category: string;
};

export type ProjectExperienceAssignCM = {
  consulting_manager_id: number | null;
};

export type ProjectExperienceListResponse = {
  data: ProjectExperience[];
  total: number;
};

// ---------- SERVICE ----------
class ProjectExperienceService {
  private baseUrl = `${API_BASE_URL}/project-experience`;

  async getAll({
    skip = 0,
    limit = 10,
    search = "",
  }: {
    skip?: number;
    limit?: number;
    search?: string;
  }): Promise<ProjectExperienceListResponse> {
    const res = await fetch(
      `${this.baseUrl}?skip=${skip}&limit=${limit}&search=${search}`,
      {
        method: "GET",
        headers: this.getAuthHeaders(),
      }
    );

    return this.handleResponse(res);
  
  }
   async update(
      projId: number,
      projData: Partial<ProjectExperienceInput>
    ): Promise<ProjectExperienceInput> {
      const response = await fetch(`${this.baseUrl}/${projId}`, {
        method: "PATCH",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(projData),
      });
  
      return this.handleResponse(response);
    }

  async create(data: ProjectExperienceInput): Promise<ProjectExperience> {
    const res = await fetch(`${this.baseUrl}`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse(res);
  }

  async assignConsultingManager(
    id: number,
    data: ProjectExperienceAssignCM
  ): Promise<ProjectExperience> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse(res);
  }

  async delete(id: number): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    if (!res.ok) await this.handleResponse(res);
  }
  async export(): Promise<any> {
  const res = await fetch(`${this.baseUrl}/export/xlsx`, {
    method: "GET",
    headers: this.getAuthHeaders(),
  });

  const arrayBuffer = await res.arrayBuffer();
  return {
    data: new Blob([arrayBuffer], { 
      type: res.headers.get('content-type') || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    }),
    headers: Object.fromEntries(res.headers.entries())
  };
}

  // ---------- HELPERS ----------
  private async handleResponse(response: Response) {
    if (!response.ok) {
      let body;
      try {
        body = await response.json();
      } catch {
        body = { detail: `HTTP error: ${response.status}` };
      }
      throw body;
    }
    return response.json();
  }

  private getAuthHeaders(): HeadersInit {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No access token found");

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }
}

export const projectExperienceService = new ProjectExperienceService();
