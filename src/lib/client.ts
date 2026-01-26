import { isTauri } from '@tauri-apps/api/core';
import * as backend from './backend/router';
import type { EndpointOptions, Endpoints } from './backend/router';

class ApiClient {
  constructor() {
  }
  private async request<T>(
    method: string,
    route: string,
    options?: unknown,
  ): Promise<T> {

    if (isTauri()) {
      return backend.handleRequest(method, route, options) as T;
    }
    // TODO: implement web client logic
    // throw new Error("Not yet implemented!")
    return [] as T;
  }

  async get<E extends Endpoints,
    M extends keyof typeof backend.routerConfig[E]
  >(url: string, options?: EndpointOptions<E, M>) {
    return this.request("GET", url, options);
  }

  async create<E extends Endpoints,
    M extends keyof typeof backend.routerConfig[E]
  >(
    url: string,
    options: EndpointOptions<E, M>
  ) {
    return this.request("POST", url, options);
  }

  async update<E extends Endpoints,
    M extends keyof typeof backend.routerConfig[E]
  >(
    url: string,
    options: EndpointOptions<E, M>
  ) {
    return this.request("PATCH", url, options);
  }

  async delete<E extends Endpoints,
    M extends keyof typeof backend.routerConfig[E]
  >(
    url: string,
    options: EndpointOptions<E, M>
  ) {
    return this.request("DELETE", url, options);
  }
}

export const api = new ApiClient();
