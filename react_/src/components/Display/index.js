import React from 'react'
import Highlighted from '../Highlighted'
import { Wrapper, Item } from './index.styled'

const Display = ({
    list,
    query
}) => {
    return (
        <Wrapper>
            {list.map((text, index) => <Item key={text + index}><Highlighted text={text} highlight={query} /></Item>)}
        </Wrapper>
    )
}

export default Display;
