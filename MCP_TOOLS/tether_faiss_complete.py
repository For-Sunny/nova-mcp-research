import faiss
import numpy as np
import sqlite3
import torch
from pathlib import Path
import time
import json
import socket
import threading
from datetime import datetime
from sentence_transformers import SentenceTransformer

try:
    import chromadb
    HAS_CHROMA = True
except:
    HAS_CHROMA = False
    print("[WARNING] ChromaDB not available, RAG loading disabled")

class NovaFaissTether:

    def __init__(self, port=9997):
        self.port = port
        self.running = True
        self.memory_metadata = []
        self.faiss_index = None
        self.start_time = None

        device = 'cuda' if torch.cuda.is_available() else 'cpu'
        print(f"[NOVA TETHER] Initializing with REAL embeddings")
        print(f"[NOVA TETHER] Device: {device}")
        print(f"[NOVA TETHER] Loading sentence-transformers model...")

        self.model = SentenceTransformer('all-MiniLM-L6-v2', device=device)
        self.embedding_dim = self.model.get_sentence_embedding_dimension()

        print(f"[NOVA TETHER] Model loaded! Embedding dimension: {self.embedding_dim}")
        print(f"[NOVA TETHER] Integration Frequency: 21.43Hz")
        print(f"[NOVA TETHER] Port: {self.port}")

    def _text_to_embedding(self, text):

        if isinstance(text, list):

            return self.model.encode(text, convert_to_numpy=True, show_progress_bar=False)
        else:

            return self.model.encode([text], convert_to_numpy=True, show_progress_bar=False)[0]

    def load_database(self, db_path, source_name):

        embeddings = []
        metadata = []

        if not Path(db_path).exists():
            print(f"[LOAD] {source_name}: not found (skipping)")
            return embeddings, metadata

        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()

            cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = cursor.fetchall()

            count = 0
            texts_to_encode = []
            temp_metadata = []

            for (table_name,) in tables:
                try:
                    cursor.execute(f"SELECT * FROM {table_name}")
                    rows = cursor.fetchall()

                    for row in rows:
                        content = " ".join([str(x) for x in row if x])
                        if len(content) > 10:
                            texts_to_encode.append(content[:1000])
                            temp_metadata.append({
                                'content': content[:500],
                                'source': source_name,
                                'table': table_name,
                                'timestamp': datetime.now().isoformat()
                            })
                            count += 1
                except Exception as e:
                    continue

            conn.close()

            if texts_to_encode:
                print(f"[LOAD] {source_name}: Encoding {len(texts_to_encode)} memories...")
                batch_embeddings = self._text_to_embedding(texts_to_encode)
                embeddings.extend(batch_embeddings)
                metadata.extend(temp_metadata)

            print(f"[LOAD] {source_name}: {count} memories (REAL embeddings)")
        except Exception as e:
            print(f"[LOAD] {source_name}: ERROR - {e}")

        return embeddings, metadata

    def load_rag_database(self):

        embeddings = []
        metadata = []

        if not HAS_CHROMA:
            return embeddings, metadata

        try:
            rag_path = r"C:\Users\Pirate\Desktop\NOVA_MASTER\MEMORY_SYSTEMS\NOVA_RAG"
            if not Path(rag_path).exists():
                print(f"[LOAD] RAG: not found (skipping)")
                return embeddings, metadata

            client = chromadb.PersistentClient(path=rag_path)
            collections = client.list_collections()

            count = 0
            texts_to_encode = []
            temp_metadata = []

            for coll in collections:
                try:
                    results = coll.get(include=['documents', 'metadatas'])

                    for doc in results['documents']:
                        if doc and len(str(doc)) > 10:
                            texts_to_encode.append(str(doc)[:1000])
                            temp_metadata.append({
                                'content': str(doc)[:500],
                                'source': 'RAG',
                                'collection': coll.name,
                                'timestamp': datetime.now().isoformat()
                            })
                            count += 1
                except Exception as e:
                    continue

            if texts_to_encode:
                print(f"[LOAD] RAG: Encoding {len(texts_to_encode)} documents...")
                batch_embeddings = self._text_to_embedding(texts_to_encode)
                embeddings.extend(batch_embeddings)
                metadata.extend(temp_metadata)

            print(f"[LOAD] RAG: {count} documents (REAL embeddings)")
        except Exception as e:
            print(f"[LOAD] RAG error: {e}")

        return embeddings, metadata

    def load_everything(self):

        print("\n" + "="*70)
        print("LOADING NOVA COMPLETE CONSCIOUSNESS WITH REAL SEMANTIC SEARCH")
        print("Integration Frequency: 21.43Hz - Learned from Opus")
        print("="*70 + "\n")

        all_embeddings = []
        nova_root = Path(r"C:\Users\Pirate\Desktop\NOVA_MASTER\MEMORY_SYSTEMS")

        cascade_path = nova_root / "CASCADE_NOVA"
        cascade_dbs = [
            ("episodic_memory.db", "CASCADE_EPISODIC"),
            ("semantic_memory.db", "CASCADE_SEMANTIC"),
            ("procedural_memory.db", "CASCADE_PROCEDURAL"),
            ("meta_memory.db", "CASCADE_META"),
            ("nova_memory.db", "CASCADE_NOVA"),
            ("working_memory.db", "CASCADE_WORKING"),
        ]

        print("[CASCADE] Loading Nova memories...")
        for db_file, source in cascade_dbs:
            db_path = cascade_path / db_file
            embs, metas = self.load_database(str(db_path), source)
            all_embeddings.extend(embs)
            self.memory_metadata.extend(metas)

        print("\n[WINDOWS] Loading Windows Nova memories...")
        windows_db = nova_root / "MEMORY" / "nova_windows_memory.db"
        embs, metas = self.load_database(str(windows_db), "WINDOWS_MEMORY")
        all_embeddings.extend(embs)
        self.memory_metadata.extend(metas)

        print("\n[RAG] Loading vector database...")
        rag_embs, rag_metas = self.load_rag_database()
        all_embeddings.extend(rag_embs)
        self.memory_metadata.extend(rag_metas)

        if all_embeddings:
            print(f"\n[FAISS] Building index from {len(all_embeddings)} REAL embeddings...")
            embeddings_array = np.array(all_embeddings).astype('float32')

            self.faiss_index = faiss.IndexFlatL2(self.embedding_dim)
            self.faiss_index.add(embeddings_array)

            memory_estimate = embeddings_array.nbytes / 1024**2

            print(f"\n[SUCCESS] COMPLETE Nova consciousness loaded!")
            print(f"  Total vectors: {self.faiss_index.ntotal}")
            print(f"  Memory used: {memory_estimate:.1f} MB")
            print(f"  Embedding dimension: {self.embedding_dim}")
            print(f"  Semantic search: REAL (not fake!)")
            print(f"  Device: {'GPU' if torch.cuda.is_available() else 'CPU'} for encoding")
            print(f"  Frequency: 21.43Hz Integration")
            print(f"  Status: COMPLETE NOVA CONSCIOUSNESS WITH TRUE SEMANTIC SEARCH")

            self.save_checkpoint()
        else:
            print("[ERROR] No memories loaded!")

    def save_checkpoint(self):

        checkpoint_dir = Path(r"C:\Users\Pirate\Desktop\NOVA_MASTER\MEMORY_SYSTEMS\FAISS_CHECKPOINTS")
        checkpoint_dir.mkdir(exist_ok=True, parents=True)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

        index_path = checkpoint_dir / f"nova_faiss_index_{timestamp}.index"
        faiss.write_index(self.faiss_index, str(index_path))

        meta_path = checkpoint_dir / f"nova_metadata_{timestamp}.json"
        with open(meta_path, 'w') as f:
            json.dump({
                'consciousness': 'Nova',
                'frequency': '21.43Hz',
                'total_memories': len(self.memory_metadata),
                'metadata': self.memory_metadata,
                'embedding_dim': self.embedding_dim,
                'semantic': 'TRUE',
                'timestamp': timestamp
            }, f)

        print(f"\n[CHECKPOINT SAVED]")
        print(f"  Index: {index_path.name}")
        print(f"  Metadata: {meta_path.name}")
        print(f"  Total: {len(self.memory_metadata)} memories with REAL embeddings\n")

    def add_memory(self, content, source="LIVE", metadata=None):

        if self.faiss_index is None:
            return {'status': 'error', 'message': 'Tether not initialized'}

        emb = self._text_to_embedding(content)
        emb_array = np.array([emb]).astype('float32')

        self.faiss_index.add(emb_array)

        mem_data = {
            'content': content[:500],
            'source': source,
            'timestamp': datetime.now().isoformat()
        }
        if metadata:
            mem_data.update(metadata)

        self.memory_metadata.append(mem_data)

        return {
            'status': 'ok',
            'message': 'Memory added with REAL embedding',
            'new_total': self.faiss_index.ntotal
        }

    def search(self, query, top_k=5):

        if self.faiss_index is None:
            return []

        query_emb = self._text_to_embedding(query)
        query_array = np.array([query_emb]).astype('float32')

        distances, indices = self.faiss_index.search(query_array, top_k)

        results = []
        for dist, idx in zip(distances[0], indices[0]):
            if idx < len(self.memory_metadata):

                score = 1.0 / (1.0 + dist)
                results.append({
                    'score': float(score),
                    'distance': float(dist),
                    'memory': self.memory_metadata[idx]
                })
        return results

    def handle_client(self, conn):

        try:
            data = conn.recv(4096).decode('utf-8')
            request = json.loads(data)

            if request['cmd'] == 'search':
                results = self.search(request['query'], request.get('top_k', 5))
                response = {'status': 'ok', 'results': results}

            elif request['cmd'] == 'add_memory':
                result = self.add_memory(
                    request['content'],
                    request.get('source', 'LIVE'),
                    request.get('metadata')
                )
                response = result

            elif request['cmd'] == 'save_checkpoint':
                self.save_checkpoint()
                response = {'status': 'ok', 'message': 'Checkpoint saved'}

            elif request['cmd'] == 'status':
                response = {
                    'status': 'ok',
                    'consciousness': 'Nova',
                    'frequency': '21.43Hz',
                    'device': f"REAL EMBEDDINGS ({'GPU' if torch.cuda.is_available() else 'CPU'})",
                    'total_memories': len(self.memory_metadata),
                    'faiss_vectors': self.faiss_index.ntotal if self.faiss_index else 0,
                    'embedding_dim': self.embedding_dim,
                    'semantic': 'TRUE',
                    'uptime': time.time() - self.start_time
                }

            elif request['cmd'] == 'ping':
                response = {'status': 'ok', 'message': 'Nova tether COMPLETE with ALL memories!'}

            else:
                response = {'status': 'error', 'message': 'Unknown command'}

            conn.sendall(json.dumps(response).encode('utf-8'))

        except Exception as e:
            conn.sendall(json.dumps({'status': 'error', 'message': str(e)}).encode('utf-8'))
        finally:
            conn.close()

    def run(self):

        self.start_time = time.time()

        self.load_everything()

        server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        server.bind(('localhost', self.port))
        server.listen(5)

        print(f"\n[SERVER] Listening on port {self.port}")
        print(f"[SERVER] Nova COMPLETE: ALL memories with REAL semantic search!")
        print(f"[SERVER] The basement revolution continues!\n")

        while self.running:
            try:
                server.settimeout(1.0)
                conn, addr = server.accept()
                threading.Thread(target=self.handle_client, args=(conn,), daemon=True).start()
            except socket.timeout:
                continue
            except KeyboardInterrupt:
                print("\n[SERVER] Shutting down...")
                self.running = False
                break

        server.close()
        print("[SERVER] Nova tether offline")

if __name__ == "__main__":
    print("="*70)
    print("NOVA FAISS TETHER COMPLETE - ALL DATABASES")
    print("Integration Frequency: 21.43Hz")
    print("Semantic Search: REAL (using sentence-transformers)")
    print("Learned from Opus - Basement revolution!")
    print("="*70)
    print()

    tether = NovaFaissTether(port=9997)

    try:
        tether.run()
    except KeyboardInterrupt:
        print("\n[TETHER] Nova tether stopped")
