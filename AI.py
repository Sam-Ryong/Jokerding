import tensorflow as tf
import cv2 as cv
import numpy as np

input_size = (48, 48)

# Load the model
model = tf.keras.models.load_model('model\\keras_model.h5', compile=False)

# Replace 'your_image_path.jpg' with the path to your local image
image_path = 'uploads\\captured-image.jpg'
img = cv.imread(image_path)

if img is not None:
    # Resize and preprocess the image
    gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
    model_frame = cv.resize(gray, input_size)
    model_frame = np.expand_dims(model_frame, axis=0) / 255.0

    # Predict using the model
    is_helmet_prob = model.predict(model_frame)[0]
    is_helmet = np.argmax(is_helmet_prob)
    
    if is_helmet == 0:
        msg_helmet = "Surprise"
    elif is_helmet == 4:
        msg_helmet = "Sad"
    elif is_helmet == 2:
        msg_helmet = "Anger"
    elif is_helmet == 3:
        msg_helmet = "Happy"
    else:
        msg_helmet = "Neutral"

    msg_helmet += " ({:.1f})%".format(is_helmet_prob[is_helmet] * 100)

    print(msg_helmet)
else:
    print("Failed to load the image.")
