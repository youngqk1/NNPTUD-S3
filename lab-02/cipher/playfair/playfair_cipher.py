class PlayfairCipher:
    alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ"

    def create_matrix(self, key):
        seen = set()
        letters = []
        source = f"{key}{self.alphabet}".upper().replace("J", "I")

        for char in source:
            if char.isalpha() and char in self.alphabet and char not in seen:
                seen.add(char)
                letters.append(char)

        return [letters[index:index + 5] for index in range(0, 25, 5)]

    def _positions(self, matrix):
        return {
            matrix[row][col]: (row, col)
            for row in range(5)
            for col in range(5)
        }

    def _prepare_plain_text(self, plain_text):
        text = "".join(char.upper() for char in plain_text if char.isalpha())
        text = text.replace("J", "I")
        pairs = []
        index = 0

        while index < len(text):
            first = text[index]
            second = text[index + 1] if index + 1 < len(text) else "X"
            if first == second:
                pairs.append(first + "X")
                index += 2
            else:
                pairs.append(first + second)
                index += 2

        return pairs

    def _prepare_cipher_text(self, cipher_text):
        text = "".join(char.upper() for char in cipher_text if char.isalpha())
        text = text.replace("J", "I")
        if len(text) % 2 == 1:
            text += "X"
        return [text[index:index + 2] for index in range(0, len(text), 2)]

    def _transform_pair(self, pair, matrix, decrypt=False):
        positions = self._positions(matrix)
        row1, col1 = positions[pair[0]]
        row2, col2 = positions[pair[1]]
        offset = -1 if decrypt else 1

        if row1 == row2:
            return matrix[row1][(col1 + offset) % 5] + matrix[row2][(col2 + offset) % 5]
        if col1 == col2:
            return matrix[(row1 + offset) % 5][col1] + matrix[(row2 + offset) % 5][col2]
        return matrix[row1][col2] + matrix[row2][col1]

    def encrypt_text(self, plain_text, key):
        matrix = self.create_matrix(key)
        pairs = self._prepare_plain_text(plain_text)
        return "".join(self._transform_pair(pair, matrix) for pair in pairs)

    def decrypt_text(self, cipher_text, key):
        matrix = self.create_matrix(key)
        pairs = self._prepare_cipher_text(cipher_text)
        return "".join(self._transform_pair(pair, matrix, decrypt=True) for pair in pairs)
