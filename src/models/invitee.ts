import type { AvailabilityBlock } from "./availability-block";

// To Do: Add Account ID

export interface Invitee {
    id: string;
    availabilityPollId: string;
    email: string;
    status: string;
    availabilityBlocks: AvailabilityBlock[];
    dateResponded?: string
}

export interface CreateInvitee {
    availabilityPollId: string;
    email: string;
    status: string;
    availabilityBlocks?: AvailabilityBlock[];
}

export interface UpdateInvitee {
    status?: string;
    availabilityBlocks?: AvailabilityBlock[];
    dateResponded?: Date
}