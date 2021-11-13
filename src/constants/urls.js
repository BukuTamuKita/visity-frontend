import Cookies from "js-cookie";

export const SERVER_NAME = "http://127.0.0.1:8000";
export const BASE_URL = SERVER_NAME + "/api";

let JWT = null;
if (Cookies.get("JWT") !== undefined) {
    JWT = Cookies.get("JWT");
}

export const JWT_HEADER = JWT;

// Authorization
export const LOGIN_API = `${BASE_URL}/auth/loginAdmin`;
export const LOGOUT_API = `${BASE_URL}/auth/logout`;

// Host
export const SHOW_HOST = (hostId) => `${BASE_URL}/hosts/${hostId}`;
export const SHOW_HOSTS = `${BASE_URL}/hosts`;
export const SHOW_HOST_APPOINTMENT = (hostId) => `${BASE_URL}/hosts/${hostId}/appointments`;

// Scan KTP
export const SCAN_KTP = `${BASE_URL}/utils/scan_ktp`;

// Appointment Administration
export const SHOW_APPOINTMENT = `${BASE_URL}/appointments`;
export const CREATE_APPOINTMENT = `${BASE_URL}/appointments`;
export const UPDATE_APPOINTMENT = (meetingId) => `${BASE_URL}/appointments/${meetingId}`;
export const APPOINTMENT_DETAIL = (meetingId) => `${BASE_URL}/appointments/${meetingId}`;
export const EXPORT_DATA = `${BASE_URL}/utils/export_excel`;
export const DELETE_APPOINTMENT = (meetingId) => `${BASE_URL}/appointments/${meetingId}`;

// User Administration
export const CREATE_USER = `${BASE_URL}/users`;
export const SHOW_USER = (userId) => `${BASE_URL}/users/${userId}`;
export const SHOW_USERS = `${BASE_URL}/users`;
export const DELETE_USER = (userId) => `${BASE_URL}/users/${userId}`;

// Guest Administration
export const CREATE_GUEST = `${BASE_URL}/guests`;
export const SHOW_GUESTS = `${BASE_URL}/guests`;
export const FIND_GUEST = (guestId) => `${BASE_URL}/guests/${guestId}`;