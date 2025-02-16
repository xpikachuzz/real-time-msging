import React from "react";

export const TextField = ({
    name,
    prompt,
    isTouched,
    error,
    inputProps,
    getFieldProps,
}) => {
    return (
        <div className="flex flex-col gap-1.5 py-2">
            <label className="text-xl">{prompt}:</label>
            <input
                {...getFieldProps}
                {...inputProps}
                name={name}
                className="px-2 py-1 border-2 rounded-md mr-14 text-slate-400 font-medium"
            />
            <div className="text-md text-red-500/80 font-semibold">
                {isTouched && error}
            </div>
        </div>
    );
};

export default TextField;
