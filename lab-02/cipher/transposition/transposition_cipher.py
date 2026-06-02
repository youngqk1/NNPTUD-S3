import math


class TranspositionCipher:
    def _validate_key(self, key):
        key = int(key)
        if key < 2:
            raise ValueError("Key must be greater than or equal to 2")
        return key

    def encrypt_text(self, plain_text, key):
        key = self._validate_key(key)
        cipher_text = [""] * key

        for column in range(key):
            pointer = column
            while pointer < len(plain_text):
                cipher_text[column] += plain_text[pointer]
                pointer += key

        return "".join(cipher_text)

    def decrypt_text(self, cipher_text, key):
        key = self._validate_key(key)
        columns = math.ceil(len(cipher_text) / key)
        rows = key
        empty_boxes = (columns * rows) - len(cipher_text)
        plain_text = [""] * columns

        column = 0
        row = 0
        for char in cipher_text:
            plain_text[column] += char
            column += 1
            if column == columns or (column == columns - 1 and row >= rows - empty_boxes):
                column = 0
                row += 1

        return "".join(plain_text)
