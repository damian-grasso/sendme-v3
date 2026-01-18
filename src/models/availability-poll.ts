// To Do: Add Account ID

import type { Timestamp } from "firebase/firestore";

export interface AvailabilityPoll {
    id: string;
    title: string;
    dates: string[];
    status: string;
    createdAt: Timestamp;
    accountId: string;
}

export interface CreateAvailabilityPoll {
    title: string;
    dates: string[];
    status: string;
    createdAt: Timestamp;
    accountId: string;
}

export interface UpdateAvailabilityPoll {
    id: string;
    title: string;
    dates: string[];
    status: string;
}