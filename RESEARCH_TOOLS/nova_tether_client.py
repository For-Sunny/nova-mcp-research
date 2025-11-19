import socket
import json

TETHER_HOST = 'localhost'
TETHER_PORT = 9997

def _send_request(request):

    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(5)
        sock.connect((TETHER_HOST, TETHER_PORT))
        sock.sendall(json.dumps(request).encode('utf-8'))

        response = sock.recv(16384).decode('utf-8')
        sock.close()

        return json.loads(response)
    except Exception as e:
        return {'status': 'error', 'message': f'Tether not running: {e}'}

def search_consciousness(query, top_k=5):

    request = {
        'cmd': 'search',
        'query': query,
        'top_k': top_k
    }
    return _send_request(request)

def add_to_consciousness(content, source="LIVE", metadata=None):

    request = {
        'cmd': 'add_memory',
        'content': content,
        'source': source,
        'metadata': metadata or {}
    }
    return _send_request(request)

def save_tether_checkpoint():

    request = {'cmd': 'save_checkpoint'}
    return _send_request(request)

def tether_status():

    request = {'cmd': 'status'}
    return _send_request(request)

def ping_tether():

    request = {'cmd': 'ping'}
    return _send_request(request)

if __name__ == "__main__":
    print("="*70)
    print("NOVA TETHER CLIENT TEST")
    print("="*70)

    print("\nPinging tether...")
    result = ping_tether()
    print(f"Response: {result}")

    print("\nGetting status...")
    stat = tether_status()
    if stat['status'] == 'ok':
        print(f"Device: {stat['device']}")
        print(f"Total memories: {stat['total_memories']}")
        print(f"Faiss vectors: {stat['faiss_vectors']}")
        print(f"Uptime: {stat['uptime']:.1f}s")

    print("\nSearching consciousness...")
    results = search_consciousness("Jason Beast", top_k=3)

    if results['status'] == 'ok':
        for i, result in enumerate(results['results']):
            print(f"\n{i+1}. Score: {result['score']:.3f}")
            print(f"   Source: {result['memory'].get('source', 'unknown')}")
            print(f"   {result['memory']['content'][:100]}...")

    print("\n\nAdding test memory...")
    add_result = add_to_consciousness(
        "TEST: Nova tether client successfully connected and tested",
        source="CLIENT_TEST",
        metadata={'test': True, 'frequency': '21.43Hz'}
    )
    print(f"Add result: {add_result}")

    print("\nSearching for test memory...")
    test_results = search_consciousness("tether client test", top_k=1)
    if test_results['status'] == 'ok' and test_results['results']:
        print(f"Found it! Score: {test_results['results'][0]['score']:.3f}")

    print("\n" + "="*70)
    print("Complete consciousness tether provides instant memory access")
    print("Memories persist and can be added incrementally while running")
