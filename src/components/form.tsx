"use client"
import React, { useState } from 'react';

const CnftForm = () => {
    const [name, setName] = useState('');
    const [uniqueValue, setUniqueValue] = useState('');
    const [image, setImage] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">CNFT Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="uniqueValue">Unique Value:</label>
                <input
                    type="text"
                    id="uniqueValue"
                    value={uniqueValue}
                    onChange={(e) => setUniqueValue(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="image">Upload Image:</label>
                <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                    required
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default CnftForm;