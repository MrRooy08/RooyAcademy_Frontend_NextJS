import {useState} from "react";

export default function useFormValidation (initialValues, validate, onSubmit) {
    const [values , setValues ] = useState (initialValues);
    const [errors , setErrors ] = useState ({});

    const handleChange = (event) => {
        const {name , value } = event.target;
        setValues ({
            ...values, 
            [name]: value
        });
    };

    const handleSubmit = (event) => {
        if ( event ) {
            event.preventDefault ();
        }
        const validationErrors = validate (values);
        setErrors (validationErrors);
        if(Object.keys (validationErrors).length === 0){
            onSubmit(values);
        }
    }

    return {
        values, 
        errors,
        handleChange,
        handleSubmit,
    };
};