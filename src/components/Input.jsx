import { Controller } from 'react-hook-form'

const Input = ({name="", type="text", control, rules={}, errors={}, ...props}) => {
  return (
    <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue=""
        render={({field: {value, onChange}})=>(
            <div className='flex flex-col gap-1'>
                <input value={value} type={type} onChange={onChange} {...props} />
                <p className='text-red-500'>{errors[name]?.message}</p>
            </div>
        )}
    />
  )
}

export default Input