import React from 'react'
import { Wrapper, Input } from './index.styled'

const InputComponent = ({ type, placeholder, onChange, value }) => {
    return (
        <Wrapper >
            <Input type={type} placeholder={placeholder} onChange={onChange} value={value} />
        </Wrapper>
    )
}

export default InputComponent