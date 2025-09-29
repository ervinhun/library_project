import { LibraryClient } from "../models/generated-client";
import {API_BASE_URL_PROD} from "./api.ts";

export const client = new LibraryClient(API_BASE_URL_PROD);
