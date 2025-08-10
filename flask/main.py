from flask import Flask, request, jsonify
import io
import os
import tensorflow as tf # type: ignore
from tensorflow.keras.preprocessing import image # type: ignore
import numpy as np
from flask_cors import CORS # type: ignore

app = Flask(__name__)
CORS(app)


SAVED_MODEL_PATH = os.path.join(os.path.dirname(__file__), "tire_classifier.h5")

def load_mobilenet_model():
    """Load the MobileNet model using the low-level SavedModel API"""
    if not os.path.exists(SAVED_MODEL_PATH):
        raise FileNotFoundError(f"Model file not found at {SAVED_MODEL_PATH}")

    print(f"Loading MobileNet model from: {SAVED_MODEL_PATH}")
    model = tf.keras.models.load_model(SAVED_MODEL_PATH)
    print("--- MobileNet model loaded successfully! ---")
    return model

# Load the model when the module is imported
try:
    model = load_mobilenet_model()
except Exception as e:
    print(f"Error loading MobileNet model: {e}")
    model = None



def preprocess_image(image_content: bytes):
    """Preprocess image for MobileNet model (224x224 input size)"""
    img = image.load_img(io.BytesIO(image_content), target_size=(224, 224))
    img = image.img_to_array(img)
    img = np.expand_dims(img, axis=0)
    img = img / 255.0 
    return img

def classify_tire(image_content: bytes):
    """
    Classifies the tire image using the loaded MobileNet .h5 model.
    """
    if model is None:
        raise Exception("MobileNet model not loaded")
        
    processed_image = preprocess_image(image_content)

    predictions = model.predict(processed_image)
    score = predictions[0][0]
    
    class_labels = ["Cracked", "Normal"]
    threshold = 0.5

    if score > threshold:
        predicted_class_name = class_labels[1]  # Normal
        confidence_score = score
    else:
        predicted_class_name = class_labels[0]  # Cracked
        confidence_score = 1 - score

    result = {
        "class": predicted_class_name,
        "confidence": float(confidence_score)
    }
    return result


@app.route('/classify', methods=['POST'])
def classify_image():
    """Flask route to classify tire images using MobileNet model"""
    try:
        setofresult = []
        files = request.files.getlist('image')
        
        if not files:
            return jsonify({"error": "No files uploaded"}), 400
            
        if model is None:
            return jsonify({"error": "MobileNet model not loaded"}), 500
        
        for file in files:
            if file.filename == '':
                continue

            image_content = file.read()
            
            result = classify_tire(image_content)
            setofresult.append(result)

        if not setofresult:
            return jsonify({"error": "No valid images processed"}), 400

        return jsonify(setofresult)

    except Exception as e:
        print(f"Error in classify_image: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    model_status = "loaded" if model is not None else "not loaded"
    return jsonify({
        "status": "healthy",
        "model": "MobileNet",
        "model_status": model_status,
        "message": "TiresOnHighways MobileNet Flask API is running!"
    })

@app.route('/', methods=['GET'])
def root():
    """Root endpoint"""
    return "TiresOnHighways MobileNet Flask API - Use /classify for predictions, /health for status"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
