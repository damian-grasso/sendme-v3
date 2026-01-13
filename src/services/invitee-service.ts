import { db } from '../config/firebase';
import { collection, doc, getDoc, addDoc, updateDoc, DocumentReference, DocumentSnapshot, query, getDocs, where, deleteDoc } from "firebase/firestore";
import type { CreateInvitee, Invitee, UpdateInvitee } from '../models/invitee';

const INVITEES_COLLECTION_NAME = "invitees";

export async function getInviteeById(id: string): Promise <Invitee | null> {

  try {
    console.log(`Attempting to retrieve Invitee ${id}...`);

    const ref: DocumentReference = doc(collection(db, INVITEES_COLLECTION_NAME), id);
    const snapshot: DocumentSnapshot = await getDoc(ref);

    if (snapshot.exists())
      return { ...snapshot.data() } as Invitee;
    else
      throw new Error("Invitee object not found!");
  }

  catch (error) {
    console.error(error);
    return null;
  }
}

export async function createInvitee(data: CreateInvitee): Promise <Invitee | null> {

  console.log(`Attempting to create Invitee...`);

  try {
    const ref: DocumentReference = await addDoc(collection(db, INVITEES_COLLECTION_NAME), data);
    return { id: ref.id, ...data } as Invitee;
  }

  catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateInvitee(data: UpdateInvitee): Promise <boolean | null> {

  console.log(`Attempting to update Invitee ${data.id}...`);

  try {
    const { id, ...updatedFields } = data;
    
    await updateDoc(doc(db, INVITEES_COLLECTION_NAME, id), {
        updatedFields
    });

    return true;
  }

  catch (error) {
    console.error(error);
    return false;
  }
}

export async function deleteInvitee(id: string): Promise <boolean | null> {

  console.log(`Attempting to delete Invitee ${id}...`);

  try {
    await deleteDoc(doc(db, INVITEES_COLLECTION_NAME, id));
    return true;
  }

  catch (error) {
    console.error(error);
    return false;
  }
}

export async function getInviteesByAvailabilityPollIds(availabilityPollIds: string[]): Promise <Invitee[]> {

  try {
    console.log(`Attempting to retrieve Invitees for Availability Polls...`);

    let invitees: Invitee[] = [] as Invitee[];

    const q = query(
      collection(db, INVITEES_COLLECTION_NAME),
      where("availabilityPollId", "in", availabilityPollIds)
    );
    const snapshot: any = await getDocs(q);

    snapshot.forEach((doc: any) => {
        invitees.push({ id: doc.id, ...doc.data() } as Invitee);
    });
      
    return invitees;
  }

  catch (error) {
    console.error(error);
    return [] as Invitee[];
  }
}

export async function getInviteesByAvailabilityPoll(availabilityPollId: string): Promise <Invitee[]> {

  try {
    console.log(`Attempting to retrieve Invitees for Availability Poll ${availabilityPollId}...`);

    let invitees: Invitee[] = [] as Invitee[];

    const q = query(
      collection(db, INVITEES_COLLECTION_NAME),
      where("availabilityPollId", "==", availabilityPollId)
    );
    const snapshot: any = await getDocs(q);

    snapshot.forEach((doc: any) => {
        invitees.push({ id: doc.id, ...doc.data() } as Invitee);
    });
      
    return invitees;
  }

  catch (error) {
    console.error(error);
    return [] as Invitee[];
  }
}

export async function deleteInviteesByAvailabilityPoll(availabilityPollId: string): Promise <string[] | null> {

  try {
    console.log(`Attempting to delete Invitees for Availability Poll ${availabilityPollId}...`);

    let inviteesToDelete = [] as string[];

    const q = query(
      collection(db, INVITEES_COLLECTION_NAME),
      where("availabilityPollId", "==", availabilityPollId)
    );
    const snapshot: any = await getDocs(q);

    snapshot.forEach((doc: DocumentSnapshot) => {
        inviteesToDelete.push(doc.id)
    });

    for (var invitee of inviteesToDelete)
        await deleteDoc(doc(db, INVITEES_COLLECTION_NAME, invitee));

    return inviteesToDelete;
  }

  catch (error) {
    console.error(error);
    return null;
  }
}
