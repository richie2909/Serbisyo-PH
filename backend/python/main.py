import gradio as gr
from transformers import pipeline

# Load a small model (free CPU only)
pipe = pipeline("text-generation", model="tiiuae/falcon-7b-instruct")

def chat(prompt):
    response = pipe(prompt, max_length=200, do_sample=True, temperature=0.7)
    return response[0]['generated_text']

demo = gr.Interface(fn=chat, inputs="text", outputs="text")
demo.launch()