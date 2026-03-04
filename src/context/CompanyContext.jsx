import React, { createContext, useState, useEffect, useContext } from 'react';
import companyService from '../api/companyService';
import GetCompanyId from '../api/GetCompanyId';
import { AuthContext } from './AuthContext';

export const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
    const { currentUser } = useContext(AuthContext);
    const [companySettings, setCompanySettings] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCompanySettings = async () => {
        const companyId = GetCompanyId();
        if (companyId) {
            try {
                const res = await companyService.getById(companyId);
                setCompanySettings(res.data);
            } catch (error) {
                console.error("Error fetching company settings:", error);
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchCompanySettings();
        } else {
            setCompanySettings(null);
            setLoading(false);
        }
    }, [currentUser]);

    const formatCurrency = (amount) => {
        const currency = companySettings?.currency || 'USD';

        // Map common currencies to appropriate locales if needed, or use a default
        let locale = 'en-US';
        if (currency === 'INR') locale = 'en-IN';
        if (currency === 'GBP') locale = 'en-GB';
        if (currency === 'EUR') locale = 'de-DE';

        try {
            return new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: currency
            }).format(amount || 0);
        } catch (e) {
            // Fallback for invalid currency codes
            return `${currency} ${(amount || 0).toFixed(2)}`;
        }
    };

    return (
        <CompanyContext.Provider value={{ companySettings, fetchCompanySettings, formatCurrency, loading }}>
            {children}
        </CompanyContext.Provider>
    );
};
