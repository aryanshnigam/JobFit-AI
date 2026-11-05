import numpy as np
from typing import Union

def compute_cosine_similarity(vec1: np.ndarray, vec2: np.ndarray) -> float:
    """
    Compute cosine similarity between two 1D vectors.
    Formula: similarity(A, B) = (A · B) / (||A|| * ||B||)
    """
    if vec1 is None or vec2 is None:
        return 0.0
        
    v1 = np.asarray(vec1, dtype=np.float32).flatten()
    v2 = np.asarray(vec2, dtype=np.float32).flatten()
    
    norm1 = np.linalg.norm(v1)
    norm2 = np.linalg.norm(v2)
    
    if norm1 == 0.0 or norm2 == 0.0:
        return 0.0
        
    dot_product = np.dot(v1, v2)
    similarity = dot_product / (norm1 * norm2)
    
    # Clip float precision artifacts to [-1.0, 1.0]
    return float(np.clip(similarity, -1.0, 1.0))

def compute_similarity_matrix(matrix1: np.ndarray, matrix2: np.ndarray) -> np.ndarray:
    """
    Compute pairwise cosine similarity matrix between Matrix 1 (N x D) and Matrix 2 (M x D).
    Returns (N x M) numpy array.
    """
    if matrix1.size == 0 or matrix2.size == 0:
        return np.zeros((matrix1.shape[0], matrix2.shape[0]), dtype=np.float32)
        
    m1 = np.asarray(matrix1, dtype=np.float32)
    m2 = np.asarray(matrix2, dtype=np.float32)
    
    norm1 = np.linalg.norm(m1, axis=1, keepdims=True)
    norm2 = np.linalg.norm(m2, axis=1, keepdims=True)
    
    norm1[norm1 == 0] = 1e-10
    norm2[norm2 == 0] = 1e-10
    
    normalized_m1 = m1 / norm1
    normalized_m2 = m2 / norm2
    
    sim_matrix = np.dot(normalized_m1, normalized_m2.T)
    return np.clip(sim_matrix, -1.0, 1.0)
