import { createContext, useState, useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';


export const AppContext = createContext();

const AppContextProvider = (props) => {

    const currencySymbol = "₹";
    const backendUrl = "https://appointment-booking-app-backend.onrender.com";
    const [doctors, setDoctors] = useState([]);
    
    //  save user input authentication token and save into local state
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false)
    
    const [userData, setUserData] = useState(false);

    const getDoctorsData = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/doctor/list')
            if (data.success) {
                setDoctors(data.doctors)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // get user profile data 
    const loadUserProfileData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/user/get-profile', {headers:{ token }})
            if (data.success) {
                setUserData(data.userData)
            }
            else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const values = {
        doctors,getDoctorsData,
        currencySymbol,
        token, setToken,
        backendUrl,
        loadUserProfileData,
        userData,
        setUserData  
    }

    useEffect(() => {
        getDoctorsData()
    }, [])

    useEffect(() => {
        if (token) {
            loadUserProfileData()
        }
        else {
            setUserData(false);
        }
    },[token])

    return (
        <AppContext.Provider value={values}>
            {props.children}
        </AppContext.Provider>
    )
}
export default AppContextProvider