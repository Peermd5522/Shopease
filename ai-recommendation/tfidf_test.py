from sklearn.feature_extraction.text import TfidfVectorizer

documents = [
    "apple iphone smartphone",
    "apple iphone mobile",
    "nike running shoes"
]

vectorizer = TfidfVectorizer()

matrix = vectorizer.fit_transform(documents)

print(vectorizer.get_feature_names_out())
print(matrix.toarray())