import axiosInstance from "@/config/axiosConfig";
import type {
  CreateTournamentCategoryRequest,
  CreateTournamentCategoryResponse,
  DeleteTournamentCategoryResponse,
  GetTournamentCategoriesResponse,
  GetTournamentCategoryResponse,
  UpdateTournamentCategoryRequest,
  UpdateTournamentCategoryResponse,
} from "@/types/tournament.types";

class TournamentCategoryService {
  private readonly baseURL = "/tournament-categories";

  private toPageParams(page: number = 1, limit: number = 10) {
    return { page, limit };
  }

  /**
   * Create tournament category
   * POST /api/tournament-categories
   */
  async createTournamentCategory(
    data: CreateTournamentCategoryRequest,
  ): Promise<CreateTournamentCategoryResponse> {
    const response = await axiosInstance.post<CreateTournamentCategoryResponse>(
      this.baseURL,
      data,
    );
    return response.data;
  }

  /**
   * Get all tournament categories
   * GET /api/tournament-categories
   */
  async getAllTournamentCategories(
    page: number = 1,
    limit: number = 10,
  ): Promise<GetTournamentCategoriesResponse> {
    const response = await axiosInstance.get<GetTournamentCategoriesResponse>(
      this.baseURL,
      { params: this.toPageParams(page, limit) },
    );
    return response.data;
  }

  /**
   * Get tournament category by ID
   * GET /api/tournament-categories/{id}
   */
  async getTournamentCategoryById(
    id: number,
  ): Promise<GetTournamentCategoryResponse> {
    const response = await axiosInstance.get<GetTournamentCategoryResponse>(
      `${this.baseURL}/${id}`,
    );
    return response.data;
  }

  /**
   * Update tournament category
   * PUT /api/tournament-categories/{id}
   */
  async updateTournamentCategory(
    id: number,
    data: UpdateTournamentCategoryRequest,
  ): Promise<UpdateTournamentCategoryResponse> {
    const response = await axiosInstance.put<UpdateTournamentCategoryResponse>(
      `${this.baseURL}/${id}`,
      data,
    );
    return response.data;
  }

  /**
   * Delete tournament category
   * DELETE /api/tournament-categories/{id}
   */
  async deleteTournamentCategory(
    id: number,
  ): Promise<DeleteTournamentCategoryResponse> {
    await axiosInstance.delete(`${this.baseURL}/${id}`);
    return {
      success: true,
      message: "Tournament category deleted successfully",
      data: undefined,
    };
  }

  /**
   * Get categories by tournament
   * GET /api/tournament-categories/tournament/{tournamentId}
   */
  async getCategoriesByTournament(
    tournamentId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<GetTournamentCategoriesResponse> {
    const response = await axiosInstance.get<GetTournamentCategoriesResponse>(
      `${this.baseURL}/tournament/${tournamentId}`,
      { params: this.toPageParams(page, limit) },
    );
    return response.data;
  }
}

export default new TournamentCategoryService();
