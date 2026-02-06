from gpt4all import GPT4All
import os

model_path = r"D:\ai models\blobs"
model_file = "sha256-aeda25e63ebd698fab8638ffb778e68bed908b960d39d0becc650fa981609d25"
full_path = os.path.join(model_path, model_file)

print(f"Checking path: {os.path.exists(full_path)}")

try:
    print(f"Attempting to load model from {full_path}...")
    # GPT4All expects the model name to be the filename in model_path
    # We might need to rename or symlink it if it strictly wants .gguf
    llm = GPT4All(model_file, model_path=model_path, allow_download=False)
    print("Success! Model loaded.")
    
    print("Testing generation...")
    with llm.chat_session():
        response = llm.generate("Hello, how are you?", max_tokens=20)
        print(f"Response: {response}")
except Exception as e:
    print(f"Failed to load: {e}")
