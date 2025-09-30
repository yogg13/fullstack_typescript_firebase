import * as admin from "firebase-admin";
import { ProductLog } from "../types/product";
export declare const firebaseDB: admin.database.Database;
export declare const firestoreDB: admin.firestore.Firestore;
export declare function logToFirebase(logData: ProductLog): Promise<boolean>;
export declare function logToFirestore(logData: ProductLog): Promise<boolean>;
export declare function testFirebaseConnection(): Promise<boolean>;
//# sourceMappingURL=firebase.d.ts.map