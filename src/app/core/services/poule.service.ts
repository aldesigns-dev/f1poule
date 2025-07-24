import { inject, Injectable } from "@angular/core";
import { addDoc, collection, collectionData, CollectionReference, deleteDoc, doc, docData, Firestore, getDoc, query, updateDoc, where } from "@angular/fire/firestore";
import { catchError, combineLatest, map, Observable, of, tap } from "rxjs";

import { Poule } from "../models/poule.model";

@Injectable({
  providedIn: 'root'
})
export class PouleService {
  private readonly firestore = inject(Firestore);
  private readonly pouleCollection = collection(this.firestore, 'poules') as CollectionReference<Poule>;

  async createPoule(data: {
    name: string,
    description: string,
    createdBy: string,
    createdAt: string,
    isPublic: boolean
  }): Promise<void> {
    try {
      const { name, description, createdBy, createdAt, isPublic } = data;
      console.log('[PouleService] Nieuwe poule data:', data);

      const inviteCode = await this.generateInviteCode();
      console.log('[PouleService] Generated inviteCode:', inviteCode);

      await addDoc(this.pouleCollection, {
        name,
        description,
        createdBy,
        createdAt,
        isPublic,
        inviteCode,
        members: [createdBy], // De maker is standaard lid van de poule.
      });
      console.log('[PouleService] Poule succesvol aangemaakt');
    } catch (error) {
      console.error('Registratiefout:', error);
      throw error;
    }
  }

  async updatePoule(id: string, changes: Partial<Poule>): Promise<void> {
    try {
      const pouleDocRef = doc(this.pouleCollection, id);
      await updateDoc(pouleDocRef, changes);
      console.log(`[PouleService] Poule ${id} succesvol bijgewerkt.`);
    } catch (error) {
      console.error(`[PouleService] Fout bij updaten poule ${id}:`, error);
      throw error;
    }
  }

  async deletePoule(id: string): Promise<void> {
    try {
      const pouleDocRef = doc(this.pouleCollection, id);
      await deleteDoc(pouleDocRef);
      console.log('[PouleService] Poule verwijderd:', id);
    } catch (error) {
      console.error('[PouleService] Fout bij verwijderen poule:', error);
      throw error;
    }
  }

  async joinPoule(pouleId: string, userId: string): Promise<void> {
    try {
      const pouleDocRef = doc(this.pouleCollection, pouleId);
      const snapshot = await getDoc(pouleDocRef);

      if (!snapshot.exists()) {
        throw new Error('Poule niet gevonden');
      }

      const poule = snapshot.data() as Poule;
      const currentMembers = poule.members || [];

      if (currentMembers.includes(userId)) {
        console.log('[PouleService] Gebruiker is al lid van de poule');
        return;
      }

      await updateDoc(pouleDocRef, {
        members: [...currentMembers, userId]
      });

      console.log('[PouleService] Gebruiker toegevoegd aan poule:', pouleId);
    } catch (error) {
      console.error('[PouleService] Fout bij lid worden van poule:', error);
      throw error;
    }
  }

  async leavePoule(pouleId: string, userId: string): Promise<void> {
    try {
      const pouleDocRef = doc(this.pouleCollection, pouleId);
      const snapshot = await getDoc(pouleDocRef);

      if (!snapshot.exists()) {
        throw new Error('Poule niet gevonden');
      }

      const poule = snapshot.data() as Poule;
      const currentMembers = poule.members || [];

      if (!currentMembers.includes(userId)) {
        console.log('[PouleService] Gebruiker is geen lid van deze poule');
        return;
      }

      const updatedMembers = currentMembers.filter(id => id !== userId);

      await updateDoc(pouleDocRef, {
        members: updatedMembers
      });

      console.log('[PouleService] Gebruiker verwijderd uit poule:', pouleId);
    } catch (error) {
      console.error('[PouleService] Fout bij verlaten van poule:', error);
      throw error;
    }
  }

  async updatePouleMembers(pouleId: string, members: string[]): Promise<void> {
    try {
      const pouleRef = doc(this.pouleCollection, pouleId);
      await updateDoc(pouleRef, { members });
    } catch (error) {
      console.error('Fout bij updaten leden:', error);
      throw error;
    }
  }

  getPoulesByUser$(uid: string): Observable<Poule[]> {
    const createdByQuery = query(this.pouleCollection, where('createdBy', '==', uid));
    const memberQuery = query(this.pouleCollection, where('members', 'array-contains', uid));

    const created$ = collectionData(createdByQuery, { idField: 'id' }) as Observable<Poule[]>;
    const member$ = collectionData(memberQuery, { idField: 'id' }) as Observable<Poule[]>;

    return combineLatest([created$, member$]).pipe(
      map(([created, member]) => {
        const map = new Map<string, Poule>();
        [...created, ...member].forEach(poule => {
          if (poule.id) {
            map.set(poule.id, poule);
          }
        });
        return Array.from(map.values());
      }),
      catchError(err => {
        console.error('[PouleService] Fout bij ophalen poules:', err);
        return of([]);
      })
    );
  }

  getPouleById$(id: string): Observable<Poule> {
    const docRef = doc(this.pouleCollection, id);
    return docData(docRef, { idField: 'id' }) as Observable<Poule>;
  }

  getAllPublicPoules$(): Observable<Poule[]> {
    const publicQuery = query(this.pouleCollection, where('isPublic', '==', true));
    return collectionData(publicQuery, { idField: 'id' }) as Observable<Poule[]>;
  }

  getPouleByInviteCode(code: string): Observable<Poule | null> {
    const inviteQuery = query(this.pouleCollection, where('inviteCode', '==', code));
    return collectionData(inviteQuery, { idField: 'id' }).pipe(
      tap(result => console.log('[PouleService] Invite result:', result)),
      map(poules => poules[0] ?? null)
    );
  }

  generateInviteCode(length = 6): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}