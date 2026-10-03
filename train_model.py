"""
AI Resume Analyzer - Machine Learning Model Trainer
Supervised Classification Pipeline for Job Category & Experience Tier Prediction.

Usage:
  1. Default Training on 100-record local dataset:
     python train_model.py

  2. Train on custom / online Kaggle dataset CSV:
     python train_model.py --dataset path/to/kaggle_resumes.csv --text_col resume_text --label_col category
"""

import os
import re
import sys
import json
import pickle
import argparse
from datetime import datetime
from typing import Tuple, Dict, Any

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, classification_report, confusion_matrix

# Simple English stop words set
STOPWORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "as", "at", "be", "because",
    "been", "before", "being", "below", "between", "both", "but", "by", "can", "could", "did", "do", "does", "doing", "down",
    "during", "each", "few", "for", "from", "further", "had", "has", "have", "having", "he", "her", "here", "hers", "him",
    "himself", "his", "how", "i", "if", "in", "into", "is", "it", "its", "itself", "me", "more", "most", "my", "myself", "no",
    "nor", "not", "of", "off", "on", "once", "only", "or", "other", "our", "ours", "ourselves", "out", "over", "own", "same",
    "she", "should", "so", "some", "such", "than", "that", "the", "their", "theirs", "them", "themselves", "then", "there",
    "these", "they", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "we", "were", "what",
    "when", "where", "which", "while", "who", "whom", "why", "with", "you", "your", "yours", "yourself", "yourselves"
}

def preprocess_text(text: str) -> str:
    """Clean text by lowercasing, stripping URLs/emails/symbols, and filtering stopwords."""
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r'\S+@\S+', ' ', text)  # remove emails
    text = re.sub(r'http\S+', ' ', text)  # remove URLs
    text = re.sub(r'[^a-zA-Z0-9\s\+\#\-\.]', ' ', text)  # remove special chars
    tokens = text.split()
    filtered = [w for w in tokens if w not in STOPWORDS and len(w) > 1]
    return " ".join(filtered)

def train_pipeline(
    dataset_path: str,
    text_col: str = "resume_text",
    label_col: str = "category",
    exp_col: str = "experience_level",
    output_dir: str = "models"
) -> Dict[str, Any]:
    """Train TF-IDF Vectorizer and Supervised Classifiers on the provided CSV dataset."""
    print(f"\n=======================================================")
    print(f"   RESUME ANALYZER ML MODEL TRAINING PIPELINE")
    print(f"=======================================================")
    print(f"Loading Dataset: {dataset_path}")
    
    if not os.path.exists(dataset_path):
        raise FileNotFoundError(f"Dataset file not found at: {dataset_path}")
        
    df = pd.read_csv(dataset_path)
    print(f"Dataset Loaded Successfully! Total Records: {len(df)}")
    print(f"Columns Found: {list(df.columns)}")
    
    if text_col not in df.columns or label_col not in df.columns:
        raise ValueError(f"Required columns '{text_col}' and '{label_col}' must exist in CSV.")
        
    # Drop missing rows
    df = df.dropna(subset=[text_col, label_col])
    print(f"Clean Records Count: {len(df)}")
    
    # Class breakdown
    category_counts = df[label_col].value_counts()
    print("\nClass Distribution:")
    for cat, cnt in category_counts.items():
        print(f"  - {cat}: {cnt} samples")
        
    # Preprocessing
    print("\n[Step 1/4] Preprocessing Text Corpus...")
    df['clean_text'] = df[text_col].apply(preprocess_text)
    
    # Encoding Labels
    label_encoder = LabelEncoder()
    df['encoded_label'] = label_encoder.fit_transform(df[label_col])
    
    # Train / Test Split
    print("\n[Step 2/4] Splitting Train (80%) and Test (20%) Sets...")
    # Handle stratify gracefully if small classes
    use_stratify = df['encoded_label'].value_counts().min() > 1
    X_train_raw, X_test_raw, y_train, y_test = train_test_split(
        df['clean_text'],
        df['encoded_label'],
        test_size=0.20,
        random_state=42,
        stratify=df['encoded_label'] if use_stratify else None
    )
    print(f"Training Set Size: {len(X_train_raw)} | Testing Set Size: {len(X_test_raw)}")
    
    # TF-IDF Vectorization
    print("\n[Step 3/4] Extracting TF-IDF Features (Unigrams & Bigrams)...")
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        max_features=3000,
        sublinear_tf=True
    )
    X_train = vectorizer.fit_transform(X_train_raw)
    X_test = vectorizer.transform(X_test_raw)
    print(f"TF-IDF Matrix Shape: {X_train.shape}")
    
    # Model Training: Logistic Regression
    print("\n[Step 4/4] Training Classifier (Logistic Regression)...")
    classifier = LogisticRegression(C=1.0, max_iter=500, solver='lbfgs')
    classifier.fit(X_train, y_train)
    
    # Evaluate
    y_pred = classifier.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='weighted', zero_division=0)
    
    print(f"\n=======================================================")
    print(f"             MODEL EVALUATION RESULTS")
    print(f"=======================================================")
    print(f"  Accuracy Score   : {accuracy * 100:.2f}%")
    print(f"  Weighted Precision: {precision * 100:.2f}%")
    print(f"  Weighted Recall   : {recall * 100:.2f}%")
    print(f"  Weighted F1-Score : {f1 * 100:.2f}%")
    print(f"=======================================================")
    
    report_text = classification_report(
        y_test,
        y_pred,
        target_names=label_encoder.classes_,
        zero_division=0
    )
    print("\nDetailed Classification Report:")
    print(report_text)
    
    # Train Experience Level Model if column exists
    exp_classifier = None
    exp_encoder = None
    exp_accuracy = 0.0
    if exp_col in df.columns:
        print(f"\nTraining Secondary Classifier for Experience Level ('{exp_col}')...")
        exp_encoder = LabelEncoder()
        df['encoded_exp'] = exp_encoder.fit_transform(df[exp_col])
        X_train_exp, X_test_exp, y_train_exp, y_test_exp = train_test_split(
            X_train_raw, df.loc[X_train_raw.index, 'encoded_exp'], test_size=0.20, random_state=42
        )
        X_tr_e = vectorizer.transform(X_train_exp)
        X_te_e = vectorizer.transform(X_test_exp)
        exp_classifier = LogisticRegression(max_iter=300)
        exp_classifier.fit(X_tr_e, y_train_exp)
        exp_pred = exp_classifier.predict(X_te_e)
        exp_accuracy = float(accuracy_score(y_test_exp, exp_pred))
        print(f"Experience Model Accuracy: {exp_accuracy * 100:.2f}%")

    # Create Output Directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Save Model Artifacts
    cat_model_path = os.path.join(output_dir, "resume_category_model.pkl")
    vectorizer_path = os.path.join(output_dir, "tfidf_vectorizer.pkl")
    encoder_path = os.path.join(output_dir, "label_encoder.pkl")
    metrics_path = os.path.join(output_dir, "metrics.json")
    
    with open(cat_model_path, "wb") as f:
        pickle.dump(classifier, f)
    with open(vectorizer_path, "wb") as f:
        pickle.dump(vectorizer, f)
    with open(encoder_path, "wb") as f:
        pickle.dump(label_encoder, f)
        
    if exp_classifier and exp_encoder:
        with open(os.path.join(output_dir, "experience_model.pkl"), "wb") as f:
            pickle.dump(exp_classifier, f)
        with open(os.path.join(output_dir, "experience_encoder.pkl"), "wb") as f:
            pickle.dump(exp_encoder, f)
            
    metrics_data = {
        "trained_at": datetime.now().isoformat(),
        "dataset_path": dataset_path,
        "dataset_records_count": len(df),
        "categories_count": len(label_encoder.classes_),
        "categories": list(label_encoder.classes_),
        "accuracy": float(accuracy),
        "precision": float(precision),
        "recall": float(recall),
        "f1_score": float(f1),
        "experience_accuracy": exp_accuracy
    }
    
    with open(metrics_path, "w") as f:
        json.dump(metrics_data, f, indent=2)
        
    print(f"\nArtifacts Saved to '{output_dir}/':")
    print(f"  - {cat_model_path}")
    print(f"  - {vectorizer_path}")
    print(f"  - {encoder_path}")
    print(f"  - {metrics_path}")
    print("\nTraining Complete Successfully!\n")
    return metrics_data

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train ML Resume Classifier")
    parser.add_argument("--dataset", type=str, default="dataset/resume_dataset_100.csv", help="Path to CSV dataset")
    parser.add_argument("--text_col", type=str, default="resume_text", help="CSV column for resume text")
    parser.add_argument("--label_col", type=str, default="category", help="CSV column for category label")
    parser.add_argument("--exp_col", type=str, default="experience_level", help="CSV column for experience level label")
    parser.add_argument("--output_dir", type=str, default="models", help="Output directory for pkl models")
    
    args = parser.parse_args()
    
    # Resolve default path relative to script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    ds_path = args.dataset
    if not os.path.isabs(ds_path):
        ds_path = os.path.join(script_dir, ds_path)
    out_dir = args.output_dir
    if not os.path.isabs(out_dir):
        out_dir = os.path.join(script_dir, out_dir)
        
    train_pipeline(
        dataset_path=ds_path,
        text_col=args.text_col,
        label_col=args.label_col,
        exp_col=args.exp_col,
        output_dir=out_dir
    )
