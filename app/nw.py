import sys
import time


def get_score(ALIGNMENTS):
    # print('align', ALIGNMENTS)
    return {'alignments': [{ele[0]: ele[1]} for ele in ALIGNMENTS], 'score': str(ALIGNMENTS[0][3][0][1])}


def find_each_path(matrix, c_i, c_j, pathways, path=''):
    # global ALN_PATHWAYS
    i = c_i
    j = c_j
    if i == 0 and j == 0:
        pathways.append(path)
        return 2
    dir_t = len(matrix[i][j][1])
    while dir_t <= 1:
        n_dir = matrix[i][j][1][0] if (i != 0 and j != 0) else (
            1 if i == 0 else (3 if j == 0 else 0))
        path = path + str(n_dir)
        if n_dir == 1:
            j = j-1
        elif n_dir == 2:
            i = i-1
            j = j-1
        elif n_dir == 3:
            i = i-1
        dir_t = len(matrix[i][j][1])
        if i == 0 and j == 0:
            pathways.append(path)
            return 3
    if dir_t > 1:
        for dir_c in range(dir_t):
            n_dir = matrix[i][j][1][dir_c] if (i != 0 and j != 0) else (
                1 if i == 0 else (3 if j == 0 else 0))
            tmp_path = path + str(n_dir)
            if n_dir == 1:
                n_i = i
                n_j = j-1
            elif n_dir == 2:
                n_i = i-1
                n_j = j-1
            elif n_dir == 3:
                n_i = i-1
                n_j = j
            find_each_path(matrix, n_i, n_j, pathways, tmp_path)
    return len(pathways)


def matrix_eval(matrix, sequence1, sequence2, matrix_row_n, matrix_column_n, gap_score, match_score, mismatch_score, aln_pathways):
    for i in range(matrix_row_n):
        matrix[i][0] = [gap_score*i, []]
    for j in range(matrix_column_n):
        matrix[0][j] = [gap_score*j, []]
    for i in range(1, matrix_row_n):
        for j in range(1, matrix_column_n):
            score = match_score if (
                sequence1[i-1] == sequence2[j-1]) else mismatch_score
            h_val = matrix[i][j-1][0] + gap_score
            d_val = matrix[i-1][j-1][0] + score
            v_val = matrix[i-1][j][0] + gap_score
            o_val = [h_val, d_val, v_val]
            matrix[i][j] = [
                max(o_val), [i+1 for i, v in enumerate(o_val) if v == max(o_val)]]
    # Matrix Evaulation [end]
    OVERALL_SCORE = matrix[i][j][0]
    score = OVERALL_SCORE
    l_i = i
    l_j = j
    ALIGNMENTS = []
    tot_aln = find_each_path(matrix, i, j, aln_pathways)
    aln_count = 0
    # Compiling alignments based on discovered matrix pathways
    for elem in aln_pathways:
        i = l_i-1
        j = l_j-1
        side_aln = ''
        top_aln = ''
        step = 0
        aln_info = []
        for n_dir_c in range(len(elem)):
            n_dir = elem[n_dir_c]
            score = matrix[i+1][j+1][0]
            step = step + 1
            aln_info.append([step, score, n_dir])
            if n_dir == '2':
                side_aln = side_aln + sequence1[i]
                top_aln = top_aln + sequence2[j]
                i = i-1
                j = j-1
            elif n_dir == '1':
                side_aln = side_aln + '-'
                top_aln = top_aln + sequence2[j]
                j = j-1
            elif n_dir == '3':
                side_aln = side_aln + sequence1[i]
                top_aln = top_aln + '-'
                i = i-1
        aln_count = aln_count + 1
        ALIGNMENTS.append([top_aln[::-1], side_aln[::-1],
                          elem, aln_info, aln_count])
        return get_score(ALIGNMENTS)


def matrix_construction(sequence1_length, sequence2_length):
    return [[[[None] for _ in range(2)] for _ in range(
        sequence2_length)] for i in range(sequence1_length)]


# Defaults for main function, but can be changed based on params
def main(sequence1, sequence2, gap_score=-2, match_score=1, mismatch_score=-1):
    init_time = time.time()
    ALN_PATHWAYS = []  # Initiating List of Discovered aln Pathways
    MATRIX_ROW_N = len(sequence1)+1
    MATRIX_COLUMN_N = len(sequence2)+1
    matrix = matrix_construction(MATRIX_ROW_N, MATRIX_COLUMN_N)
    res = matrix_eval(matrix, sequence1, sequence2, MATRIX_ROW_N,
                      MATRIX_COLUMN_N, gap_score, match_score, mismatch_score, ALN_PATHWAYS)
    # print(res)
    res['time'] = str(time.time()-init_time)

    # Metadata
    res['input_params'] = {
        'original_seq': {
            'sequence1': str(sequence1),
            'sequence2': str(sequence2)
        },
        'gap_score': str(gap_score),
        'match_score': str(match_score),
        'mismatch_score': str(mismatch_score)
    }
    return res


if __name__ == '__main__':
    """
    Function for command line arguments
    """
    if len(sys.argv) > 2:
        main(sys.argv[1], sys.argv[2])
    else:
        main()
