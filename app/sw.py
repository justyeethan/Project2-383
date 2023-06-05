import numpy as np
import sys

MATCH = 1
MISMATCH = -1
GAP = -1

STOP = 0
LEFT = 1 
UP = 2
DIAGONAL = 3


# Implementing the Smith Waterman local alignment
def smith_waterman(seq1, seq2):
    # Generating the empty matrices for storing scores and tracing
    row = len(seq1) + 1
    col = len(seq2) + 1
    matrix = np.zeros(shape=(row, col), dtype=np.int64)  
    tracing_matrix = np.zeros(shape=(row, col), dtype=np.int64)  
    
    # Initialising the variables to find the highest scoring cell
    max_score = -1
    max_index = (-1, -1)
    
    # Calculating the scores for all cells in the matrix
    for i in range(1, row):
        for j in range(1, col):
            # Calculating the diagonal score (match score)
            match_value = 1 if seq1[i - 1] == seq2[j - 1] else -1
            diagonal_score = matrix[i - 1, j - 1] + match_value
            
            # Calculating the vertical gap score
            vertical_score = matrix[i - 1, j] + GAP
            
            # Calculating the horizontal gap score
            horizontal_score = matrix[i, j - 1] + GAP
            
            # Taking the highest score 
            matrix[i, j] = max(0, diagonal_score, vertical_score, horizontal_score)
            
            # Tracking where the cell's value is coming from    
            if matrix[i, j] == 0: 
                tracing_matrix[i, j] = STOP
                
            elif matrix[i, j] == horizontal_score: 
                tracing_matrix[i, j] = LEFT
                
            elif matrix[i, j] == vertical_score: 
                tracing_matrix[i, j] = UP
                
            elif matrix[i, j] == diagonal_score: 
                tracing_matrix[i, j] = DIAGONAL 
                
            # Tracking the cell with the maximum score
            if matrix[i, j] >= max_score:
                max_index = (i,j)
                max_score = matrix[i, j]
    
    # Initialising the variables for tracing
    aligned_seq1 = ""
    aligned_seq2 = ""   
    current_aligned_seq1 = ""   
    current_aligned_seq2 = ""  
    (max_i, max_j) = max_index
    
    # Tracing and computing the pathway with the local alignment
    while tracing_matrix[max_i, max_j] != STOP:
        if tracing_matrix[max_i, max_j] == DIAGONAL:
            current_aligned_seq1 = seq1[max_i - 1]
            current_aligned_seq2 = seq2[max_j - 1]
            max_i = max_i - 1
            max_j = max_j - 1
            
        elif tracing_matrix[max_i, max_j] == UP:
            current_aligned_seq1 = seq1[max_i - 1]
            current_aligned_seq2 = '-'
            max_i = max_i - 1    
            
        elif tracing_matrix[max_i, max_j] == LEFT:
            current_aligned_seq1 = '-'
            current_aligned_seq2 = seq2[max_j - 1]
            max_j = max_j - 1
            
        aligned_seq1 = aligned_seq1 + current_aligned_seq1
        aligned_seq2 = aligned_seq2 + current_aligned_seq2
    
    # Reversing the order of the sequences
    aligned_seq1 = aligned_seq1[::-1]
    aligned_seq2 = aligned_seq2[::-1]
    
    return aligned_seq1, aligned_seq2, max_score

def main(argv):
    sequence1, sequence2 = argv[1], argv[2]
    aligned_seq1, aligned_seq2, score = smith_waterman(sequence1, sequence2)
    print(aligned_seq1, aligned_seq2, score)

if __name__ == "__main__":
    main(sys.argv)
    
