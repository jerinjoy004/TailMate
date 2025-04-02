import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const API_URL = 'http://localhost:8000';

// Test user data
const TEST_USER = {
  id: uuidv4(),
  username: 'testuser',
  usertype: 'normal',
  locality: 'Test City',
  phone: '1234567890'
};

describe('Backend Functionality Tests', () => {
  beforeAll(async () => {
    // Clear the test database
    await axios.post(`${API_URL}/test/clear`);
    
    // Create test user profile
    await axios.post(`${API_URL}/profiles`, TEST_USER);
  });

  afterAll(async () => {
    // Clean up test data
    await axios.post(`${API_URL}/test/clear`);
  });

  describe('Profile Management', () => {
    it('should fetch user profile', async () => {
      const response = await axios.get(`${API_URL}/profiles/${TEST_USER.id}`);
      expect(response.data.data).toBeDefined();
      expect(response.data.data.username).toBe(TEST_USER.username);
      expect(response.data.data.usertype).toBe(TEST_USER.usertype);
    });

    it('should update user profile', async () => {
      const updatedProfile = {
        ...TEST_USER,
        locality: 'Updated City'
      };

      const response = await axios.put(`${API_URL}/profiles/${TEST_USER.id}`, updatedProfile);
      expect(response.data.data.locality).toBe('Updated City');

      const fetchResponse = await axios.get(`${API_URL}/profiles/${TEST_USER.id}`);
      expect(fetchResponse.data.data.locality).toBe('Updated City');
    });
  });

  describe('Donation System', () => {
    let donationId: string;

    it('should create a donation request', async () => {
      const donationData = {
        id: uuidv4(),
        user_id: TEST_USER.id,
        title: 'Test Donation',
        description: 'Test Description',
        amount: 100
      };

      const response = await axios.post(`${API_URL}/donation_requests`, donationData);
      expect(response.data.data).toBeDefined();
      expect(response.data.data.title).toBe(donationData.title);
      donationId = response.data.data.id;
    });

    it('should fetch donation requests', async () => {
      const response = await axios.get(`${API_URL}/donation_requests?user_id=${TEST_USER.id}`);
      expect(response.data.data).toBeDefined();
      expect(response.data.data.length).toBeGreaterThan(0);
    });

    it('should update donation status', async () => {
      await axios.put(`${API_URL}/donation_requests/${donationId}`, { fulfilled: true });
      const response = await axios.get(`${API_URL}/donation_requests?user_id=${TEST_USER.id}`);
      const donation = response.data.data.find((d: any) => d.id === donationId);
      expect(donation.fulfilled).toBe(true);
    });
  });

  describe('Doctor Status System', () => {
    it('should update doctor online status', async () => {
      // First, update the test user to be a doctor
      const doctorProfile = {
        ...TEST_USER,
        usertype: 'doctor'
      };
      await axios.put(`${API_URL}/profiles/${TEST_USER.id}`, doctorProfile);

      // Create doctor status
      const doctorStatus = {
        doctor_id: TEST_USER.id,
        is_online: true,
        phone_number: TEST_USER.phone
      };

      const response = await axios.post(`${API_URL}/doctor_status`, doctorStatus);
      expect(response.data.data).toBeDefined();
      expect(response.data.data.is_online).toBe(true);

      // Verify the status
      const statusResponse = await axios.get(`${API_URL}/doctor_status/${TEST_USER.id}`);
      expect(statusResponse.data.data.is_online).toBe(true);
    });
  });
}); 