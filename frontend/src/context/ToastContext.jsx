import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container-custom">
        {toasts.map(t => {
          let icon = 'bi-info-circle-fill text-primary';
          if (t.type === 'success') icon = 'bi-check-circle-fill text-success';
          if (t.type === 'error') icon = 'bi-exclamation-triangle-fill text-danger';

          return (
            <div key={t.id} className={`custom-toast ${t.type}`}>
              <i className={`bi ${icon} fs-5`}></i>
              <div className="flex-grow-1">{t.message}</div>
              <button
                type="button"
                className="btn-close btn-close-white ms-2"
                onClick={() => removeToast(t.id)}
              ></button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
