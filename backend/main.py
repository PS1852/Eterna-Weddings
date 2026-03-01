from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import json
from datetime import datetime
import os

app = FastAPI(title="Eterna Weddings API")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class Inquiry(BaseModel):
    name: str
    email: str
    phone: str
    wedding_date: Optional[str] = None
    message: str

@app.get("/")
def read_root():
    return {"message": "Welcome to the Eterna Weddings API"}

@app.post("/api/inquiry")
async def handle_inquiry(inquiry: Inquiry):
    try:
        # Create an inquiries file if it doesn't exist
        inquiries_file = "inquiries.json"
        
        # Load existing inquiries
        existing_inquiries = []
        if os.path.exists(inquiries_file):
            with open(inquiries_file, 'r') as f:
                try:
                    existing_inquiries = json.load(f)
                except json.JSONDecodeError:
                    existing_inquiries = []
        
        # Add new inquiry
        inquiry_data = inquiry.model_dump()
        inquiry_data['timestamp'] = datetime.now().isoformat()
        existing_inquiries.append(inquiry_data)
        
        # Save updated inquiries
        with open(inquiries_file, 'w') as f:
            json.dump(existing_inquiries, f, indent=4)
            
        print(f"New inquiry received from {inquiry.name} ({inquiry.email})")
            
        return {"status": "success", "message": "Inquiry received successfully. Our team will contact you soon."}
    except Exception as e:
        print(f"Error processing inquiry: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
