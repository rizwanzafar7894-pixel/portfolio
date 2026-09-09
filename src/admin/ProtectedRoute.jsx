import { Navigate,useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
export default function ProtectedRoute({children}){const {user,loading,admin}=useAuth();const loc=useLocation();if(loading)return <div className="admin-loading">Checking admin access…</div>;if(!user)return <Navigate to="/admin/login" replace state={{from:loc.pathname}}/>;if(!admin)return <div className="admin-denied"><h1>Access denied</h1><p>Your account is signed in but does not have the administrator claim.</p></div>;return children;}
