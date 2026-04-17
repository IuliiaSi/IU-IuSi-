export interface JobItem {
    name: string;
    category: string;
}
export interface JobCategory {
    id: string;
    name: string;
    jobs: JobItem[];
}
export declare const jobCatalog: JobCategory[];
