
from fastapi import FastAPI
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()


@app.get("/")
def home():
    return {
        "message": "ShopEase AI Recommendation Service is running!"
    }


@app.post("/recommend")
def recommend_products(products: list[dict], product_id: str):

    # Combine product information into text
    documents = []

    for product in products:
        text = (
            str(product.get("name", "")) + " " +
            str(product.get("brand", "")) + " " +
            str(product.get("category", "")) + " " +
            str(product.get("description", ""))
        )

        documents.append(text)

    # Convert product text into TF-IDF vectors
    vectorizer = TfidfVectorizer()
    matrix = vectorizer.fit_transform(documents)

    # Calculate similarity
    similarity = cosine_similarity(matrix)

    # Find the selected product
    product_index = next(
        (i for i, product in enumerate(products)
         if str(product.get("_id")) == product_id),
        None
    )

    if product_index is None:
        return {"recommendations": []}

    # Get similarity scores
    scores = similarity[product_index]

    # Sort products by similarity
    recommendations = sorted(
        enumerate(scores),
        key=lambda x: x[1],
        reverse=True
    )

    # Return top 4 similar products
    result = []

    for index, score in recommendations:
        if index != product_index:
            result.append({
                "product": products[index],
                "similarity_score": float(score)
            })

        if len(result) == 4:
            break

    return {"recommendations": result}
