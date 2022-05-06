import React, { useEffect, useState } from 'react'
import Display from '../Display'
import Search from '../Search'
import {
    useLocation,
    useNavigate
  } from "react-router-dom";
import useDebounce from '../../hooks/useDebounce';

const find = (data, search) => {
    if(search === '') return data
    return data.filter(item => {
        return item.toLowerCase().includes(search.toLowerCase())
    })
}

const SimpleSearch = ({data}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [people, setpeople] = useState([])
    const [ search, setSearch ] = useState('')
    const debounceSearch = useDebounce(search, 500)
    
    useEffect(() => {
        setpeople([...data])

        const searchQuery = new URLSearchParams(location.search).get('s')
        if(searchQuery && searchQuery.length >= 1){
            setpeople(find(data, searchQuery));
            setSearch(String(searchQuery));
        }
    }, [])

    useEffect(() => {
        handleNavigation(search)
    }, [debounceSearch])

    const handleNavigation = (search) => {
        if(window && window.history) {
            window.history.replaceState(null, '', '?s='+ search);

            if(search.length === 0){
                window.history.replaceState(null, '', '');
            }
        }else{
            navigate({ search: `?s=${search}` }, { replace:true })

            if(search.length === 0){
                navigate({ search: "" }, { replace:true })
            }
        }
    }

    const handleSearch = (e) => {
        const { value } = e.target;
        setSearch(value)
        setpeople(find(data, value))
    }

    return (
        <>
            <Search value={search} onChange={handleSearch} />
            <Display 
                query={search}
                list={people}
            />
        </>
    )
}

export default SimpleSearch