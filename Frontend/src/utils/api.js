import toast from 'react-hot-toast';
const API_URL=import.meta.env.VITE_BACKEND_URL;
export const apiFetch=async (endpoint,options={})=>{
    try {
        const response=await fetch(`${API_URL}${endpoint}`,{
        headers:{
            "Content-Type":"application/json",
            ...options.headers,
        },
        ...options,
    })
    
    // Check for 403 status code
    if(response.status===403) {
        toast.error("Look at you, being all productive! That's enough enlightenment for one day. Come back tomorrow.",{duration:15000, icon:'👋',style: {
        background: '#1e293b', // Dark slate background (change to any hex code)
        color: '#ffffff',      // White text color
        border: '1px solid #475569', // Optional border
        padding: '16px',
        borderRadius: '12px',
    },});
        throw new Error("Daily limit reached");
    }
    
    // Check for other error status codes
    if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
    } catch (error) {
        // If it's not the daily limit error, still show the toast for debugging
        if(error.message !== "Daily limit reached") {
            console.error("API Error:", error);
        }
        throw error;
    }
}

// Test function to verify toast is working
export const testToast = () => {
    toast.error("Look at you, being all productive! That's enough enlightenment for one day. Come back tomorrow.",{duration:15000,icon:'👋',style: {
        background: '#1e293b', // Dark slate background (change to any hex code)
        color: '#ffffff',      // White text color
        border: '1px solid #475569', // Optional border
        padding: '16px',
        borderRadius: '12px',
    },});
}