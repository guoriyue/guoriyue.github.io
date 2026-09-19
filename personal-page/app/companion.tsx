'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
const messages = [
    'A very good research assistant.',
    'An excellent choice of friend.',
    'Less debugging. More belly rubs.',
    'Keeping an eye on the pixels.',
];
export default function Companion() {
    const [pets, setPets] = useState(0);
    return (
        <div className="companion">
            <div className="pet-message" aria-live="polite">
                {pets
                    ? messages[(pets - 1) % messages.length]
                    : 'Every page needs a good dog.'}
            </div>
            <Button
                variant="ghost"
                className="collie-button"
                aria-label="Pet the pixel border collie"
                onClick={() => setPets((p) => p + 1)}
            >
                <img
                    key={pets}
                    className={pets ? 'collie petted' : 'collie'}
                    src="/border-collie.png"
                    alt="A happy black-and-white pixel border collie"
                    width="116"
                    height="116"
                />
                {pets > 0 && (
                    <span
                        key={`heart-${pets}`}
                        className="pet-heart"
                        aria-hidden="true"
                    >
                        ♥
                    </span>
                )}
            </Button>
            <span className="pet-hint">
                {pets ? 'ONE MORE PET?' : 'PSST… YOU CAN PET ME'}
            </span>
        </div>
    );
}
