import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Exam, ExamResult } from "@/types/exam";

export const examService = {
  // Get exam by ID
  async getExam(examId: string): Promise<Exam | null> {
    const examDoc = await getDoc(doc(db, "exams", examId));
    if (!examDoc.exists()) return null;
    return { id: examDoc.id, ...examDoc.data() } as Exam;
  },

  // Get available exams for a student based on their stream and year
  async getAvailableExams(stream: string, year: string): Promise<Exam[]> {
    const examsRef = collection(db, "exams");
    const q = query(
      examsRef,
      where("stream", "==", stream),
      where("year", "==", year),
      where("startTime", "<=", new Date().toISOString()),
      where("endTime", ">=", new Date().toISOString())
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Exam[];
  },

  // Submit exam result
  async submitExamResult(result: Omit<ExamResult, "id">): Promise<string> {
    const resultRef = await addDoc(collection(db, "examResults"), {
      ...result,
      submittedAt: Timestamp.now(),
    });
    return resultRef.id;
  },

  // Get student's exam results
  async getStudentResults(userId: string): Promise<ExamResult[]> {
    const resultsRef = collection(db, "examResults");
    const q = query(resultsRef, where("userId", "==", userId));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ExamResult[];
  },
};
