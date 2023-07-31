import React from 'react'
import { FormProvider, useForm as useHookForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

interface IProps {
    defaultValues: any;
    validationSchema?: any;
}

const useForm = ({ validationSchema, defaultValues}: IProps) => {
    const methods = useHookForm({
        defaultValues: defaultValues,
        resolver: validationSchema ? zodResolver(validationSchema as any) : undefined,
        // shouldUnregister: true,
        // shouldFocusError: true,
        reValidateMode: 'onChange',
    });
    // The main function of the hook
    // All forms must be put inside this method
    // to enable them get the form state from the context
    const renderForm = React.useCallback((children: JSX.Element) => {
        return (
            <FormProvider {...methods}>
                {children}
            </FormProvider>
        )
    }, [])
  return {
    renderForm,
    formState: methods.formState,
    control: methods.control,
    watch: methods.watch,
    values: methods.getValues,
    reset: methods.reset,
    unregister:methods.unregister,
  }
}

export default useForm