from utils.embeddings import process_document

text = """
Artificial Intelligence is transforming healthcare.
Machine learning helps doctors detect diseases.
Deep learning improves medical image analysis.
Random Forest achieved 95% accuracy.
"""

index, chunks = process_document(text)

print("Embedding module is working!")
print("Number of chunks:", len(chunks))
print(chunks)