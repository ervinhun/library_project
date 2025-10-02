export interface ProblemDetails {
    title: string;
    status?: number;
    traceId?: string;
    errors?: Record<string, string[]>
}