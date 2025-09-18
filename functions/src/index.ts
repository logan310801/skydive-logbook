/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
import { onCall } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

admin.initializeApp();

export const setUserRole = onCall(async (request) => {
    const { uid, role } = request.data as { uid: string; role: string };
  
    // request.auth is automatically typed
    if (!request.auth) {
      throw new Error("Unauthenticated");
    }
  
    if (request.auth.token.role !== "admin") {
      throw new Error("Permission denied: only admins can set roles");
    }
  
    if (!uid || !role) {
      throw new Error("Must provide uid and role");
    }
  
    await admin.auth().setCustomUserClaims(uid, { role });

    const userRef = admin.firestore().collection("users").doc(uid);
    await userRef.set({ role }, { merge: true });

  
    return { message: `Role '${role}' set for user ${uid}` };
  });

export const signOffJump = onCall(async (request) => {
  const { studentId, jumpId } = request.data as {
    studentId: string;
    jumpId: string;
  };

  // 1. Check authentication
  if (!request.auth) {
    throw new Error("Unauthenticated");
  }

  // 2. Check role
  if (request.auth.token.role !== "instructor" && request.auth.token.role !== "admin") {
    throw new Error("Permission denied: only instructors/admins can sign off jumps");
  }

  // 3. Validate inputs
  if (!studentId || !jumpId) {
    throw new Error("Missing studentId or jumpId");
  }

  // 4. Update the jump
  const jumpRef = admin.firestore()
    .collection("users")
    .doc(studentId)
    .collection("jumps")
    .doc(jumpId);

  const instructorId = request.auth.uid;
  const instructorRef = admin.firestore().collection("users").doc(instructorId);
  const instructorSnap = await instructorRef.get();
  
  if (!instructorSnap.exists) {
    throw new Error("Instructor profile not found");
  }
  
  const instructorData = instructorSnap.data();

  await jumpRef.update({
    signed: true,
    signedByUid: instructorId,
    signedByDisplayName: instructorData?.displayName || "Unknown",
    signedByLicense: instructorData?.license || null,
    signedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { message: `Jump ${jumpId} signed off for student ${studentId}` };
});

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
