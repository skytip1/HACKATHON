from flask import Flask, request, jsonify
import pickle

app = Flask(__name__)
model = pickle.load(open('model.pkl', 'rb'))  # Load your trained model

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()  # Get JSON data from request
    prediction = model.predict([data])  # Predict match
    return jsonify({'prediction': prediction.tolist()})

if __name__ == '__main__':
    app.run(port=5000)
