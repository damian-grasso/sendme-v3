import type { Timestamp } from "firebase/firestore";
import type { AvailabilityBlock } from "./availability-block";

// To Do: Add Account ID

export interface Invitee {
    id: string;
    availabilityPollId: string;
    email: string;
    status: string;
    availabilityBlocks: AvailabilityBlock[];
    dateResponded?: Timestamp
}

export interface CreateInvitee {
    availabilityPollId: string;
    email: string;
    status: string;
    availabilityBlocks?: AvailabilityBlock[];
}

export interface UpdateInvitee {
    id: string;
    status?: string;
    availabilityBlocks?: AvailabilityBlock[];
    dateResponded?: Timestamp
}