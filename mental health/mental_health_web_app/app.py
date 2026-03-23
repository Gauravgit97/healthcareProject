from flask import Flask, render_template, request, jsonify
import pickle
import numpy as np
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)

# Load model
model = pickle.load(open("model/mental_health_model.pkl", "rb"))
scaler = pickle.load(open("model/scaler.pkl","rb"))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    answers = np.array(data['answers']).reshape(1, -1)
    answers = scaler.transform(answers)
    prediction = model.predict(answers)

    return jsonify({
        "prediction": int(prediction[0]),
    })

@app.route('/result')
def result():
    return render_template('result.html')

if __name__ == '__main__':
    app.run(debug=True)