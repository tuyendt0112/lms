import React from 'react'

const InputFields = ({ value, setValue, nameKey, type, invalidFields, setInvalidFields }) => {

    return (
        <div className='w-full relative'>
            {value.trim() !== '' && <label className='text-[12px] animate-slide-top-sm absolute top-0 left-[8px] block bg-white px-1' htmlFor={nameKey}>{nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}</label>}
            <input
                type={type || 'text'}
                className='px-4 py-2 rounded-sm border w-full my-2 placeholder:italic outline-none'
                placeholder={nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}
                value={value}
                onChange={e => setValue(prev => ({ ...prev, [nameKey]: e.target.value }))}
                onFocus={() => setInvalidFields([])}
            ></input>
            {invalidFields?.some(el => el.name === nameKey) && <small className='text-main italic'>{invalidFields.find(el => el.name === nameKey)?.mes}</small>}
        </div>

    )
}
export default InputFields