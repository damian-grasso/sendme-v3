// To Do: Add Account ID

export interface AvailabilityPoll {
    id: string;
    title: string;
    collectionType: "date_range" | "dates";
    status: string;
}

export interface CreateAvailabilityPoll {
    title: string;
    collectionType: "date_range" | "dates";
    status: string;
}

export interface UpdateAvailabilityPoll {
    id: string;
    title?: string;
    collectionType?: "date_range" | "dates";
    status?: string;
}