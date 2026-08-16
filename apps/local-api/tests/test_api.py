from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "Smart Learning Platform API" in data["message"]


def test_health():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"


def test_system_status():
    response = client.get("/api/v1/system-status")
    assert response.status_code == 200
    data = response.json()
    assert "ollama" in data
    assert "storage" in data


def test_list_packages():
    response = client.get("/api/v1/packages/active")
    assert response.status_code == 200
    data = response.json()
    assert "subjects" in data


if __name__ == "__main__":
    test_root()
    test_health()
    test_system_status()
    test_list_packages()
    print("[SUCCESS] All FastAPI backend tests passed successfully!")
