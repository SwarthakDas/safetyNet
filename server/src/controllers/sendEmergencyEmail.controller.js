import { Resend } from 'resend';
import dotenv from 'dotenv';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Department } from '../models/department.model.js';
import * as geolib from 'geolib';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js'; // Adjust the path as necessary

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmergencyEmail = asyncHandler(async (req, res) => {
    if (!req.department) {
        throw new ApiError(403, "Unauthorized: Only departments can send emergency emails");
    }

    const { latitude, longitude, subject, message } = req.body;

    if (!latitude || !longitude || !subject || !message) {
        throw new ApiError(400, "Missing required fields: latitude, longitude, subject, message");
    }

    const incident_time = new Date().toLocaleString();
    const reported_by = req.department.name;

    const departments = await Department.find({}, "email name location");

    const nearbyDepartments = departments.filter((dept) => {
        if (!dept.location.latitude || !dept.location.longitude) return false;

        const distance = geolib.getDistance(
            { latitude, longitude },
            { latitude: parseFloat(dept.location.latitude), longitude: parseFloat(dept.location.longitude) }
        );

        return distance <= 20000; // 20km = 20000m
    });

    if (nearbyDepartments.length === 0) {
        throw new ApiError(404, "No departments found within 20km");
    }

    // Send emails using Resend API
    const emailPromises = nearbyDepartments.map(async (dept) => {
        try {
            const response = await resend.emails.send({
                from: 'onboarding@resend.dev',  // Replace with a verified sender email
                to: 'modandrandom@gmail.com',
                subject: `Emergency Issued Near You - ${subject}`,
                html: `
                    <p>Hello ${dept.name},</p>
                    <p>An emergency fire has been reported near your location. Please take immediate action and coordinate response efforts.</p>
                    <p><strong>Location:</strong> (${latitude}, ${longitude})</p>
                    <p><strong>Reported By:</strong> ${reported_by}</p>
                    <p><strong>Time:</strong> ${incident_time}</p>
                    <p>If assistance is required, please reach out to emergency services immediately.</p>
                    <p>${message}</p>
                    <p>Best regards,</p>
                    <p>SafetyNET Team</p>
                `,
            });

            console.log(`✅ Email sent to ${dept.email}:`, response);
        } catch (error) {
            console.error(`❌ Failed to send email to ${dept.email}:`, error.response?.data || error.message);
        }
    });

    await Promise.all(emailPromises);

    return res.status(200).json(
        new ApiResponse(200, { count: nearbyDepartments.length }, "Emergency emails sent successfully")
    );
});
