import React from 'react';

const Field = ({ field }) => {
    return (
        <div className="field">
            {
                field.map((row) => {
                    return row.map((column) => {
                        return <div className={`dots ${column}`}></div>
                    })
                })
            }
        </div>
    );
};

export default Field;