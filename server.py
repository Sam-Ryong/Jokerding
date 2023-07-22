from flask import Flask, request, jsonify
import tensorflow as tf
import cv2 as cv
import numpy as np

app = Flask(__name__)

input_size = (224, 224)

# Load the model
model = tf.keras.models.load_model('converted_keras/keras_model.h5', compile=False)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    image_path = data.get('image_path', None)

    if image_path:
        img = cv.imread(image_path)

        if img is not None:
            # Resize and preprocess the image
            model_frame = cv.resize(img, input_size)
            model_frame = np.expand_dims(model_frame, axis=0) / 255.0

            # Predict using the model
            is_helmet_prob = model.predict(model_frame)[0]
            is_helmet = np.argmax(is_helmet_prob)
            if is_helmet == 1:
                msg_helmet = "no helmet"
            elif is_helmet == 0:
                msg_helmet = "helmet"
            else:
                msg_helmet = "No one detected"

            msg_helmet += " ({:.1f})%".format(is_helmet_prob[is_helmet] * 100)

            return jsonify({'msg_helmet': msg_helmet})
        else:
            return jsonify({'msg_helmet': 'Failed to load the image.'})
    else:
        return jsonify({'msg_helmet': 'Invalid image_path.'})

if __name__ == '__main__':
    app.run(host='localhost', port=5000)
