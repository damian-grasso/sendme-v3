// To Do: Add Account ID

import type { Timestamp } from "firebase/firestore";

export interface AvailabilityPoll {
    id: string;
    title: string;
    startDate: Timestamp;
    endDate: Timestamp;
    status: string;
    link: string;
    createdAt: Timestamp;
}

export interface CreateAvailabilityPoll {
    title: string;
    startDate: Timestamp;
    endDate: Timestamp;
    status: string;
    link: string;
    createdAt: Timestamp;
}

export interface UpdateAvailabilityPoll {
    id: string;
    title: string;
    startDate: Timestamp;
    endDate: Timestamp;
    status: string;
}