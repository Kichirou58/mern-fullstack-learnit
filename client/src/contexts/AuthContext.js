import { createContext, useReducer, useEffect } from "react";
import { authReducer } from "../reducers/authReducer";
import axios from "axios";
import { apiUrl, LOCAL_STORAGE_TOKEN_NAME } from "./constants";
import setAuthToken from "../utils/setAuthToken";
export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
    const [authState, dispatch] = useReducer(authReducer, {
        authLoading: true,
        isAuthenticated: false,
        user: null,
    });

    // Authenticate user
    const loadUser = async () => {
        // Set header default for all request after login success
        if (localStorage[LOCAL_STORAGE_TOKEN_NAME]) {
            setAuthToken(localStorage[LOCAL_STORAGE_TOKEN_NAME]);
        }
        // Check token
        try {
            const response = await axios.get(`${apiUrl}/auth`);
            if (response.data.success) {
                dispatch({
                    type: "SET_AUTH",
                    payload: { isAuthenticated: true, user: response.data.user },
                });
            }
        } catch (error) {
            localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
            setAuthToken(null);
            dispatch({
                type: "SET_AUTH",
                payload: { isAuthenticated: false, user: null },
            });
        }
    };

    useEffect(() => loadUser(), []);

    // Login
    const loginUser = async (userForm) => {
        try {
            const response = await axios.post(`${apiUrl}/auth/login`, userForm);
            // Save access token into local storage in browser of client
            if (response.data.success) {
                localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, response.data.accessToken);

                await loadUser();

                return response.data;
            }
        } catch (error) {
            //error return by backend
            if (error.response.data) {
                return error.response.data;
                //random error
            } else {
                return { success: false, message: error.message };
            }
        }
    };

    // Register User
    const registerUser = async (userForm) => {
        try {
            const response = await axios.post(`${apiUrl}/auth/register`, userForm);
            // Save access token into local storage in browser of client
            if (response.data.success) {
                localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, response.data.accessToken);

                await loadUser();

                return response.data;
            }
        } catch (error) {
            //error return by backend
            if (error.response.data) {
                return error.response.data;
                //random error
            } else {
                return { success: false, message: error.message };
            }
        }
    };

    // Logout
    const logoutUser = () => {
        localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
        dispatch({
            type: "SET_AUTH",
            payload: { isAuthenticated: false, user: null },
        });
    };

    // Context data
    const authContextData = { loginUser, registerUser, logoutUser, authState };
    // Return provider
    return <AuthContext.Provider value={authContextData}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
