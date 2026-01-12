import { db } from '../config/firebase';
import { collection, doc, getDoc, addDoc, updateDoc, DocumentReference, DocumentSnapshot, query, getDocs, deleteDoc } from "firebase/firestore";
import type { AvailabilityPoll, CreateAvailabilityPoll, UpdateAvailabilityPoll } from '../models/availability-poll';

const AVAILABILITY_POLLS_COLLECTION_NAME = "availability_polls";

export async function getAvailabilityPollById(id: string): Promise <AvailabilityPoll | null> {

  try {
    console.log(`Attempting to retrieve Availability Poll ${id}...`);

    const ref: DocumentReference = doc(collection(db, AVAILABILITY_POLLS_COLLECTION_NAME), id);
    const snapshot: DocumentSnapshot = await getDoc(ref);

    if (snapshot.exists())
      return { ...snapshot.data() } as AvailabilityPoll;
    else
      throw new Error("Availability Poll object not found!");
  }

  catch (error) {
    console.error(error);
    return null;
  }
}

// In future, you should filter by accountId
export async function getAvailabilityPollsByAccount(): Promise <AvailabilityPoll[]> {

  try {
    console.log(`Attempting to retrieve Availability Polls...`);

    let polls: AvailabilityPoll[] = [] as AvailabilityPoll[];

    const q = query(
      collection(db, AVAILABILITY_POLLS_COLLECTION_NAME),
      //where("clubId", "==", clubId)
    );
    const snapshot: any = await getDocs(q);

    snapshot.forEach((doc: any) => {
      polls.push({ id: doc.id, ...doc.data() } as AvailabilityPoll);
    });
      
    return polls;
  }

  catch (error) {
    console.error(error);
    return [] as AvailabilityPoll[];
  }
}

export async function createAvailabilityPoll(data: CreateAvailabilityPoll): Promise <AvailabilityPoll | null> {

  console.log(`Attempting to create Availability Poll...`);

  try {
    const ref: DocumentReference = await addDoc(collection(db, AVAILABILITY_POLLS_COLLECTION_NAME), data);
    return { id: ref.id, ...data } as AvailabilityPoll;
  }

  catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateAvailabilityPoll(data: UpdateAvailabilityPoll): Promise <boolean | null> {

  console.log(`Attempting to update Availability Poll ${data.id}...`);

  try {
    const { id, ...updatedFields } = data;
    
    await updateDoc(doc(db, AVAILABILITY_POLLS_COLLECTION_NAME, id), {
        updatedFields
    });

    return true;
  }

  catch (error) {
    console.error(error);
    return false;
  }
}

export async function deleteAvailabilityPoll(id: string): Promise <boolean | null> {

  console.log(`Attempting to delete Availability Poll ${id}...`);

  try {
    await deleteDoc(doc(db, AVAILABILITY_POLLS_COLLECTION_NAME, id));
    return true;
  }

  catch (error) {
    console.error(error);
    return false;
  }
}
