from ctransformers import AutoModelForCausalLM
import os

model_path = r"D:\ai models\blobs\sha256-aeda25e63ebd698fab8638ffb778e68bed908b960d39d0becc650fa981609d25"
print(f"Checking path: {os.path.exists(model_path)}")

try:
    print("Attempting to load with gemma2...")
    llm = AutoModelForCausalLM.from_pretrained(model_path, model_type="gemma2")
    print("Success!")
except Exception as e:
    print(f"Gemma2 failed: {e}")
    try:
        print("Attempting to load with llama...")
        llm = AutoModelForCausalLM.from_pretrained(model_path, model_type="llama")
        print("Success!")
    except Exception as e2:
        print(f"Llama failed: {e2}")
