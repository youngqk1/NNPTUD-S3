class RailFenceCipher:
    def _validate_rails(self, rails):
        rails = int(rails)
        if rails < 2:
            raise ValueError("Rails must be greater than or equal to 2")
        return rails

    def encrypt_text(self, plain_text, rails):
        rails = self._validate_rails(rails)
        if len(plain_text) <= rails:
            return plain_text

        fence = ["" for _ in range(rails)]
        row = 0
        direction = 1

        for char in plain_text:
            fence[row] += char
            if row == 0:
                direction = 1
            elif row == rails - 1:
                direction = -1
            row += direction

        return "".join(fence)

    def decrypt_text(self, cipher_text, rails):
        rails = self._validate_rails(rails)
        if len(cipher_text) <= rails:
            return cipher_text

        pattern = []
        row = 0
        direction = 1
        for _ in cipher_text:
            pattern.append(row)
            if row == 0:
                direction = 1
            elif row == rails - 1:
                direction = -1
            row += direction

        rail_lengths = [pattern.count(index) for index in range(rails)]
        rails_text = []
        start = 0
        for length in rail_lengths:
            rails_text.append(list(cipher_text[start:start + length]))
            start += length

        result = []
        positions = [0 for _ in range(rails)]
        for rail in pattern:
            result.append(rails_text[rail][positions[rail]])
            positions[rail] += 1

        return "".join(result)
