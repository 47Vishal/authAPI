import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const DelayedNavigate = ({ to, delay = 100 }) => {
  const [shouldNavigate, setShouldNavigate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldNavigate(true);
    }, delay);
    return () => clearTimeout(timer); // cleanup
  }, [delay]);

  return shouldNavigate ? <Navigate to={to} /> : null;
};

export default DelayedNavigate;
