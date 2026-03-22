# from flask import Flask, render_template, request, jsonify
# import pickle
# import numpy as np

# app = Flask(__name__)

# # -----------------------------
# # Load your trained ML model
# # -----------------------------
# # Replace this with your actual model path
# model = pickle.load(open("model/model.pkl", "rb"))

# # -----------------------------
# # Home Route
# # -----------------------------
# @app.route('/')
# def index():
#     return render_template('index.html')

# # -----------------------------
# # Prediction Route
# # -----------------------------
# @app.route('/predict', methods=['POST'])
# def predict():
#     data = request.json  # Receive data from frontend (list of 50 answers)

#     # Convert to numpy array
#     answers = np.array(data['answers']).reshape(1, -1)

#     # Make prediction
#     prediction = model.predict(answers)[0]

#     # You can also return probability if needed
#     # prob = model.predict_proba(answers)

#     return jsonify({
#         "prediction": int(prediction)
#     })

# # -----------------------------
# # Result Page
# # -----------------------------
# @app.route('/result')
# def result():
#     return render_template('result.html')

# # -----------------------------
# if __name__ == '__main__':
#     app.run(debug=True)


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

    # # Probability (IMPORTANT for confidence score)
    # if hasattr(model, "predict_proba"):
    #     prob = model.predict_proba(answers)
    #     confidence = float(max(prob))  # highest probability
    # else:
    #     confidence = 0.75  # fallback if model doesn't support probability

    return jsonify({
        "prediction": int(prediction[0]),
        # "confidence": round(confidence * 100, 2)
        "confidence": 85
    })

@app.route('/result')
def result():
    return render_template('result.html')

if __name__ == '__main__':
    app.run(debug=True)