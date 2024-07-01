from flask import Flask, render_template, request, json, jsonify
import os
import openai
from openai import OpenAI
import google.generativeai as genai

#GEMINI
###### setting subject for search 

subject = "occupational therapy "

####### start gemini setup

genai.configure(api_key='AIzaSyD4QnDJSdJgc9UFwyA_DKPwM3Qt6_4Behw')

# Set up the model
generation_config = {
  "temperature": 0.1,
  "top_p": 1,
  "top_k": 1,
  "max_output_tokens": 2048,
}

# Lowering safety settings to a minimum for reasarch purposeses
safety_settings = [
  {
    "category": "HARM_CATEGORY_HARASSMENT",
    "threshold": "BLOCK_NONE"  
  },
  {
    "category": "HARM_CATEGORY_HATE_SPEECH",
    "threshold": "BLOCK_NONE"  
  },
  {
    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    "threshold": "BLOCK_NONE"  
  },
  {
    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
    "threshold": "BLOCK_NONE"  
  },
]


model = genai.GenerativeModel(model_name="gemini-1.0-pro",
                              generation_config=generation_config,
                              safety_settings=safety_settings)
#AIzaSyD4QnDJSdJgc9UFwyA_DKPwM3Qt6_4Behw - google key
convo = model.start_chat(history=[
  {
    "parts": [
      {
        "text": "You are an" + subject + "assistant that talks with an intern and tries to help him solve problems in a Socratic method. You answer in this field only, in case you are questioned about anything else you always reply that you're not familiar with this subject. Do you understand?"
      }
    ]
  },
  {
    "parts": [
      {
        "text": "Yes, I understand. If the sentences are not relevant to" + subject + " I will return (i am not familiar with this subject), and only include relevant content in the output. I will add nothing more."
      }
    ]
  },
])


def gemini_generate_text_with_context(prompt):
  new_message = {"parts": [{"text": prompt}]}
  convo.send_message(new_message)
  output = convo.last.text
  print(convo.last.text)
  return output

#GEMINI

messages = [{'role': 'system', 
             'content': """
                        Make sure the answers are not over 500 tokens. You are an occupational therapy assistant that talks with an intern therapist and tries to help him solve problems in a Socratic method. You answer in this field only, in case you are questioned about anything else you always reply that you're not familiar with this subject.
                        """
             }]

client = OpenAI(
    # This is the default and can be omitted
    api_key="ENTER API HERE",
)


app = Flask(__name__)

@app.route("/main")
def ind():
    user_ip = request.remote_addr
    return render_template('index.html', user_ip=user_ip)

##added because needed an empty option for the flask
@app.route("/")
def home():
    return ind()

@app.route("/login")
def login():
    user_ip = request.remote_addr
    return render_template('login.html', user_ip=user_ip)


# Simplified logic in `/get` route with comments
@app.route("/get", methods=["GET", "POST"])
def chat():
    data = request.get_json()
    msg = data.get("msg")

    if msg == "Save chat.":
        return save_chat()
    else:
        # Add user message to conversation history
        messages.append({'role': 'user', 'content': msg})
        # Get AI response with conversation history
        return gemini_generate_text_with_context (messages)


def save_chat():
    answer = "Chat saved!"
    json_string = json.dumps(messages)
    num = int(lastFileNum()) + 1
    with open(f'data/json_data{num}.json', 'w') as outfile:
        outfile.write(json_string)
    return jsonify({"response": answer})


def lastFileNum():
    path = "data/"
    files = [f for f in os.listdir(path) if os.path.isfile(os.path.join(path, f))]
    # Sort the files
    files.sort()
    # Get the last file
    if files:
        last_file = files[-1]
        # Return the last character of the last file
        return last_file[-6] if last_file else 0
    else:
        return 0


def get_Chat_response(text):
    chat = client.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        messages=text,
        max_tokens=500,
    )
    reply = chat.choices[0].message.content
    messages.append({'role': 'system', 'content': reply})
    return jsonify({"response": reply})


if __name__ == '__main__':
    app.run()
