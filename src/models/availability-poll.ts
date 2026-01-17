// To Do: Add Account ID

import type { Timestamp } from "firebase/firestore";

export interface AvailabilityPoll {
    id: string;
    title: string;
    dates: string[];
    status: string;
    createdAt: Timestamp;
}

export interface CreateAvailabilityPoll {
    title: string;
    dates: string[];
    status: string;
    createdAt: Timestamp;
}

export interface UpdateAvailabilityPoll {
    id: string;
    title: string;
    dates: string[];
    status: string;
}