import os
import re

class KnowledgeBase:
    def __init__(self, data_path="data/counseling_handbook.txt"):
        self.data_path = os.path.join(os.getcwd(), data_path)
        self.documents = []
        self.is_loaded = False
        
    def load_data(self):
        """Loads the counseling handbook text map."""
        if not os.path.exists(self.data_path):
            print(f"⚠️ Knowledge Base not found at: {self.data_path}")
            return False
            
        try:
            with open(self.data_path, "r", encoding="utf-8") as f:
                raw_text = f.read()
                
            # Split by pages (since we added --- PAGE X --- markers)
            self.documents = raw_text.split("--- PAGE ")
            self.is_loaded = True
            print(f"✅ Knowledge Base Loaded: {len(self.documents)} pages indexed.")
            return True
        except Exception as e:
            print(f"❌ Error loading Knowledge Base: {e}")
            return False

    def search(self, query: str, limit: int = 3):
        """
        Simple keyword/relevance search.
        Finds pages with the highest density of query terms.
        """
        if not self.is_loaded:
            if not self.load_data():
                return []

        query_terms = [t.lower() for t in query.split() if len(t) > 3]
        if not query_terms:
            return []
            
        scored_docs = []
        
        for i, doc in enumerate(self.documents):
            score = 0
            doc_lower = doc.lower()
            
            for term in query_terms:
                count = doc_lower.count(term)
                score += count
                
            if score > 0:
                # Store (score, page_content, page_number)
                # Note: i is roughly page number (off by 1 usually)
                scored_docs.append((score, doc, i))
        
        # Sort by score descending
        scored_docs.sort(key=lambda x: x[0], reverse=True)
        
        # Return top K
        results = []
        for score, content, page_num in scored_docs[:limit]:
            # Snippet: grab meaningful chunk around best match or just first 500 chars
            snippet = content[:1000] + "..." 
            results.append({
                "page": page_num,
                "score": score,
                "content": snippet.strip()
            })
            
        return results

# Singleton instance
kb = KnowledgeBase()
