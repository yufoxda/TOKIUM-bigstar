import axios from "axios";

export interface Application {
  id: string;
  status: string;
  data_of_use: string;
  amount: number;
  spend_to: string;
  keihi_class: string;
  purpose: string;
  invoice_number?: number;
  contact_number?: number;
  memo?: string;
  image_save?: string;
  created_at: string;
  updated_at: string;
}
export const fetchApplications = async (): Promise<Application[]> => {
  try {
    const response = await axios.get<Application[]>(
      "http://localhost:3000/api/v1/keihi/index"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching applications:", error);
    throw error;
  }
};
