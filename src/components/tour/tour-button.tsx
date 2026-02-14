"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { useTour } from './tour-provider';

interface TourButtonProps {
    tourId: string;
    tourSteps: any[];
    position?: 'bottom-right' | 'top-right';
}

export function TourButton({ tourId, tourSteps, position = 'bottom-right' }: TourButtonProps) {
    const { runTour, startTour } = useTour();

    const positionClasses = {
        'bottom-right': 'bottom-6 right-6',
        'top-right': 'top-6 right-6',
    };

    if (runTour) {
        return null; // Hide button during active tour
    }

    return (
        <Button
            onClick={() => startTour(tourId, tourSteps)}
            size="lg"
            className={`fixed ${positionClasses[position]} rounded-full h-14 w-14 p-0 shadow-lg hover:shadow-xl transition-all z-50`}
            title="Start Tour"
        >
            <HelpCircle className="h-6 w-6" />
        </Button>
    );
}
