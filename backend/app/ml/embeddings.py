import numpy as np
from typing import List, Union
from app.core.config import settings

try:
    from sentence_transformers import SentenceTransformer
    HAS_SENTENCE_TRANSFORMERS = True
except ImportError:
    HAS_SENTENCE_TRANSFORMERS = False

class EmbeddingService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EmbeddingService, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
            
        self.model = None
        self.model_name = settings.EMBEDDING_MODEL_NAME
        self.embedding_dim = 384
        
        if HAS_SENTENCE_TRANSFORMERS:
            try:
                print(f"[EmbeddingService] Loading SentenceTransformer model: {self.model_name}...")
                self.model = SentenceTransformer(self.model_name)
                self.embedding_dim = self.model.get_sentence_embedding_dimension()
                print(f"[EmbeddingService] Model loaded successfully. Dimension: {self.embedding_dim}")
            except Exception as e:
                print(f"[EmbeddingService] Failed to load {self.model_name}: {e}. Falling back to lightweight TF-IDF/Hashing vectors.")
                self.model = None
        else:
            print("[EmbeddingService] sentence_transformers library not found. Using fallback embedding vectorizer.")
            
        self._initialized = True

    def _fallback_vectorize(self, text: str) -> np.ndarray:
        """
        Deterministic, lightweight fallback embedding vectorizer when transformer model is loading/unavailable.
        Produces 384-dimensional normalized hashing vector.
        """
        vec = np.zeros(self.embedding_dim, dtype=np.float32)
        words = text.lower().split()
        if not words:
            return vec
        for idx, word in enumerate(words):
            # Simple hash projection
            h = hash(word) % self.embedding_dim
            vec[h] += 1.0
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm
        return vec

    def embed_text(self, text: str) -> np.ndarray:
        """
        Embed a single text string into a float32 vector.
        """
        if not text or not text.strip():
            return np.zeros(self.embedding_dim, dtype=np.float32)
            
        if self.model:
            try:
                vec = self.model.encode(text, convert_to_numpy=True, normalize_embeddings=True)
                return vec.astype(np.float32)
            except Exception as e:
                print(f"[EmbeddingService] Encoding error: {e}")
                
        return self._fallback_vectorize(text)

    def embed_batch(self, texts: List[str]) -> np.ndarray:
        """
        Embed a batch of text strings into a 2D numpy array (num_texts x embedding_dim).
        """
        if not texts:
            return np.zeros((0, self.embedding_dim), dtype=np.float32)
            
        if self.model:
            try:
                vecs = self.model.encode(texts, convert_to_numpy=True, normalize_embeddings=True)
                return vecs.astype(np.float32)
            except Exception as e:
                print(f"[EmbeddingService] Batch encoding error: {e}")
                
        return np.vstack([self._fallback_vectorize(t) for t in texts])

# Global instance
embedding_service = EmbeddingService()
