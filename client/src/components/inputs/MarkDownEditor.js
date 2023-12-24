import React, { memo } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const MarkDownEditor = ({ label, value, changeValue, name, invalidFields, setInvalidFields }) => {

    return (
        <div className='flex flex-col '>
            <span className='font-bold pb-2'>
                {label}:
            </span>
            <Editor
                apiKey={process.env.REACT_APP_MCETINY}
                initialValue={value}
                init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                        'advlist', 'autolink', 'link', 'image', 'lists', 'charmap', 'preview', 'anchor', 'pagebreak',
                        'searchreplace', 'wordcount', 'visualblocks', 'visualchars', 'code', 'fullscreen', 'insertdatetime',
                        'media', 'table', 'emoticons', 'template', 'help'
                    ],
                    toolbar: 'undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media | forecolor backcolor emoticons',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
                }}
                onChange={e => changeValue(prev => ({ ...prev, [name]: e.target.getContent() }))}
                onFocus={() => setInvalidFields && setInvalidFields([])}
            />
            {invalidFields?.some(el => el.name === name) && <small className='text-main text-sm my-2'>{invalidFields?.find(el => el.name === name)?.mes}</small>}
        </div>
    );
}

export default memo(MarkDownEditor)