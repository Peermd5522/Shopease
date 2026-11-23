from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

documents = [
    "apple iphone smartphone",
    "apple iphone mobile",
    "nike running shoes"
]

product_names = [
    "iPhone Smartphone",
    "iPhone Mobile",
    "Nike Running Shoes"
]

# Convert product text into TF-IDF vectors
vectorizer = TfidfVectorizer()
matrix = vectorizer.fit_transform(documents)

# Calculate similarity between all products
similarity = cosine_similarity(matrix)

# We want recommendations for Product A
product_index = 0

# Get similarity scores for Product A
scores = similarity[product_index]

print("Recommendations for:", product_names[product_index])

# Sort products by similarity score
recommendations = sorted(
    enumerate(scores),
    key=lambda x: x[1],
    reverse=True
)

# Display recommendations
for index, score in recommendations:
    if index != product_index:
        print(product_names[index], "->", score)