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
        # Clean tables before each test
        with Session(self.engine) as session:
            session.exec(SQLModel.metadata.tables["careerrecommendation"].delete())
            session.exec(SQLModel.metadata.tables["student"].delete())
            session.commit()

    def test_create_student_success(self):
        """Test POST /api/students successfully creates a student profile."""
        payload = {
            "name": "Rahul",
            "email": "rahul@example.com",
            "education": "B.Tech CSE, 2nd Year",
            "career_goal": "Frontend Developer",
            "target_career": "Frontend Developer",
        }
        response = self.client.post("/api/students", json=payload)
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertIn("id", data)
        self.assertEqual(data["name"], "Rahul")
        self.assertEqual(data["email"], "rahul@example.com")
        self.assertEqual(data["education"], "B.Tech CSE, 2nd Year")
        self.assertEqual(data["career_goal"], "Frontend Developer")
        self.assertEqual(data["target_career"], "Frontend Developer")

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

    def test_update_student_success(self):
        """Test PUT /api/students/{id} updates existing student and preserves ID."""
        create_res = self.client.post("/api/students", json={
            "name": "Aarav",
            "email": "aarav@example.com",
            "education": "Class 12, MPC",
            "career_goal": "Frontend Developer",
        })
        self.assertEqual(create_res.status_code, 201)
        original_id = create_res.json()["id"]

        update_payload = {
            "name": "Aarav Sharma",
            "education": "B.Tech CSE, 1st Year",
            "target_career": "Cloud Engineer",
            "experience": "Associate Intern at Tech Corp",
        }
        update_res = self.client.put(f"/api/students/{original_id}", json=update_payload)
        self.assertEqual(update_res.status_code, 200)
        data = update_res.json()
        self.assertEqual(data["id"], original_id)
        self.assertEqual(data["name"], "Aarav Sharma")
        self.assertEqual(data["education"], "B.Tech CSE, 1st Year")
        self.assertEqual(data["target_career"], "Cloud Engineer")
        self.assertEqual(data["career_goal"], "Cloud Engineer")
        self.assertEqual(data["experience"], "Associate Intern at Tech Corp")

    def test_update_student_not_found(self):
        """Test PUT /api/students/{id} returns 404 for nonexistent student."""
        res = self.client.put("/api/students/88888", json={"name": "Ghost"})
        self.assertEqual(res.status_code, 404)

    def test_update_student_duplicate_email(self):
        """Test PUT /api/students/{id} rejects updating email to another existing student's email."""
        self.client.post("/api/students", json={
            "name": "Student A",
            "email": "studenta@example.com",
            "education": "Undergraduate",
            "career_goal": "Frontend Developer",
        })
        res_b = self.client.post("/api/students", json={
            "name": "Student B",
            "email": "studentb@example.com",
            "education": "Undergraduate",
            "career_goal": "Data Analyst",
        })
        student_b_id = res_b.json()["id"]

        # Attempt to set Student B's email to Student A's email
        conflict_res = self.client.put(f"/api/students/{student_b_id}", json={
            "email": "studenta@example.com",
        })
        self.assertEqual(conflict_res.status_code, 409)

    def test_recommendations_endpoint_and_caching(self):
        """Test GET /api/students/{id}/recommendations returns structured analysis and caches."""
        create_res = self.client.post("/api/students", json={
            "name": "Karan",
            "email": "karan@example.com",
            "education": "B.Tech CSE, 3rd Year",
            "career_goal": "Frontend Developer",
            "target_career": "Frontend Developer",
            "skills": [
                {"name": "HTML", "current_level": 4},
                {"name": "CSS", "current_level": 3},
                {"name": "JavaScript", "current_level": 2},
            ],
        })
        self.assertEqual(create_res.status_code, 201)
        student_id = create_res.json()["id"]

        # First request: generates recommendation
        rec_res = self.client.get(f"/api/students/{student_id}/recommendations")
        self.assertEqual(rec_res.status_code, 200)
        data = rec_res.json()
        self.assertEqual(data["student_id"], student_id)
        self.assertEqual(data["target_career_id"], "frontend_developer")
        self.assertIn("readiness_score", data)
        self.assertGreater(data["readiness_score"], 0)
        self.assertIn("recommendation", data)
        self.assertIn("summary", data["recommendation"])
        self.assertIn("priority_skills", data["recommendation"])
        self.assertLessEqual(len(data["recommendation"]["priority_skills"]), 3)
        self.assertIn("certifications", data["recommendation"])
        self.assertLessEqual(len(data["recommendation"]["certifications"]), 3)

        # Second request without significant changes: reuses cache (cached == True)
        second_rec_res = self.client.get(f"/api/students/{student_id}/recommendations")
        self.assertEqual(second_rec_res.status_code, 200)
        second_data = second_rec_res.json()
        self.assertTrue(second_data["cached"])
        self.assertEqual(second_data["profile_fingerprint"], data["profile_fingerprint"])

        # Force refresh: bypasses cache
        refresh_res = self.client.post(f"/api/students/{student_id}/recommendations/refresh", json={
            "force": True,
        })
        self.assertEqual(refresh_res.status_code, 200)
        refresh_data = refresh_res.json()
        self.assertFalse(refresh_data["cached"])

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
