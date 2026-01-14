// To Do: Add Account ID

import type { Timestamp } from "firebase/firestore";

export interface AvailabilityPoll {
    id: string;
    title: string;
    pollStartDate: Timestamp | null;
    pollEndDate: Timestamp;
    startDate: Timestamp;
    endDate: Timestamp;
    status: string;
    reminderSent: boolean;
    createdAt: Timestamp;
}

export interface CreateAvailabilityPoll {
    title: string;
    pollEndDate: Timestamp;
    startDate: Timestamp;
    endDate: Timestamp;
    status: string;
    reminderSent: boolean;
    createdAt: Timestamp;
}

export interface UpdateAvailabilityPoll {
    id: string;
    title?: string;
    pollStartDate?: Timestamp;
    pollEndDate?: Timestamp;
    startDate?: Timestamp;
    endDate?: Timestamp;
    status?: string;
    reminderSent?: boolean;
}