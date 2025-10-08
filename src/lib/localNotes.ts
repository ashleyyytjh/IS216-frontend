// /lib/localNotes.ts
export const STORAGE_KEY = 'draft-notes';

export type LocalNote = {
  id: string;
  title: string;
  content: any;
  updatedAt: string;
};

export const getNotes = (): LocalNote[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

export const saveNote = (note: LocalNote) => {
  const notes = getNotes();
  const index = notes.findIndex((n) => n.id === note.id);
  if (index >= 0) notes[index] = note;  // update existing
  else notes.push(note);                // add new
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
};

import html2canvas from "html2canvas";
import jsPDF from "jspdf";



