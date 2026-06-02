from flask import Flask, render_template, request

from cipher.caesar.caesar_cipher import CaesarCipher
from cipher.playfair.playfair_cipher import PlayfairCipher
from cipher.railfence.railfence_cipher import RailFenceCipher
from cipher.transposition.transposition_cipher import TranspositionCipher
from cipher.vigenere.vigenere_cipher import VigenereCipher


app = Flask(__name__)

ciphers = {
    "caesar": CaesarCipher(),
    "vigenere": VigenereCipher(),
    "railfence": RailFenceCipher(),
    "playfair": PlayfairCipher(),
    "transposition": TranspositionCipher(),
}


@app.get("/")
def index():
    return render_template("index.html")


def render_cipher_page(cipher_name, template_name):
    result = ""
    error = ""
    matrix = None
    plain_text = ""
    cipher_text = ""
    key = request.form.get("key", "")
    action = request.form.get("action", "encrypt")

    if request.method == "POST":
        plain_text = request.form.get("plain_text", "")
        cipher_text = request.form.get("cipher_text", "")
        cipher = ciphers[cipher_name]

        try:
            if cipher_name == "playfair" and action == "matrix":
                matrix = cipher.create_matrix(key)
            elif action == "decrypt":
                result = cipher.decrypt_text(cipher_text, key)
            else:
                result = cipher.encrypt_text(plain_text, key)
        except (TypeError, ValueError) as exc:
            error = str(exc)

    return render_template(
        template_name,
        action=action,
        cipher_text=cipher_text,
        error=error,
        key=key,
        matrix=matrix,
        plain_text=plain_text,
        result=result,
    )


@app.route("/caesar", methods=["GET", "POST"])
def caesar():
    return render_cipher_page("caesar", "caesar.html")


@app.route("/vigenere", methods=["GET", "POST"])
def vigenere():
    return render_cipher_page("vigenere", "vigenere.html")


@app.route("/railfence", methods=["GET", "POST"])
def railfence():
    return render_cipher_page("railfence", "railfence.html")


@app.route("/playfair", methods=["GET", "POST"])
def playfair():
    return render_cipher_page("playfair", "playfair.html")


@app.route("/transposition", methods=["GET", "POST"])
def transposition():
    return render_cipher_page("transposition", "transposition.html")


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5050, debug=True, use_reloader=False)
