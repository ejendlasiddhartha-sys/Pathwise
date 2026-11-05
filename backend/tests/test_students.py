import os
import sys
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from app.database import get_session
from app.main import app


class TestStudentEndpoints(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Create an in-memory database with StaticPool for testing
        cls.engine = create_engine(
            "sqlite://",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        SQLModel.metadata.create_all(cls.engine)

        def get_test_session():
            with Session(cls.engine) as session:
                yield session

        app.dependency_overrides[get_session] = get_test_session
        cls.client = TestClient(app)

    @classmethod
    def tearDownClass(cls):
        app.dependency_overrides.clear()
        SQLModel.metadata.drop_all(cls.engine)
        cls.engine.dispose()

    def setUp(self):
        # Clean table before each test
        with Session(self.engine) as session:
            session.exec(SQLModel.metadata.tables["student"].delete())
            session.commit()

    def test_create_student_success(self):
        """Test POST /api/students successfully creates a student profile."""
        payload = {
            "name": "Rahul",
            "email": "rahul@example.com",
            "education": "B.Tech CSE, 2nd Year",
            "career_goal": "Frontend Developer",
        }
        response = self.client.post("/api/students", json=payload)
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertIn("id", data)
        self.assertEqual(data["name"], "Rahul")
        self.assertEqual(data["email"], "rahul@example.com")
        self.assertEqual(data["education"], "B.Tech CSE, 2nd Year")
        self.assertEqual(data["career_goal"], "Frontend Developer")

    def test_retrieve_student_success(self):
        """Test GET /api/students/{id} retrieves an existing student profile."""
        payload = {
            "name": "Priya",
            "email": "priya@example.com",
            "education": "B.Sc Data Science, 3rd Year",
            "career_goal": "Data Analyst",
        }
        create_res = self.client.post("/api/students", json=payload)
        self.assertEqual(create_res.status_code, 201)
        student_id = create_res.json()["id"]

        get_res = self.client.get(f"/api/students/{student_id}")
        self.assertEqual(get_res.status_code, 200)
        data = get_res.json()
        self.assertEqual(data["id"], student_id)
        self.assertEqual(data["name"], "Priya")
        self.assertEqual(data["email"], "priya@example.com")
        self.assertEqual(data["education"], "B.Sc Data Science, 3rd Year")
        self.assertEqual(data["career_goal"], "Data Analyst")

    def test_retrieve_student_not_found(self):
        """Test GET /api/students/{id} returns 404 for nonexistent student."""
        response = self.client.get("/api/students/99999")
        self.assertEqual(response.status_code, 404)
        data = response.json()
        self.assertIn("detail", data)
        self.assertIn("not found", data["detail"].lower())

    def test_create_student_duplicate_email(self):
        """Test POST /api/students rejects duplicate email with 409 Conflict."""
        payload = {
            "name": "Rahul",
            "email": "rahul@example.com",
            "education": "B.Tech CSE, 2nd Year",
            "career_goal": "Frontend Developer",
        }
        first_res = self.client.post("/api/students", json=payload)
        self.assertEqual(first_res.status_code, 201)

        # Duplicate email with different case
        duplicate_payload = {
            "name": "Rahul Duplicate",
            "email": "RAHUL@EXAMPLE.COM",
            "education": "M.Tech CSE",
            "career_goal": "Fullstack Developer",
        }
        second_res = self.client.post("/api/students", json=duplicate_payload)
        self.assertEqual(second_res.status_code, 409)
        data = second_res.json()
        self.assertIn("detail", data)
        self.assertIn("already registered", data["detail"].lower())

    def test_create_student_invalid_email(self):
        """Test POST /api/students rejects invalid email address with 422."""
        payload = {
            "name": "Rahul",
            "email": "invalid-email-address",
            "education": "B.Tech CSE, 2nd Year",
            "career_goal": "Frontend Developer",
        }
        response = self.client.post("/api/students", json=payload)
        self.assertEqual(response.status_code, 422)

    def test_create_student_missing_required_fields(self):
        """Test POST /api/students rejects request with missing fields with 422."""
        payload = {
            "name": "Rahul",
            "email": "rahul@example.com",
            # missing education and career_goal
        }
        response = self.client.post("/api/students", json=payload)
        self.assertEqual(response.status_code, 422)

    def test_create_student_empty_strings(self):
        """Test POST /api/students rejects empty or whitespace-only fields with 422."""
        payload = {
            "name": "   ",
            "email": "rahul@example.com",
            "education": "B.Tech CSE, 2nd Year",
            "career_goal": "Frontend Developer",
        }
        response = self.client.post("/api/students", json=payload)
        self.assertEqual(response.status_code, 422)


if __name__ == "__main__":
    unittest.main()
