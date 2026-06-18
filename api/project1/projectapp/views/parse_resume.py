from rest_framework.decorators import api_view
from rest_framework.response import Response
import fitz  # PyMuPDF
import re


@api_view(['POST'])
def parse_resume(request):
    file = request.FILES.get('resume')

    if not file:
        return Response({"error": "No file uploaded"}, status=400)

    try:
        # 🔹 Extract text from PDF
        text = ""
        pdf = fitz.open(stream=file.read(), filetype="pdf")

        for page in pdf:
            text += page.get_text()

        if not text.strip():
            return Response({"error": "No text found in PDF"}, status=400)

        # 🔹 DEBUG (optional)
        print("EXTRACTED TEXT:", text[:500])

        # -----------------------------
        # BASIC FIELD EXTRACTION
        # -----------------------------

        # 🔹 Email
        email_match = re.search(r"[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+", text)
        email = email_match.group() if email_match else ""

        # 🔹 Phone
        phone_match = re.search(r"\+?\d[\d\s\-]{8,15}", text)
        phone = phone_match.group() if phone_match else ""

        # 🔹 Name (very basic: first line)
        lines = text.split("\n")
        first_name = ""
        last_name = ""

        if lines:
            name_parts = lines[0].strip().split()
            if len(name_parts) >= 2:
                first_name = name_parts[0]
                last_name = name_parts[1]

        # 🔹 Skills (basic keyword match)
        common_skills = [
            "python", "java", "c", "c++", "javascript",
            "react", "django", "html", "css",
            "sql", "mongodb", "node", "flask"
        ]

        found_skills = []
        text_lower = text.lower()

        for skill in common_skills:
            if skill in text_lower:
                found_skills.append(skill.capitalize())

        skills = ", ".join(found_skills)

        # 🔹 Education (simple detection)
        education = ""
        if "btech" in text_lower or "bachelor" in text_lower:
            education = "Bachelor's Degree"
        elif "master" in text_lower:
            education = "Master's Degree"

        # 🔹 Experience (very basic)
        experience = ""
        if "intern" in text_lower:
            experience = "Internship experience"
        elif "year" in text_lower:
            experience = "Has experience"

        # -----------------------------
        # RESPONSE
        # -----------------------------
        return Response({
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "phone": phone,
            "skills": skills,  #  string (matches your model)
            "education": education,
            "experience": experience,
        })

    except Exception as e:
        print("ERROR:", str(e))
        return Response({"error": "Failed to parse resume"}, status=500)