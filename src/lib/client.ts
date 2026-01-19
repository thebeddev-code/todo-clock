import createRouteMatcher from '@tscircuit/routematch'
import { db } from './server/db';


// TODO: A better type maybe?
type Options = Record<string, unknown>

const routeMatcher = createRouteMatcher([
  "todos/[id]",
  "todos",
])

function handleDesktopClientRequest(method: string, route: string, options?: Options) {
  const result = routeMatcher(route);
  switch (result?.matchedRoute) {
    case "todos": {
      if (method === "GET") {
        return db.select("SELECT * FROM todos")
      }
    }
  }
}

class ApiClient {
  private isDesktop = typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
  private baseUrl = "http://localhost:5000/api/v1/";

  private async request<T>(
    method: string,
    route: string,
    options?: Options,
  ): Promise<T> {

    if (this.isDesktop) {
      return handleDesktopClientRequest(method, route, options) as T;
    }
    // TODO: implement web client logic
    throw new Error("Not yet implemented!")
  }

  async get<T>(url: string, options?: Options) {
    return this.request<T>("GET", url, options);
  }

  async create<T>(
    url: string,
    options: Options
  ) {
    return this.request<T>("POST", url, options);
  }

  async update<T>(
    url: string,
    options: Options
  ) {
    return this.request<T>("PATCH", url, options);
  }

  async delete<T>(
    url: string,
  ) {
    return this.request<T>("DELETE", url);
  }
}

export const api = new ApiClient();
