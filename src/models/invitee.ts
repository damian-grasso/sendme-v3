import type { Timestamp } from "firebase/firestore";
import type { AvailabilityBlock } from "./availability-block";

export interface Invitee {
    id: string;
    availabilityPollId: string;
    name: string;
    email?: string;
    availabilityBlocks: AvailabilityBlock[];
    dateResponded?: Timestamp
}

export interface CreateInvitee {
    availabilityPollId: string;
    name: string;
    email?: string;
    availabilityBlocks?: AvailabilityBlock[];
    dateResponded: Timestamp
}

export interface UpdateInvitee {
    id: string;
    availabilityBlocks?: AvailabilityBlock[];
}