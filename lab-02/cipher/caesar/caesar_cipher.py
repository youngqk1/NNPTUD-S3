from .alphabet import ALPHABET


class CaesarCipher:
    def __init__(self):
        self.alphabet = ALPHABET

    def _shift_char(self, char, key):
        if char.upper() not in self.alphabet:
            return char

        shifted = (self.alphabet.index(char.upper()) + key) % len(self.alphabet)
        result = self.alphabet[shifted]
        return result if char.isupper() else result.lower()

    def encrypt_text(self, plain_text, key):
        key = int(key)
        return "".join(self._shift_char(char, key) for char in plain_text)

    def decrypt_text(self, cipher_text, key):
        key = int(key)
        return "".join(self._shift_char(char, -key) for char in cipher_text)
