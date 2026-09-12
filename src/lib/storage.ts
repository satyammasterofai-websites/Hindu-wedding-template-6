import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const CHUNK_SIZE = 500000; // 900KB per chunk

export async function saveLargeFile(id: string, dataUrl: string): Promise<string> {
  const chunks = Math.ceil(dataUrl.length / CHUNK_SIZE);
  
  const uploadPromise = async () => {
    // Save metadata FIRST
    await setDoc(doc(db, 'wedding_invitations', `file-meta-${id}`), {
      chunks,
      timestamp: Date.now()
    });

    // Save chunks in small batches to prevent network congestion
    for (let i = 0; i < chunks; i += 3) {
      const batch = [];
      for (let j = 0; j < 3 && i + j < chunks; j++) {
        const chunkIndex = i + j;
        const chunkData = dataUrl.slice(chunkIndex * CHUNK_SIZE, (chunkIndex + 1) * CHUNK_SIZE);
        batch.push(
          setDoc(doc(db, 'wedding_invitations', `file-chunk-${id}-${chunkIndex}`), {
            data: chunkData
          })
        );
      }
      await Promise.all(batch);
    }
    
    return `ecard-file://${id}`;
  };

  // Add a 45-second timeout to prevent infinite hanging on bad connections
  return Promise.race([
    uploadPromise(),
    new Promise<string>((_, reject) => 
      setTimeout(() => reject(new Error("Upload timed out. Please check your internet connection and try again.")), 45000)
    )
  ]);
}

export async function loadLargeFile(id: string): Promise<string | null> {
  if (!id.startsWith('ecard-file://')) return id;
  const actualId = id.replace('ecard-file://', '');
  
  try {
    const metaSnap = await getDoc(doc(db, 'wedding_invitations', `file-meta-${actualId}`));
    if (!metaSnap.exists()) return null;
    
    const chunks = metaSnap.data().chunks;
    let dataUrl = '';
    
    for (let i = 0; i < chunks; i++) {
      const chunkSnap = await getDoc(doc(db, 'wedding_invitations', `file-chunk-${actualId}-${i}`));
      if (chunkSnap.exists()) {
        dataUrl += chunkSnap.data().data;
      }
    }
    
    return dataUrl;
  } catch (e) {
    console.error("Error loading large file:", e);
    return null;
  }
}
