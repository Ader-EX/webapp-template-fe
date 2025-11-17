import Cookies from "js-cookie";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ---------- TYPES ----------
export type ConsultingManager = {
  id: number;
  name: string;
  email: string;
  department_name: string;
};

export type ConsultingManagerInput = {
  name: string;
  email: string;
  department_name: string;
};

export type ConsultingManagerListResponse = {
  data: ConsultingManager[];
  total: number;
};

// ---------- SERVICE ----------
class ConsultingManagerService {
  private baseUrl = `${API_BASE_URL}/consulting-manager`;

  async getAll({
    skip = 0,
    limit = 10,
    search = "",
  }: {
    skip?: number;
    limit?: number;
    search?: string;
  }): Promise<ConsultingManagerListResponse> {
    const res = await fetch(
      `${this.baseUrl}?skip=${skip}&limit=${limit}&search=${search}`,
      {
        method: "GET",
        headers: this.getAuthHeaders(),
      }
    );

    return this.handleResponse(res);
  }

  async create(data: ConsultingManagerInput): Promise<ConsultingManager> {
    const res = await fetch(`${this.baseUrl}`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse(res);
  }

  async update(
    id: number,
    data: Partial<ConsultingManagerInput>
  ): Promise<ConsultingManager> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "PATCH",
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

export const consultingManagerService = new ConsultingManagerService();
