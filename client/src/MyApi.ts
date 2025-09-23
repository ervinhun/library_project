import {Api} from "../Api.ts";

// Set VITE_API_BASE_URL in your environment to override the default API base URL.
export const MyApi = new Api({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://server-nameless-star-9223.fly.dev'
});