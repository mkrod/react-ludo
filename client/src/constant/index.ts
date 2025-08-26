import type { Response } from "./types";

export const server = "https://localhost:4000";
export const client = "http://localhost:5173/";
const redirect_url = `${server}/auth/mkgameo/callback`;
export const authClient = `http://localhost:8000/api/oauth?client_id=mkgameo&redirect_uri=${redirect_url}&response_type=code&scope=user_info`;


export const serverRequest = async (
    method: "post" | "get" | "put",
    route: string,
    data?: any,
    type?: "json" | "form" | "formdata"
  ): Promise<Response> => {
    const headers: HeadersInit = {};
  
    if (type === "json") {
      headers["Content-Type"] = "application/json";
    } else if (type === "form") {
      headers["Content-Type"] = "application/x-www-form-urlencoded";
    }
    // Don't set Content-Type for FormData
  
    const options: RequestInit = {
      method: method.toUpperCase(),
      headers,
      credentials: "include",
    };
  
    if (method === "post" || method === "put") {
      if (type === "json") {
        options.body = JSON.stringify({ ...data });
      } else if (type === "form") {
        options.body = new URLSearchParams({ ...data }).toString();
      } else if (type === "formdata") {
        options.body = data; // data is already a FormData instance
        // Do not set Content-Type manually
      }
    } else if (method === "get" && data) {
      route += `?${new URLSearchParams(data).toString()}`;
    }
  
    const response = await fetch(`${server}/${route}`, options);
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    return response.json() as Promise<Response>;
  };