import React, {useState} from 'react';

const Input = ({
  type, 
  value,
  onChange,
  ...rest
}) => {
  return (
  <input 
    type={type} 
    value={value}
    onChange={({target})=>onChange(target.value)}
    {...rest} />
  )
}

export default Input;