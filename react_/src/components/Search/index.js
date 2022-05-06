import React from 'react'
import Input from '../common/Input'

import { Wrapper } from './index.styled'

const Search = ({onChange, value}) => {
    return (
        <Wrapper>
            <Input value={value} type="text" onChange={onChange} placeholder="Search" />
        </Wrapper>
    )
}

export default Search