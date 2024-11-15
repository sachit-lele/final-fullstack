import subprocess

def generate_summary(prediction_str):
    command = [
        'ollama', 'generate',
        '--model', 'llama-3.2',
        '--input', prediction_str
    ]
    process = subprocess.Popen(command, stdout=subprocess.PIPE)
    output, _ = process.communicate()
    return output.decode('utf-8').strip()