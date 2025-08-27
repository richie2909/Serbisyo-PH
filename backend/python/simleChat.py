import gradio as gr
from transformers import pipeline

# Load a model (works on free CPU but slower)
generator = pipeline("text-generation", model="tiiuae/falcon-7b-instruct")

# Chatbot function with history
def chat(message, history):
    # Merge previous turns
    history_text = "\n".join([f"User: {h[0]}\nBot: {h[1]}" for h in history])
    prompt = history_text + f"\nUser: {message}\nBot:"

    # Generate response
    result = generator(prompt, max_length=200, do_sample=True, temperature=0.7)
    response = result[0]["generated_text"].split("Bot:")[-1].strip()

    # Update history
    history.append((message, response))
    return history, history

# Gradio chatbot UI
demo = gr.ChatInterface(
    fn=chat,
    chatbot=gr.Chatbot(),
    textbox=gr.Textbox(placeholder="Ask me something..."),
    title="My Hugging Face Chatbot",
    description="A free chatbot running on Hugging Face Spaces with Gradio."
)

demo.launch()
