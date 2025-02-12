import os
import sys
import pickle
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
import tensorflow as tf

# Suppress TensorFlow logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # Suppress TensorFlow logs (1=INFO, 2=WARNING, 3=ERROR)
tf.get_logger().setLevel('ERROR')         # Suppress runtime logs

# Load model and tokenizer
model_path = os.path.join(os.getcwd(), 'model', 'best_model.keras')
model = load_model(model_path)

tokenizer_path = os.path.join(os.getcwd(), '', 'tokenizer.pickle')
with open(tokenizer_path, 'rb') as handle:
    tokenizer = pickle.load(handle)

# Sentiment classes
sentiment_classes = ['Negative', 'Neutral', 'Positive']
max_len = 50

def predict_class(text):
    '''Predict sentiment class for the input text'''
    xt = tokenizer.texts_to_sequences([text])
    xt = pad_sequences(xt, padding='post', maxlen=max_len)
    
    # Suppress progress bar by passing `verbose=0` to `model.predict`
    yt = model.predict(xt, verbose=0).argmax(axis=1)
    return sentiment_classes[yt[0]]

# Read input text from sys.argv[1]
input_text = sys.argv[1]


# Predict sentiment
predicted_sentiment = predict_class(input_text)

# Output only the sentiment class
print(predicted_sentiment)

