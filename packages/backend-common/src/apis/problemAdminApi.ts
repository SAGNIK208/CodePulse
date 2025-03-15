import axiosInstance from "../axiosInstance";
import { PROBLEM_ADMIN_SERVICE_URL } from "@repo/config/src/constant";

const PROBLEM_ADMIN_API_URL = `${PROBLEM_ADMIN_SERVICE_URL}/api/v1`;

async function fetchProblemDetails(problemId: string){
  try {
    const uri = `${PROBLEM_ADMIN_API_URL}/problems/${problemId}`;
    const response = await axiosInstance.get(uri);
    console.log("Api response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Something went wrong while fetching problem details", error);
    return null;
  }
}

export { fetchProblemDetails };
