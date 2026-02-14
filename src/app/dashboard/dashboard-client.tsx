"use client";

import { useEffect } from 'react';
import { TourButton } from '@/components/tour/tour-button';
import { dashboardTour } from '@/components/tour/tours';
import { useTour } from '@/components/tour/tour-provider';

export function DashboardClient() {
    const { startTour } = useTour();

    useEffect(() => {
        // Auto-start tour for new users after 2 seconds
        const checkTourStatus = async () => {
            try {
                const response = await fetch('/api/tours/status');
                if (!response.ok) {
                    console.error('Failed to fetch tour status');
                    return;
                }

                const data = await response.json();

                const dashboardTourData = data.tours?.find((t: any) => t.tourId === 'dashboard');

                // If user hasn't completed or skipped the dashboard tour, auto-start it
                if (!dashboardTourData) {
                    setTimeout(() => {
                        startTour('dashboard', dashboardTour);
                    }, 2000);
                }
            } catch (error) {
                console.error('Failed to check tour status:', error);
            }
        };

        checkTourStatus();
    }, [startTour]);

    return (
        <TourButton tourId="dashboard" tourSteps={dashboardTour} position="bottom-right" />
    );
}
