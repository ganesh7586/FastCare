/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {

    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '');
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [dashData, setDashData] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

    const clearAdminSession = () => {
        setAToken('');
        localStorage.removeItem('aToken');
    };

    const handleApiFailure = (message) => {
        toast.error(message || 'Unable to complete the request');
        if (/admin login|admin session|not authorized|invalid signature|jwt expired/i.test(message || '')) {
            clearAdminSession();
        }
    };

    const handleApiError = (error) => {
        const message = error.response?.data?.message || error.message;
        toast.error(message);
        if (error.response?.status === 401) {
            clearAdminSession();
        }
    };

    const authHeaders = { Authorization: `Bearer ${aToken}` };

    const getAllDoctors = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/all-doctors', { headers: authHeaders });
            if (data.success) {
                setDoctors(data.doctors);
            } else {
                handleApiFailure(data.message);
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const changeAvailability = async (docId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId }, { headers: authHeaders });
            if (data.success) {
                toast.success(data.message);
                getAllDoctors();
            } else {
                handleApiFailure(data.message);
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const getAllAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: authHeaders });
            if (data.success) {
                setAppointments(data.appointments);
            } else {
                handleApiFailure(data.message);
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, { headers: authHeaders });
            if (data.success) {
                toast.success(data.message);
                getAllAppointments();
            } else {
                handleApiFailure(data.message);
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const getDashData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: authHeaders });
            if (data.success) {
                setDashData(data.dashData);
            } else {
                handleApiFailure(data.message);
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const value = {
        aToken,
        setAToken,
        backendUrl,
        doctors,
        getAllDoctors,
        changeAvailability,
        appointments,
        setAppointments,
        getAllAppointments,
        cancelAppointment,
        dashData,
        getDashData
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;
