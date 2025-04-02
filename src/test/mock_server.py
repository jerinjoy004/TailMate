from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, List
import uvicorn
from uuid import uuid4
from datetime import datetime

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# In-memory storage for testing
db = {
    "profiles": {},
    "donation_requests": {},
    "doctor_status": {},
    "posts": {},
    "comments": {},
    "notifications": {}
}

# Models matching Supabase structure
class Profile(BaseModel):
    id: str
    username: str
    usertype: str
    locality: Optional[str] = None
    licensenumber: Optional[str] = None
    isverified: Optional[bool] = False
    phone: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class DonationRequest(BaseModel):
    id: str
    user_id: str
    title: str
    description: str
    amount: float
    created_at: Optional[datetime] = None
    fulfilled: bool = False

class DonationUpdate(BaseModel):
    fulfilled: bool

class DoctorStatus(BaseModel):
    doctor_id: str
    is_online: bool
    phone_number: str
    created_at: Optional[datetime] = None

# Profile endpoints
@app.post("/profiles")
async def create_profile(profile: Profile):
    profile.created_at = datetime.now()
    profile.updated_at = datetime.now()
    db["profiles"][profile.id] = profile.dict()
    return {"status": "success", "data": profile}

@app.get("/profiles/{profile_id}")
async def get_profile(profile_id: str):
    if profile_id not in db["profiles"]:
        raise HTTPException(status_code=404, detail="Profile not found")
    return {"data": db["profiles"][profile_id]}

@app.put("/profiles/{profile_id}")
async def update_profile(profile_id: str, profile: Profile):
    if profile_id not in db["profiles"]:
        raise HTTPException(status_code=404, detail="Profile not found")
    profile.updated_at = datetime.now()
    db["profiles"][profile_id] = profile.dict()
    return {"status": "success", "data": profile}

# Donation endpoints
@app.post("/donation_requests")
async def create_donation(donation: DonationRequest):
    donation.created_at = datetime.now()
    db["donation_requests"][donation.id] = donation.dict()
    return {"status": "success", "data": donation}

@app.get("/donation_requests")
async def get_donations(user_id: Optional[str] = None):
    donations = list(db["donation_requests"].values())
    if user_id:
        donations = [d for d in donations if d["user_id"] == user_id]
    return {"data": donations}

@app.put("/donation_requests/{donation_id}")
async def update_donation(donation_id: str, update: DonationUpdate):
    if donation_id not in db["donation_requests"]:
        raise HTTPException(status_code=404, detail="Donation request not found")
    donation = db["donation_requests"][donation_id]
    donation["fulfilled"] = update.fulfilled
    return {"status": "success", "data": donation}

# Doctor status endpoints
@app.post("/doctor_status")
async def create_doctor_status(status: DoctorStatus):
    status.created_at = datetime.now()
    db["doctor_status"][status.doctor_id] = status.dict()
    return {"status": "success", "data": status}

@app.get("/doctor_status/{doctor_id}")
async def get_doctor_status(doctor_id: str):
    if doctor_id not in db["doctor_status"]:
        raise HTTPException(status_code=404, detail="Doctor status not found")
    return {"data": db["doctor_status"][doctor_id]}

# Clear database (for testing)
@app.post("/test/clear")
async def clear_db():
    for table in db:
        db[table].clear()
    return {"status": "success"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 