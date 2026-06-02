class VigenereCipher:
    def _clean_key(self, key):
        cleaned = "".join(char.upper() for char in str(key) if char.isalpha())
        if not cleaned:
            raise ValueError("Key must contain at least one letter")
        return cleaned

    def _transform(self, text, key, decrypt=False):
        key = self._clean_key(key)
        result = []
        key_index = 0

        for char in text:
            if not char.isalpha():
                result.append(char)
                continue

            base = ord("A") if char.isupper() else ord("a")
            shift = ord(key[key_index % len(key)]) - ord("A")
            if decrypt:
                shift = -shift
            result.append(chr((ord(char) - base + shift) % 26 + base))
            key_index += 1

        return "".join(result)

    def encrypt_text(self, plain_text, key):
        return self._transform(plain_text, key)

    def decrypt_text(self, cipher_text, key):
        return self._transform(cipher_text, key, decrypt=True)
