"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Step {
    target: string | HTMLElement;
    content: React.ReactNode;
    disableBeacon?: boolean;
    placement?: string | 'top' | 'bottom' | 'left' | 'right' | 'auto' | 'center';
    title?: React.ReactNode;
    [key: string]: any;
}

interface TourContextType {
    runTour: boolean;
    tourId: string | null;
    steps: Step[];
    startTour: (tourId: string, steps: Step[]) => void;
    stopTour: () => void;
    completeTour: (tourId: string) => Promise<void>;
    skipTour: (tourId: string) => Promise<void>;
}

// Default dummy context
const defaultContext: TourContextType = {
    runTour: false,
    tourId: null,
    steps: [],
    startTour: () => { },
    stopTour: () => { },
    completeTour: async () => { },
    skipTour: async () => { },
};

const TourContext = createContext<TourContextType>(defaultContext);

export function TourProvider({ children }: { children: React.ReactNode }) {
    // We are disabling the actual logic to avoid react-joyride issues with React 19
    // Just passing default context
    return (
        <TourContext.Provider value={defaultContext}>
            {children}
        </TourContext.Provider>
    );
}

export function useTour() {
    return useContext(TourContext);
}
