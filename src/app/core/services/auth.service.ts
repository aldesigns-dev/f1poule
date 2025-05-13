import { inject, Injectable } from "@angular/core";
import { collection, doc, Firestore, getDocs, query, serverTimestamp, setDoc, where } from "@angular/fire/firestore";
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, User } from "@angular/fire/auth";
import { from, map, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  readonly authState$ = authState(this.auth);

  // Boolean Observable die true is als gebruiker is ingelogd.
  readonly isAuthenticated$: Observable<boolean> = this.authState$.pipe(
    map(user => !!user)
  );

  async createUser(data: {
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    password: string
  }): Promise<void> {
    try {
      // Controleer of de username al bestaat in Firestore.
      const usersRef = collection(this.firestore, 'users');
      const q = query(usersRef, where('username', '==', data.username));
      const existing = await getDocs(q);
      if (!existing.empty) {
        throw new Error('Gebruikersnaam is al in gebruik');
      }

      // Gebruiker aanmaken in Firebase.
      const userCredential = await createUserWithEmailAndPassword(this.auth, data.email, data.password);
      const user = userCredential.user;

      // Gebruikersnaam instellen als displayName in Firebase Auth.
      await updateProfile(user, {
        displayName: data.username
      });

      // Gebruikersdata opslaan in Firestore.
      const userRef = doc(this.firestore, `users/${user.uid}`);
      await setDoc(userRef, {
        uid: user.uid,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Registratiefout:', error);
      throw error;
    }
  }

  async loginWithUsername(username: string, password: string): Promise<User> {
    // Zoek e-mailadres op basis van gebruikersnaam.
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error('Gebruiker niet gevonden');
    }

    // E-mailadres ophalen uit gevonden document.
    const userDoc = querySnapshot.docs[0];
    const { email } = userDoc.data() as { email: string };

    // Log in met e-mailadres en wachtwoord.
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    return userCredential.user;
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }
}