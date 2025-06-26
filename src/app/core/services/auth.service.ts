import { inject, Injectable } from "@angular/core";
import { collection, doc, docData, Firestore, getDoc, getDocs, query, serverTimestamp, setDoc, Timestamp, updateDoc, where } from "@angular/fire/firestore";
import { Auth, authState, createUserWithEmailAndPassword, EmailAuthProvider, reauthenticateWithCredential, signInWithEmailAndPassword, signOut, updatePassword, updateProfile } from "@angular/fire/auth";
import { catchError, forkJoin, from, map, Observable, of, shareReplay, switchMap, tap } from "rxjs";

import { AppUser } from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly firestore = inject(Firestore);
  readonly authState$ = authState(this.auth);

  // Observable die realtime de huidige ingelogde gebruiker ophaalt uit Firestore.
  readonly currentUser$: Observable<AppUser | null> = this.authState$.pipe(
    switchMap(user => {
      if (!user) return of(null);
      const userRef = doc(this.firestore, 'users', user.uid);
      // docData() levert realtime updates van Firestore documentdata.
      return docData(userRef).pipe(
        map(data => ({ ...data, uid: user.uid }) as AppUser),
        tap(appUser => {
          if (appUser) {
            console.log('[AuthService] Ingelogde gebruiker:', appUser.username);
          }
        }),
        catchError(err => {
          console.error('Error loading user document:', err);
          return of(null);
        })
      );
    }),
    shareReplay(1) // Zorgt dat meerdere subscribers dezelfde stream delen.
  );

  // Boolean Observable: gebruiker ingelogd = true.
  readonly isAuthenticated$: Observable<boolean> = this.authState$.pipe(
    map(user => !!user)
  );

  // Create
  async createUser(data: {
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    password: string
  }): Promise<void> {
    try {
      // 1. Controleer of de username al bestaat in Firestore.
      const usernameQuery = query(
        collection(this.firestore, 'users'),
        where('username', '==', data.username)
      );
      const existing = await getDocs(usernameQuery);
      if (!existing.empty) throw new Error('Gebruikersnaam is al in gebruik');

      // 2. Gebruiker aanmaken in Firebase.
      const userCredential = await createUserWithEmailAndPassword(
        this.auth, 
        data.email, 
        data.password
      );
      const firebaseUser = userCredential.user;
      if (!firebaseUser) throw new Error('Registratie mislukt');

      // 3. Gebruikersnaam instellen als displayName in Firebase Auth.
      await updateProfile(firebaseUser, {
        displayName: data.username
      });

      // 4. Gebruikersdata opslaan in Firestore.
      const newUser: AppUser = {
        uid: firebaseUser.uid,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        createdAt: serverTimestamp() as Timestamp,
      };
      const userRef = doc(this.firestore, 'users', firebaseUser.uid);
      await setDoc(userRef, newUser);
    } catch (error) {
      console.error('Registratiefout:', error);
      throw error;
    }
  }

  // Read
  async loginWithUsername(username: string, password: string): Promise<AppUser> {
    try {
      console.log('[AuthService] Gebruikersnaam ontvangen:', username);
      // 1. Zoek e-mailadres op basis van gebruikersnaam.
      const usernameQuery = query(
        collection(this.firestore, 'users'),
        where('username', '==', username)
      );
      const querySnapshot = await getDocs(usernameQuery);
      if (querySnapshot.empty) throw new Error('Gebruiker niet gevonden.');

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data() as AppUser & { email: string };
      const email = userData.email;
      if (!email) throw new Error('Geen e-mailadres gevonden voor deze gebruiker.');
      console.log('[AuthService] E-mailadres gevonden:', email);

      // 2. Log in met e-mailadres en wachtwoord.
      const userCredential = await signInWithEmailAndPassword(
        this.auth, 
        userData.email, 
        password
      );
      console.log('[AuthService] Ingelogd met Firebase:', userCredential.user);

      const firebaseUser = userCredential.user;
      if (!firebaseUser) throw new Error('Login mislukt.');

      // 3. Ophalen Firestore User document.
      const userRef = doc(this.firestore, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) throw new Error('Gebruikersgegevens niet gevonden na login.');

      // Return Firestore document als User model.
      return userSnap.data() as AppUser;
    } catch (error) {
      console.error('Login mislukt:', error);
      throw error;
    }
  }

  // Update
  async updateAvatar(avatarFilename: string): Promise<void> {
    const firebaseUser = this.auth.currentUser;
    if (!firebaseUser) throw new Error('Geen gebruiker ingelogd');

    const avatarUrl = '/assets/avatars/' + avatarFilename;

    try {
      // Update Firebase Authentication profiel.
      await updateProfile(firebaseUser, { photoURL: avatarUrl });

      // Update Firestore gebruikersdocument.
      const userRef = doc(this.firestore, 'users', firebaseUser.uid);
      await updateDoc(userRef, { avatarUrl });

    } catch (error) {
      console.error('Fout bij het updaten van avatar:', error);
      throw(error);
    }
  }

  // Update
  async changePasswordWithReauth(currentPassword: string, newPassword: string): Promise<void> {
    const firebaseUser = this.auth.currentUser;
    if (!firebaseUser || !firebaseUser.email) throw new Error('Geen gebruiker ingelogd');

    const credential = EmailAuthProvider.credential(firebaseUser.email, currentPassword);

    try {
      await reauthenticateWithCredential(firebaseUser, credential);
      await updatePassword(firebaseUser, newPassword);
    } catch (error) {
      console.error('Fout bij wachtwoord wijzigen:', error);
      throw error; 
    }
  }
  
  getUserByUid$(uid: string): Observable<AppUser> {
    const userRef = doc(this.firestore, 'users', uid);
    return docData(userRef).pipe(
      map(data => {
        console.log('[AuthService] Gebruiker geladen:', data);
        return { ...data, uid } as AppUser;
      }),
      catchError(err => {
        console.error(`[AuthService] Kan gebruiker ${uid} niet ophalen:`, err);
        throw err;
      })
    );
  }

  getUsersByUids$(uids: string[]): Observable<AppUser[]> {
    if (!uids.length) {
      return of([]); // Lege lijst: lege Observable.
    }
    // Firestore ondersteunt max 10 waarden in een 'in'-query.
    const batches = [];

    while (uids.length) {
      const batch = uids.splice(0, 10);
      const q = query(collection(this.firestore, 'users'), where('uid', 'in', batch));
      batches.push(from(getDocs(q)).pipe(
        map(snapshot =>
          snapshot.docs.map(doc => ({ ...(doc.data() as AppUser), uid: doc.id }))
        )
      ));
    }

    return forkJoin(batches).pipe(
      map(batchArrays => batchArrays.flat())
    );
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }
}