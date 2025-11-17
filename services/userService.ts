import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ---------- TYPES ----------
export type UserIn = {
  id: number;
  username: string;
  name:string;
  email: string;
  department_name: string | null;
  created_at: string;
};

export type UserOut = {
  username: string;
  name:string;
  email: string;
  department_name?: string;
  password: string;
};

export type UserListResponse = {
  data: UserIn[];
  total: number;
};

// ---------- SERVICE ----------
class UserService {
  private baseUrl = `${API_BASE_URL}`;

  async getAllUsers({
    skip = 0,
    limit = 10,
    search = "",
  }: {
    skip?: number;
    limit?: number;
    search?: string;
  }): Promise<UserListResponse> {
    const response = await fetch(
      `${this.baseUrl}/users?skip=${skip}&limit=${limit}&search=${search}`,
      {
        method: "GET",
        headers: this.getAuthHeaders(),
      }
    );
    return this.handleResponse(response);
  }

  // CREATE
  async createUser(userData: UserOut): Promise<UserIn> {
    const response = await fetch(`${this.baseUrl}/users`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  // DELETE
  async deleteUser(userId: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/users/${userId}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      await this.handleResponse(response);
    }
  }

  // UPDATE
  async updateUser(
    userId: number,
    userData: Partial<UserOut>
  ): Promise<UserIn> {
    const response = await fetch(`${this.baseUrl}/users/${userId}`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    return this.handleResponse(response);
  }

  // ---------- HELPERS ----------
  private async handleResponse(response: Response) {
    if (!response.ok) {
      let errorBody;
      try {
        errorBody = await response.json();
      } catch {
        errorBody = { detail: `HTTP error: ${response.status}` };
      }
      throw errorBody;
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

export const userService = new UserService();
