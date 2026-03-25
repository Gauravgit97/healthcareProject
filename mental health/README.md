# 📘 Project Documentation: Mental Health Assessment Web App

## 🎯 Objective
To build a web-based application that uses a Machine Learning model to assess a user's mental health based on responses to 50 questions.

---

## 🧠 Machine Learning Model
- Input: 50 binary features (0/1)
- Output:
  - 1 → Healthy
  - 2 → Mental Stress
  - 3 → Mental sevear Stress
- Confidence Score using probability

---

## 🖥️ System Architecture
Frontend → Flask Backend → ML Model → Prediction → Result Page

---

## 🔹 Frontend Flow
1. User answers 50 questions (Yes/No)
2. Answers stored as 1/0
3. Sent to backend using Fetch API
4. Loading screen appears
5. Redirect to result page

---

## 🔹 Backend Flow
- Receives answers
- Converts to NumPy array
- Passes to ML model
- Returns prediction + confidence

---

## 🔹 Result Page
- Displays:
  - Mental health stage (Normal / Moderate / Severe)
  - Confidence score
  - Chart visualization
  - 10 personalized tips

---

## 💡 Tips System
Each stage contains 10 predefined tips to improve mental health.

---

## 🎨 UI Features
- Modern gradient UI
- Glassmorphism card design
- Animated transitions
- Progress bar
- Loading animation

---

## ⚠️ Limitations
- Not a medical diagnosis tool
- Depends on model accuracy

---

## 🚀 Future Improvements
- User login system
- PDF report generation
- Deployment (AWS / Render)
- Advanced analytics dashboard

---

## 👨‍💻 Author
Gaurav Joshi
