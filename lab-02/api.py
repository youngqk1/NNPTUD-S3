from flask import Flask, jsonify, request

from cipher.caesar.caesar_cipher import CaesarCipher
from cipher.playfair.playfair_cipher import PlayfairCipher
from cipher.railfence.railfence_cipher import RailFenceCipher
from cipher.transposition.transposition_cipher import TranspositionCipher
from cipher.vigenere.vigenere_cipher import VigenereCipher


app = Flask(__name__)

caesar_cipher = CaesarCipher()
vigenere_cipher = VigenereCipher()
railfence_cipher = RailFenceCipher()
playfair_cipher = PlayfairCipher()
transposition_cipher = TranspositionCipher()


def json_data():
    return request.get_json(silent=True) or {}


def api_error(message, status=400):
    return jsonify({"error": message}), status


@app.post("/api/caesar/encrypt")
def caesar_encrypt():
    data = json_data()
    try:
        return jsonify({
            "cipher_text": caesar_cipher.encrypt_text(data.get("plain_text", ""), data.get("key", 0))
        })
    except (TypeError, ValueError) as exc:
        return api_error(str(exc))


@app.post("/api/caesar/decrypt")
def caesar_decrypt():
    data = json_data()
    try:
        return jsonify({
            "plain_text": caesar_cipher.decrypt_text(data.get("cipher_text", ""), data.get("key", 0))
        })
    except (TypeError, ValueError) as exc:
        return api_error(str(exc))


@app.post("/api/vigenere/encrypt")
def vigenere_encrypt():
    data = json_data()
    try:
        return jsonify({
            "cipher_text": vigenere_cipher.encrypt_text(data.get("plain_text", ""), data.get("key", ""))
        })
    except ValueError as exc:
        return api_error(str(exc))


@app.post("/api/vigenere/decrypt")
def vigenere_decrypt():
    data = json_data()
    try:
        return jsonify({
            "plain_text": vigenere_cipher.decrypt_text(data.get("cipher_text", ""), data.get("key", ""))
        })
    except ValueError as exc:
        return api_error(str(exc))


@app.post("/api/railfence/encrypt")
def railfence_encrypt():
    data = json_data()
    try:
        return jsonify({
            "cipher_text": railfence_cipher.encrypt_text(data.get("plain_text", ""), data.get("key", 2))
        })
    except (TypeError, ValueError) as exc:
        return api_error(str(exc))


@app.post("/api/railfence/decrypt")
def railfence_decrypt():
    data = json_data()
    try:
        return jsonify({
            "plain_text": railfence_cipher.decrypt_text(data.get("cipher_text", ""), data.get("key", 2))
        })
    except (TypeError, ValueError) as exc:
        return api_error(str(exc))


@app.post("/api/playfair/creatematrix")
def playfair_create_matrix():
    data = json_data()
    return jsonify({"matrix": playfair_cipher.create_matrix(data.get("key", ""))})


@app.post("/api/playfair/encrypt")
def playfair_encrypt():
    data = json_data()
    return jsonify({
        "cipher_text": playfair_cipher.encrypt_text(data.get("plain_text", ""), data.get("key", ""))
    })


@app.post("/api/playfair/decrypt")
def playfair_decrypt():
    data = json_data()
    return jsonify({
        "plain_text": playfair_cipher.decrypt_text(data.get("cipher_text", ""), data.get("key", ""))
    })


@app.post("/api/transposition/encrypt")
def transposition_encrypt():
    data = json_data()
    try:
        return jsonify({
            "cipher_text": transposition_cipher.encrypt_text(data.get("plain_text", ""), data.get("key", 2))
        })
    except (TypeError, ValueError) as exc:
        return api_error(str(exc))


@app.post("/api/transposition/decrypt")
def transposition_decrypt():
    data = json_data()
    try:
        return jsonify({
            "plain_text": transposition_cipher.decrypt_text(data.get("cipher_text", ""), data.get("key", 2))
        })
    except (TypeError, ValueError) as exc:
        return api_error(str(exc))


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True, use_reloader=False)
